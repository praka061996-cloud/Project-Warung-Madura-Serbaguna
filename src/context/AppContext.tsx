import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  Shop,
  Product,
  Order,
  CartItem,
  PartnershipRequest,
  ChatMessage,
  Report,
} from '../types/index.ts';
import {
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PARTNERSHIPS,
  INITIAL_REPORTS,
} from '../data/seedData.ts';
import { calculateOrderTotal, validateItemQuantity } from '../utils/cart.ts';
import { canTransitionOrder, OrderStatus } from '../utils/orderStateMachine.ts';
import { auth, db, verifyFirestoreConnection } from '../firebase/config.ts';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  authLoading: boolean;
  authView: 'login' | 'register';
  setAuthView: (view: 'login' | 'register') => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'owner' | 'courier';
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  shops: Shop[];
  approvedShops: Shop[];
  pendingShops: Shop[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  partnerships: PartnershipRequest[];
  reports: Report[];
  messages: ChatMessage[];
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCalculations: { subtotal: number; deliveryFee: number; total: number };
  cartShopId: string | null;
  // Order Actions
  createOrder: (data: {
    method: 'pickup' | 'delivery';
    paymentMethod: any;
    deliveryAddress?: string;
    notes?: string;
  }) => Promise<{ success: boolean; orderId?: string; message: string }>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<{ success: boolean; message: string }>;
  claimDeliveryTask: (orderId: string) => Promise<{ success: boolean; message: string }>;
  // Product Management (Owner)
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Shop & Verification Management (Admin / Owner)
  registerShopApplication: (shopData: Omit<Shop, 'id' | 'status' | 'rating' | 'reviewCount' | 'createdAt'>) => void;
  approveShop: (shopId: string) => void;
  rejectShop: (shopId: string) => void;
  // Partnership Actions
  createPartnershipRequest: (req: Omit<PartnershipRequest, 'id' | 'status' | 'createdAt'>) => void;
  respondPartnershipRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
  // Chat Actions
  sendMessage: (text: string, conversationId?: string) => void;
  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedShopForDetails: Shop | null;
  setSelectedShopForDetails: (shop: Shop | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  toast: { show: boolean; message: string; type: 'success' | 'error' | 'info' };
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dbConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to determine role and redirect accordingly
export function getInitialTabForRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'admin_dashboard';
    case 'owner':
      return 'owner_dashboard';
    case 'courier':
      return 'courier_dashboard';
    case 'customer':
    default:
      return 'home';
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipRequest[]>(INITIAL_PARTNERSHIPS);
  const [reports] = useState<Report[]>(INITIAL_REPORTS);
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  // UI state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedShopForDetails, setSelectedShopForDetails] = useState<Shop | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'info',
  });

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      conversationId: 'general',
      senderId: 'demo_owner_1',
      senderName: 'Cak Rohim (Warung Tebet)',
      text: 'Halo sedulur! Stok beras ramos setra 5kg, gas melon 3kg, dan minyak goreng aman melimpah ya. Siap kirim langsung.',
      timestamp: '10:15 WIB',
    },
    {
      id: 'm2',
      conversationId: 'general',
      senderId: 'bot',
      senderName: 'MaduraBot Asisten',
      text: 'Selamat datang di Madura Serbaguna! Ada yang bisa kami bantu seputar pemesanan, cek stok warung, atau pengantaran?',
      timestamp: '10:16 WIB',
      isBot: true,
    },
  ]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Test Firestore connection on boot
  useEffect(() => {
    verifyFirestoreConnection().then((connected) => {
      setDbConnected(connected);
    });
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          // Check Firestore user doc
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let role: UserRole = 'customer';
          let name = fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna Madura';
          let phone = fbUser.phoneNumber || '081200000000';
          let shopId: string | undefined = undefined;

          // Admin assignment: praka061996@gmail.com is strictly Administrator
          if (fbUser.email?.toLowerCase() === 'praka061996@gmail.com') {
            role = 'admin';
            name = 'Administrator Madura';
          } else if (userDoc.exists()) {
            const data = userDoc.data();
            role = (data.role as UserRole) || 'customer';
            name = data.name || name;
            phone = data.phone || phone;
            shopId = data.shopId;
          } else {
            // Check local storage for quick creation context
            const cachedRole = localStorage.getItem(`ms_role_${fbUser.uid}`) as UserRole | null;
            if (cachedRole && ['customer', 'owner', 'courier'].includes(cachedRole)) {
              role = cachedRole;
            }
            // Save to Firestore
            try {
              await setDoc(userDocRef, {
                uid: fbUser.uid,
                email: fbUser.email,
                name,
                phone,
                role,
                createdAt: new Date().toISOString(),
              });
            } catch (e) {
              console.warn('Could not sync user profile to Firestore:', e);
            }
          }

          const userProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name,
            phone,
            role,
            shopId: role === 'owner' ? (shopId || 'shop_tebet_1') : undefined,
            avatarUrl:
              role === 'owner'
                ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                : role === 'courier'
                ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
                : role === 'admin'
                ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
                : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            createdAt: new Date().toISOString(),
          };

          setCurrentUser(userProfile);
          setActiveTab(getInitialTabForRole(role));
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback profile
          const isAdmin = fbUser.email?.toLowerCase() === 'praka061996@gmail.com';
          const fallbackRole: UserRole = isAdmin ? 'admin' : 'customer';
          setCurrentUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: isAdmin ? 'Administrator Madura' : fbUser.email?.split('@')[0] || 'Pengguna',
            phone: '081200000000',
            role: fallbackRole,
            createdAt: new Date().toISOString(),
          });
          setActiveTab(getInitialTabForRole(fallbackRole));
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login handler with Firebase Authentication
  const loginWithEmail = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = userCredential.user;

      // Determine role
      let role: UserRole = 'customer';
      let name = fbUser.displayName || email.split('@')[0];
      let phone = '081200000000';
      let shopId: string | undefined = undefined;

      if (fbUser.email?.toLowerCase() === 'praka061996@gmail.com') {
        role = 'admin';
        name = 'Administrator Madura';
      } else {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = (data.role as UserRole) || 'customer';
            name = data.name || name;
            phone = data.phone || phone;
            shopId = data.shopId;
          }
        } catch (e) {
          console.warn('Could not read user profile from Firestore:', e);
        }
      }

      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        name,
        phone,
        role,
        shopId: role === 'owner' ? (shopId || 'shop_tebet_1') : undefined,
        avatarUrl:
          role === 'owner'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            : role === 'courier'
            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            : role === 'admin'
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(profile);
      const destinationTab = getInitialTabForRole(role);
      setActiveTab(destinationTab);
      showToast(`Selamat datang kembali, ${name}!`, 'success');
      return { success: true, message: 'Login berhasil' };
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'Email atau password yang Anda masukkan salah.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Email atau password tidak sesuai. Pastikan akun sudah terdaftar.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Format alamat email tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat lagi.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Koneksi internet bermasalah. Periksa jaringan Anda.';
      }
      return { success: false, message: errorMsg };
    }
  };

  // Register handler with Firebase Authentication & Firestore
  const registerWithEmail = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'owner' | 'courier';
  }): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate that role cannot be admin
      if ((data.role as string) === 'admin') {
        return { success: false, message: 'Pendaftaran role Administrator tidak diizinkan.' };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const fbUser = userCredential.user;

      // Cache role locally in case Firestore read is delayed
      localStorage.setItem(`ms_role_${fbUser.uid}`, data.role);

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          role: data.role,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore setDoc failed during registration:', e);
      }

      const newProfile: UserProfile = {
        uid: fbUser.uid,
        email: data.email.trim(),
        name: data.name.trim(),
        phone: data.phone.trim(),
        role: data.role,
        shopId: data.role === 'owner' ? 'shop_tebet_1' : undefined,
        avatarUrl:
          data.role === 'owner'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            : data.role === 'courier'
            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newProfile);
      const destinationTab = getInitialTabForRole(data.role);
      setActiveTab(destinationTab);
      showToast(`Pendaftaran berhasil! Selamat bergabung, ${data.name}.`, 'success');
      return { success: true, message: 'Pendaftaran berhasil' };
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMsg = 'Gagal membuat akun baru. Silakan coba lagi.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Alamat email ini sudah terdaftar. Silakan gunakan menu Login.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Format email tidak valid.';
      }
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Error during signOut:', e);
    }
    setCurrentUser(null);
    setCart([]);
    setAuthView('login');
    setActiveTab('home');
    showToast('Anda telah keluar dari akun.', 'info');
  };

  const approvedShops = shops.filter((s) => s.status === 'approved');
  const pendingShops = shops.filter((s) => s.status === 'pending');

  // Cart operations
  const cartShopId = cart.length > 0 ? cart[0].shopId : null;

  const addToCart = (product: Product, quantity: number = 1): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      showToast(`Maaf, stok "${product.name}" saat ini sedang habis.`, 'error');
      return { success: false, message: 'Stok habis' };
    }

    if (cart.length > 0 && cart[0].shopId !== product.shopId) {
      const confirmSwitch = window.confirm(
        'Keranjang belanja Anda saat ini berisi barang dari warung lain. Ingin mengosongkan keranjang dan memilih dari warung ini?'
      );
      if (!confirmSwitch) {
        return { success: false, message: 'Dibatalkan oleh pengguna' };
      }
      setCart([]);
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        const validated = validateItemQuantity(nextQty, product.stock);
        if (!validated.valid && validated.adjustedQuantity === existing.quantity) {
          showToast(`Stok maksimal ${product.stock} ${product.unit} sudah tercapai.`, 'error');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: validated.adjustedQuantity } : item
        );
      } else {
        const validated = validateItemQuantity(quantity, product.stock);
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: validated.adjustedQuantity,
            stock: product.stock,
            shopId: product.shopId,
          },
        ];
      }
    });

    showToast(`"${product.name}" ditambahkan ke keranjang`, 'success');
    return { success: true, message: 'Berhasil' };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const { adjustedQuantity } = validateItemQuantity(quantity, item.stock);
          return { ...item, quantity: adjustedQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Produk dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCalculations = calculateOrderTotal(cart, 'delivery', 1.5);

  // Order Operations
  const createOrder = async (data: {
    method: 'pickup' | 'delivery';
    paymentMethod: any;
    deliveryAddress?: string;
    notes?: string;
  }): Promise<{ success: boolean; orderId?: string; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu' };
    }
    if (cart.length === 0) {
      return { success: false, message: 'Keranjang belanja kosong' };
    }

    const shop = shops.find((s) => s.id === cartShopId);
    if (!shop) {
      return { success: false, message: 'Warung tidak ditemukan' };
    }

    // Verify stock availability
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.id);
      if (!prod || prod.stock < item.quantity) {
        showToast(`Stok ${item.name} tidak mencukupi untuk dipesan!`, 'error');
        return { success: false, message: `Stok ${item.name} habis` };
      }
    }

    const calculations = calculateOrderTotal(cart, data.method, 1.5);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.uid,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      shopId: shop.id,
      shopName: shop.name,
      shopAddress: shop.address,
      ownerId: shop.ownerId,
      items: cart.map((item) => {
        const prod = products.find((p) => p.id === item.id);
        return {
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: prod?.unit || 'pcs',
          imageUrl: prod?.imageUrl || '',
        };
      }),
      subtotal: calculations.subtotal,
      deliveryFee: calculations.deliveryFee,
      total: calculations.total,
      method: data.method,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      status: 'waiting_confirmation',
      paymentMethod: data.paymentMethod,
      paymentStatus:
        data.paymentMethod === 'cash_on_pickup' || data.paymentMethod === 'cod' ? 'unpaid' : 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((c) => c.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          const newStatus = newStock === 0 ? 'out_of_stock' : newStock <= 5 ? 'low' : 'available';
          return { ...prod, stock: newStock, status: newStatus };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Pesanan #${orderId} berhasil dibuat! Menunggu konfirmasi warung.`, 'success');
    return { success: true, orderId, message: 'Pesanan berhasil dibuat' };
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Unauthorized' };

    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };

    const allowed = canTransitionOrder(order.status, newStatus, currentUser.role, order.method);
    if (!allowed) {
      showToast('Perubahan status pesanan tidak diizinkan untuk peran Anda.', 'error');
      return { success: false, message: 'Transisi tidak diizinkan' };
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o))
    );
    showToast(`Status pesanan #${orderId} diperbarui ke ${newStatus}`, 'success');
    return { success: true, message: 'Status berhasil diperbarui' };
  };

  const claimDeliveryTask = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || currentUser.role !== 'courier') {
      return { success: false, message: 'Hanya kurir yang dapat mengambil pengantaran' };
    }
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'waiting_courier') {
      showToast('Pesanan sudah diambil kurir lain atau tidak tersedia.', 'error');
      return { success: false, message: 'Pesanan tidak tersedia' };
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              courierId: currentUser.uid,
              courierName: currentUser.name,
              courierPhone: currentUser.phone,
              status: 'on_delivery',
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
    showToast(`Anda berhasil mengambil tugas pengantaran #${orderId}!`, 'success');
    return { success: true, message: 'Tugas diambil' };
  };

  // Product actions for warung owner
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p_${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produk "${newProduct.name}" berhasil ditambahkan.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (typeof updates.stock === 'number') {
            updated.status = updates.stock === 0 ? 'out_of_stock' : updates.stock <= 5 ? 'low' : 'available';
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Data produk berhasil diperbarui', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produk telah dihapus dari etalase', 'info');
  };

  // Warung Registration & Admin Verification
  const registerShopApplication = (
    shopData: Omit<Shop, 'id' | 'status' | 'rating' | 'reviewCount' | 'createdAt'>
  ) => {
    const newShop: Shop = {
      ...shopData,
      id: `shop_${Date.now().toString().slice(-6)}`,
      status: 'pending',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setShops((prev) => [...prev, newShop]);
    showToast('Pendaftaran warung terkirim! Menunggu verifikasi dari Administrator.', 'success');
  };

  const approveShop = (shopId: string) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, status: 'approved' as const } : s))
    );
    showToast('Warung berhasil diverifikasi dan sekarang aktif di peta publik!', 'success');
  };

  const rejectShop = (shopId: string) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, status: 'rejected' as const } : s))
    );
    showToast('Pendaftaran warung telah ditolak.', 'info');
  };

  // Partnership actions
  const createPartnershipRequest = (req: Omit<PartnershipRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: PartnershipRequest = {
      ...req,
      id: `pr_${Date.now().toString().slice(-6)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setPartnerships((prev) => [newReq, ...prev]);
    showToast(`Permintaan kerja sama stok dikirim ke ${req.toShopName}!`, 'success');
  };

  const respondPartnershipRequest = (requestId: string, status: 'accepted' | 'rejected') => {
    setPartnerships((prev) =>
      prev.map((pr) => (pr.id === requestId ? { ...pr, status, respondedAt: new Date().toISOString() } : pr))
    );
    showToast(
      status === 'accepted'
        ? 'Permintaan kerja sama diterima! Silakan koordinasi pengiriman stok.'
        : 'Permintaan kerja sama ditolak.',
      status === 'accepted' ? 'success' : 'info'
    );
  };

  // Chat actions & MaduraBot Auto-Responder
  const sendMessage = (text: string) => {
    if (!currentUser) return;
    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      conversationId: 'general',
      senderId: currentUser.uid,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setMessages((prev) => [...prev, userMsg]);

    const lower = text.toLowerCase();
    let reply = '';
    if (lower.includes('cara pesan') || lower.includes('pesan')) {
      reply = 'Untuk memesan: Pilih warung di Peta atau Beranda -> Pilih barang yang tersedia -> Masukkan keranjang -> Tekan Checkout -> Pilih Ambil di Tempat atau Diantar Kurir.';
    } else if (lower.includes('kurir') || lower.includes('antar') || lower.includes('ongkir')) {
      reply = 'Layanan kurir Madura Kilat mengantarkan pesanan langsung dari warung dengan tarif mulai Rp 5.000 (area s/d 2 km). Anda dapat melacak statusnya secara real-time.';
    } else if (lower.includes('daftar warung') || lower.includes('buka warung')) {
      reply = 'Untuk mendaftarkan warung Anda: Pilih tab "Daftar Warung" di menu atas, isi profil warung, koordinat lokasi, dan foto. Admin akan memverifikasi dalam waktu singkat.';
    } else if (lower.includes('kontak') || lower.includes('admin') || lower.includes('bantuan')) {
      reply = 'Anda dapat menghubungi pusat bantuan Madura Serbaguna di nomor WhatsApp 0811-9988-7766 atau email admin@maduraserbaguna.id.';
    } else if (lower.includes('kerja sama') || lower.includes('stok')) {
      reply = 'Fitur "Kerja Sama Warung" memungkinkan sesama pemilik warung meminjam atau oper stok sembako (seperti gula/beras/gas) ketika stok mendadak habis.';
    }

    if (reply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            conversationId: 'general',
            senderId: 'bot',
            senderName: 'MaduraBot Asisten',
            text: reply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            isBot: true,
          },
        ]);
      }, 700);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authLoading,
        authView,
        setAuthView,
        loginWithEmail,
        registerWithEmail,
        logout,
        shops,
        approvedShops,
        pendingShops,
        products,
        orders,
        cart,
        partnerships,
        reports,
        messages,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCalculations,
        cartShopId,
        createOrder,
        updateOrderStatus,
        claimDeliveryTask,
        addProduct,
        updateProduct,
        deleteProduct,
        registerShopApplication,
        approveShop,
        rejectShop,
        createPartnershipRequest,
        respondPartnershipRequest,
        sendMessage,
        activeTab,
        setActiveTab,
        selectedShopForDetails,
        setSelectedShopForDetails,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toast,
        showToast,
        dbConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
