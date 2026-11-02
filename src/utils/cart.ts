/**
 * Cart and order calculation utilities
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  shopId: string;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, item.price) * Math.max(0, item.quantity), 0);
}

export function calculateDeliveryFee(method: 'pickup' | 'delivery', distanceKm: number = 1.0): number {
  if (method === 'pickup') {
    return 0;
  }
  // Base delivery fee Rp 5,000 for first 2 km, + Rp 2,000 per extra km
  const baseFee = 5000;
  if (distanceKm <= 2) {
    return baseFee;
  }
  const extraKm = Math.ceil(distanceKm - 2);
  return baseFee + extraKm * 2000;
}

export function calculateOrderTotal(items: CartItem[], method: 'pickup' | 'delivery', distanceKm: number = 1.0): {
  subtotal: number;
  deliveryFee: number;
  total: number;
} {
  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(method, distanceKm);
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export function validateItemQuantity(quantity: number, stock: number): { valid: boolean; adjustedQuantity: number } {
  if (stock <= 0) {
    return { valid: false, adjustedQuantity: 0 };
  }
  if (quantity <= 0) {
    return { valid: false, adjustedQuantity: 1 };
  }
  if (quantity > stock) {
    return { valid: false, adjustedQuantity: stock };
  }
  return { valid: true, adjustedQuantity: quantity };
}
