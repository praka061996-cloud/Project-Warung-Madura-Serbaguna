/**
 * Robust image fallback URLs and error handlers for Warung Madura products, stores, and avatars
 */

export const FALLBACK_IMAGES = {
  store: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
  sembako: '/assets/beras_ramos_setra.svg',
  makanan_minuman: '/assets/indomie_goreng.svg',
  kebutuhan_harian: '/assets/gas_lpg_melon.svg',
  alat_rumah_tangga: '/assets/sabun_cuci_piring_sunlight.svg',
  perlengkapan_mandi: '/assets/sabun_batang_lifebuoy.svg',
  lainnya: '/assets/gula_pasir_gulaku.svg',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
};

export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  category: keyof typeof FALLBACK_IMAGES = 'sembako'
) {
  const target = event.currentTarget;
  const fallbackUrl = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.sembako;
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
}
