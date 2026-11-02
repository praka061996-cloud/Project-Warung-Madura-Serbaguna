import test from 'node:test';
import assert from 'node:assert/strict';

// Import pure logic functions
import { getAccurateProductImage } from '../src/components/ProductImage.tsx';
import { getInitialTabForRole } from '../src/context/AppContext.tsx';
import { canTransitionOrder } from '../src/utils/orderStateMachine.ts';
import { calculateOrderTotal, validateItemQuantity } from '../src/utils/cart.ts';

test('ProductImage resolver returns accurate Indonesian warung SVGs', () => {
  // Sabun Batang Mandi - MUST NOT return hands or sanitizer
  assert.equal(getAccurateProductImage('Sabun Mandi Batang Lifebuoy Merah 110g', 'perlengkapan_mandi', ''), '/assets/sabun_batang_lifebuoy.svg');
  assert.equal(getAccurateProductImage('Sabun Nuvo Bar Antibakteri', 'perlengkapan_mandi', ''), '/assets/sabun_batang_lifebuoy.svg');

  // Sabun Cuci Piring
  assert.equal(getAccurateProductImage('Sunlight Jeruk Nipis 100 Cuci Piring Refill 650ml', 'alat_rumah_tangga', ''), '/assets/sabun_cuci_piring_sunlight.svg');

  // Beras
  assert.equal(getAccurateProductImage('Beras Premium Ramos Setra 5 Kg', 'sembako', ''), '/assets/beras_ramos_setra.svg');

  // Minyak Goreng
  assert.equal(getAccurateProductImage('Minyak Goreng Sania / Tropical Pouch 2 Liter', 'sembako', ''), '/assets/minyak_goreng_pouch.svg');

  // Gas Melon 3 Kg
  assert.equal(getAccurateProductImage('Gas LPG Melon 3 Kg (Tukar Tabung)', 'kebutuhan_harian', ''), '/assets/gas_lpg_melon.svg');

  // Gula Pasir
  assert.equal(getAccurateProductImage('Gula Pasir Gulaku Tebu Murni 1 Kg', 'sembako', ''), '/assets/gula_pasir_gulaku.svg');

  // Aqua Galon
  assert.equal(getAccurateProductImage('Air Mineral Aqua Galon 19 Liter (Tukar)', 'makanan_minuman', ''), '/assets/aqua_galon_19l.svg');

  // Garam Meja
  assert.equal(getAccurateProductImage('Garam Meja Beriodium Dolpin 250g', 'sembako', ''), '/assets/garam_meja_dolpin.svg');

  // Indomie Goreng
  assert.equal(getAccurateProductImage('Indomie Goreng Original 1 Dus', 'makanan_minuman', ''), '/assets/indomie_goreng.svg');
});

test('Role-based navigation targets correct destination dashboards', () => {
  assert.equal(getInitialTabForRole('admin'), 'admin_dashboard');
  assert.equal(getInitialTabForRole('owner'), 'owner_dashboard');
  assert.equal(getInitialTabForRole('courier'), 'courier_dashboard');
  assert.equal(getInitialTabForRole('customer'), 'home');
});

test('Order state machine enforces role boundaries', () => {
  // Owner can advance waiting confirmation to confirmed
  assert.equal(canTransitionOrder('waiting_confirmation', 'confirmed', 'owner', 'delivery'), true);

  // Customer cannot transition order to on_delivery
  assert.equal(canTransitionOrder('waiting_courier', 'on_delivery', 'customer', 'delivery'), false);

  // Courier can transition waiting_courier to on_delivery
  assert.equal(canTransitionOrder('waiting_courier', 'on_delivery', 'courier', 'delivery'), true);

  // Completed order cannot be transitioned backwards
  assert.equal(canTransitionOrder('completed', 'waiting_confirmation', 'owner', 'delivery'), false);
});

test('Cart calculations and stock validation handle constraints properly', () => {
  const items = [
    { id: '1', name: 'Beras', price: 68500, quantity: 2, stock: 10, shopId: 's1' },
    { id: '2', name: 'Minyak', price: 36000, quantity: 1, stock: 5, shopId: 's1' },
  ];

  const totalDelivery = calculateOrderTotal(items, 'delivery', 1.5);
  assert.equal(totalDelivery.subtotal, 173000);
  assert.equal(totalDelivery.deliveryFee, 5000);
  assert.equal(totalDelivery.total, 178000);

  const totalPickup = calculateOrderTotal(items, 'pickup', 1.5);
  assert.equal(totalPickup.deliveryFee, 0);
  assert.equal(totalPickup.total, 173000);

  // Quantity cannot exceed stock
  const val = validateItemQuantity(15, 10);
  assert.equal(val.valid, false);
  assert.equal(val.adjustedQuantity, 10);
});
