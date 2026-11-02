export type UserRole = 'customer' | 'owner' | 'courier' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  shopId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  tagline?: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  photoUrl: string;
  openHours: string;
  isOpen: boolean;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  rating: number;
  reviewCount: number;
  distanceKm?: number;
  createdAt: string;
}

export type ProductCategory =
  | 'sembako'
  | 'makanan_minuman'
  | 'alat_rumah_tangga'
  | 'kebutuhan_harian'
  | 'perlengkapan_mandi'
  | 'lainnya';

export interface Product {
  id: string;
  shopId: string;
  shopName?: string;
  ownerId: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: 'available' | 'low' | 'out_of_stock';
  imageUrl: string;
  description: string;
  unit: string; // e.g. 'kg', 'pcs', 'pack', 'botol'
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  shopId: string;
}

export type OrderStatus =
  | 'waiting_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'waiting_courier'
  | 'on_delivery'
  | 'completed'
  | 'cancelled';

export type PaymentMethod =
  | 'qris'
  | 'ewallet'
  | 'bank_transfer'
  | 'cash_on_pickup'
  | 'cod';

export type PaymentStatus =
  | 'unpaid'
  | 'pending_verification'
  | 'paid'
  | 'refunded';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  shopAddress?: string;
  ownerId: string;
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  method: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipRequest {
  id: string;
  fromShopId: string;
  fromShopName: string;
  fromOwnerId: string;
  toShopId: string;
  toShopName: string;
  toOwnerId: string;
  productName: string;
  requestedQuantity: number;
  unit: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isBot?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastSenderId: string;
  updatedAt: string;
  shopName?: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  detail: string;
  category: 'pelayanan' | 'kualitas_barang' | 'kurir' | 'sistem' | 'lainnya';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}
