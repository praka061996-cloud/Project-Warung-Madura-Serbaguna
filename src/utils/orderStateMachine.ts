/**
 * Order state machine transitions and role permission validations
 */

export type OrderStatus =
  | 'waiting_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'waiting_courier'
  | 'on_delivery'
  | 'completed'
  | 'cancelled';

export type UserRole = 'customer' | 'owner' | 'courier' | 'admin';

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; color: string; step: number }> = {
  waiting_confirmation: { label: 'Menunggu Konfirmasi', color: 'bg-amber-100 text-amber-800 border-amber-300', step: 1 },
  confirmed: { label: 'Dikonfirmasi Warung', color: 'bg-blue-100 text-blue-800 border-blue-300', step: 2 },
  preparing: { label: 'Sedang Disiapkan', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', step: 3 },
  ready_for_pickup: { label: 'Siap Diambil', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', step: 4 },
  waiting_courier: { label: 'Menunggu Kurir', color: 'bg-purple-100 text-purple-800 border-purple-300', step: 4 },
  on_delivery: { label: 'Dalam Pengantaran', color: 'bg-cyan-100 text-cyan-800 border-cyan-300', step: 5 },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-800 border-green-300', step: 6 },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800 border-red-300', step: 0 },
};

export function canTransitionOrder(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  role: UserRole,
  method: 'pickup' | 'delivery'
): boolean {
  if (role === 'admin') {
    return true; // Admin has oversight override
  }

  if (targetStatus === 'cancelled') {
    // Customer can only cancel while waiting_confirmation
    if (role === 'customer') {
      return currentStatus === 'waiting_confirmation';
    }
    // Warung owner can cancel before item is handed off to courier or completed
    if (role === 'owner') {
      return ['waiting_confirmation', 'confirmed', 'preparing'].includes(currentStatus);
    }
    return false;
  }

  if (role === 'customer') {
    // Customer cannot unilaterally advance order status
    return false;
  }

  if (role === 'owner') {
    if (currentStatus === 'waiting_confirmation' && targetStatus === 'confirmed') return true;
    if (currentStatus === 'confirmed' && targetStatus === 'preparing') return true;
    if (currentStatus === 'preparing') {
      if (method === 'pickup' && targetStatus === 'ready_for_pickup') return true;
      if (method === 'delivery' && targetStatus === 'waiting_courier') return true;
    }
    if (method === 'pickup' && currentStatus === 'ready_for_pickup' && targetStatus === 'completed') {
      return true;
    }
    return false;
  }

  if (role === 'courier') {
    if (method !== 'delivery') return false;
    if (currentStatus === 'waiting_courier' && targetStatus === 'on_delivery') return true;
    if (currentStatus === 'on_delivery' && targetStatus === 'completed') return true;
    return false;
  }

  return false;
}
