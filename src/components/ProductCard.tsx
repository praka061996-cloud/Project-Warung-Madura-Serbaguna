import React from 'react';
import { Product } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { formatRupiah } from '../utils/currency.ts';
import { ProductImage } from './ProductImage.tsx';
import { Plus, Check, AlertCircle, ShoppingBag, Store } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenShop?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenShop }) => {
  const { addToCart, cart } = useApp();

  const cartItem = cart.find((c) => c.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 flex items-center justify-center">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          name={product.name}
          category={product.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Stock Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.status === 'out_of_stock' ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
              Habis
            </span>
          ) : product.status === 'low' ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs">
              Sisa {product.stock} {product.unit}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              Tersedia
            </span>
          )}
        </div>

        {/* Category tag */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/70 backdrop-blur-md text-white">
            {product.category.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Name link */}
          {product.shopName && (
            <div
              onClick={onOpenShop}
              className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer mb-1 truncate"
            >
              <Store className="w-3 h-3 shrink-0" />
              <span className="truncate">{product.shopName}</span>
            </div>
          )}

          <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.description}</p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Harga / {product.unit}</span>
            <p className="text-base font-extrabold text-blue-700 font-heading">
              {formatRupiah(product.price)}
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.status === 'out_of_stock'}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              product.status === 'out_of_stock'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : inCartQty > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
            }`}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>({inCartQty})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Pesan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
