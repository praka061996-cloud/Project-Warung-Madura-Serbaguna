import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSubtotal, calculateDeliveryFee, calculateOrderTotal, validateItemQuantity } from './cart.ts';
import { calculateDistanceKm, formatDistance } from './geo.ts';
import { canTransitionOrder } from './orderStateMachine.ts';

test('calculateSubtotal sums up items accurately', () => {
  const items = [
    { id: '1', name: 'Beras 5kg', price: 65000, quantity: 2, stock: 10, shopId: 's1' },
    { id: '2', name: 'Minyak Goreng 1L', price: 18000, quantity: 1, stock: 5, shopId: 's1' },
  ];
  assert.equal(calculateSubtotal(items), 130000 + 18000);
});

test('calculateDeliveryFee returns 0 for pickup and tiered fee for delivery', () => {
  assert.equal(calculateDeliveryFee('pickup', 5), 0);
  assert.equal(calculateDeliveryFee('delivery', 1.5), 5000);
  assert.equal(calculateDeliveryFee('delivery', 3.2), 5000 + 2 * 2000); // 2 extra km -> 9000
});

test('calculateOrderTotal returns correct breakdown', () => {
  const items = [
    { id: '1', name: 'Gula Pasir 1kg', price: 17500, quantity: 2, stock: 8, shopId: 's1' }
  ];
  const result = calculateOrderTotal(items, 'delivery', 1.0);
  assert.equal(result.subtotal, 35000);
  assert.equal(result.deliveryFee, 5000);
  assert.equal(result.total, 40000);
});

test('validateItemQuantity constrains quantity within stock bounds', () => {
  assert.deepEqual(validateItemQuantity(5, 3), { valid: false, adjustedQuantity: 3 });
  assert.deepEqual(validateItemQuantity(-1, 5), { valid: false, adjustedQuantity: 1 });
  assert.deepEqual(validateItemQuantity(2, 5), { valid: true, adjustedQuantity: 2 });
  assert.deepEqual(validateItemQuantity(2, 0), { valid: false, adjustedQuantity: 0 });
});

test('calculateDistanceKm calculates approximate distance between coordinates', () => {
  // Monas Jakarta to Senayan Jakarta (~5.5 km)
  const d = calculateDistanceKm(-6.1754, 106.8272, -6.2186, 106.8026);
  assert.ok(d > 4.5 && d < 6.5);
  assert.equal(formatDistance(0.5), '500 m');
  assert.equal(formatDistance(3.2), '3.2 km');
});

test('canTransitionOrder adheres strictly to role-based state machine', () => {
  // Customer can cancel only during waiting_confirmation
  assert.equal(canTransitionOrder('waiting_confirmation', 'cancelled', 'customer', 'delivery'), true);
  assert.equal(canTransitionOrder('confirmed', 'cancelled', 'customer', 'delivery'), false);

  // Warung owner can confirm waiting order
  assert.equal(canTransitionOrder('waiting_confirmation', 'confirmed', 'owner', 'delivery'), true);
  assert.equal(canTransitionOrder('confirmed', 'preparing', 'owner', 'delivery'), true);
  assert.equal(canTransitionOrder('preparing', 'waiting_courier', 'owner', 'delivery'), true);

  // Courier can transition to on_delivery and completed
  assert.equal(canTransitionOrder('waiting_courier', 'on_delivery', 'courier', 'delivery'), true);
  assert.equal(canTransitionOrder('on_delivery', 'completed', 'courier', 'delivery'), true);
  assert.equal(canTransitionOrder('waiting_confirmation', 'completed', 'courier', 'delivery'), false);
});
