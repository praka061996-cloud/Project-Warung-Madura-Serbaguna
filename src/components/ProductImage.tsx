import React, { useState } from 'react';
import { ProductCategory } from '../types/index.ts';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: ProductCategory | string;
  name?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function getAccurateProductImage(name: string = '', category: string = '', originalSrc: string = ''): string {
  const n = name.toLowerCase();

  // Sabun Batang Mandi - explicit check to prevent hands or sanitizer
  if (n.includes('sabun') && (n.includes('batang') || n.includes('mandi') || n.includes('lifebuoy') || n.includes('nuvo') || n.includes('giv'))) {
    return '/assets/sabun_batang_lifebuoy.svg';
  }

  // Sabun Cuci Piring
  if (n.includes('sunlight') || n.includes('cuci piring') || (n.includes('sabun') && n.includes('piring'))) {
    return '/assets/sabun_cuci_piring_sunlight.svg';
  }

  // Beras
  if (n.includes('beras') || n.includes('ramos') || n.includes('setra') || n.includes('pandan wangi')) {
    return '/assets/beras_ramos_setra.svg';
  }

  // Minyak Goreng
  if (n.includes('minyak') || n.includes('sania') || n.includes('bimoli') || n.includes('tropical') || n.includes('filma')) {
    return '/assets/minyak_goreng_pouch.svg';
  }

  // Gas Melon 3 Kg
  if (n.includes('gas') || n.includes('lpg') || n.includes('melon') || n.includes('3 kg') || n.includes('tabung')) {
    return '/assets/gas_lpg_melon.svg';
  }

  // Gula Pasir
  if (n.includes('gula') || n.includes('gulaku') || n.includes('tebu')) {
    return '/assets/gula_pasir_gulaku.svg';
  }

  // Aqua Galon
  if (n.includes('galon') || (n.includes('aqua') && (n.includes('19') || n.includes('galon')))) {
    return '/assets/aqua_galon_19l.svg';
  }

  // Garam Meja
  if (n.includes('garam') || n.includes('dolpin') || n.includes('iodium')) {
    return '/assets/garam_meja_dolpin.svg';
  }

  // Mi Instan Indomie
  if (n.includes('indomie') || n.includes('mi goreng') || n.includes('mie instan') || n.includes('sedap')) {
    return '/assets/indomie_goreng.svg';
  }

  if (originalSrc && originalSrc.trim().length > 0 && !originalSrc.includes('photo-1584308666744')) {
    return originalSrc;
  }

  // Category fallbacks
  switch (category) {
    case 'sembako':
      return '/assets/beras_ramos_setra.svg';
    case 'kebutuhan_harian':
      return '/assets/gas_lpg_melon.svg';
    case 'perlengkapan_mandi':
      return '/assets/sabun_batang_lifebuoy.svg';
    case 'alat_rumah_tangga':
      return '/assets/sabun_cuci_piring_sunlight.svg';
    case 'makanan_minuman':
      return '/assets/indomie_goreng.svg';
    default:
      return '/assets/gula_pasir_gulaku.svg';
  }
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = 'sembako',
  name = '',
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}) => {
  const initialResolved = getAccurateProductImage(name || alt, category, src);
  const [currentSrc, setCurrentSrc] = useState<string>(initialResolved);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = getAccurateProductImage(name || alt, category, '');
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading={loading}
    />
  );
};
