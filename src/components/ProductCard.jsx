import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  // Warna aksen badge sesuai varian (default diganti navy/slate)
  const getVariantBadge = (variant) => {
    switch (variant?.toLowerCase()) {
      case 'cokelat':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'susu':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'matcha':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-between group transform hover:-translate-y-1">
      <div>
        {/* Container Gambar dengan Background Gradient Nuansa Navy / Slate */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-3 mb-4">
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getVariantBadge(product?.variant)}`}>
            {product?.variant || 'Gabin Fla'}
          </span>
          <img 
            src={product?.image || "https://via.placeholder.com/250"} 
            alt={product?.name || "Gabin Fla"} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Detail Produk */}
        <div className="px-1">
          <h3 className="text-xl font-bold text-gray-800 leading-tight mb-1">
            {product?.name || "Gabin Fla"}
          </h3>
          <p className="text-2xl font-black text-emerald-600 mb-2">
            Rp {(product?.price || 8000).toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed mb-4">
            {product?.description || "Jajanan tradisional biskuit gabin dengan isian adonan fla manis & lembut. Isi 2 pcs per kemasan."}
          </p>
        </div>
      </div>

      {/* Bagian Bawah: Pengatur Jumlah Kuantitas & Tombol Tambah Keranjang */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {/* Tombol - 1 + */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200">
          <button 
            onClick={handleDecrease}
            className="text-gray-500 hover:text-slate-900 font-bold text-lg px-1 transition-colors disabled:opacity-30"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="text-sm font-bold text-gray-800 mx-3 min-w-[16px] text-center">
            {quantity}
          </span>
          <button 
            onClick={handleIncrease}
            className="text-gray-500 hover:text-slate-900 font-bold text-lg px-1 transition-colors"
          >
            +
          </button>
        </div>

        <button 
          onClick={() => onAddToCart && onAddToCart(product, quantity)}
          className="w-11 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-slate-400 transition-all duration-300 active:scale-95"
          title="Tambah ke Keranjang"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
