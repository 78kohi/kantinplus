import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const stock = Math.max(0, Number(product?.stock) || 0);
  const isAvailable = product?.is_available !== false && stock > 0;
  const isMaxQuantity = quantity >= stock;

  // Warna aksen badge sesuai varian (default diganti navy/slate)
  const getVariantBadge = (variant) => {
    switch (variant?.toLowerCase()) {
      case "cokelat":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "susu":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "matcha":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity((current) => Math.min(current + 1, stock));
  };

  const imageBgStyle = (() => {
    switch (product?.flavor?.toLowerCase()) {
      case "cokelat":
        return "bg-[#e6ccb2]";
      case "susu":
        return "bg-[#fefae0]";
      case "matcha":
        return "bg-[#dde5b6]";
      default:
        return "bg-gradient-to-tr from-slate-100 via-blue-50 to-indigo-100";
    }
  })();

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-between group transform hover:-translate-y-1">
      <div>
        {/* Container Gambar dengan Background Gradient Nuansa Navy / Slate */}
        <div
          className={`
          relative w-full h-48 rounded-2xl overflow-hidden flex items-center justify-center p-3 mb-4
          ${imageBgStyle}
          `}
        >
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getVariantBadge(product?.flavor)}`}
          >
            {product?.flavor || "Gabin Fla"}
          </span>
          <img
            src={product?.image_url || "https://via.placeholder.com/250"}
            alt={product?.name || "Gabin Fla"}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Detail Produk */}
        <div className="px-1">
          <h3 className="text-xl font-bold text-[#19334b] leading-tight mb-1">
            {product?.name || "Gabin Fla"}
          </h3>
          <p className="text-2xl font-black text-[#193361] mb-2">
            Rp {(product?.price || 10000).toLocaleString("id-ID")}
            <span className="text-sm font-bold">/ 3pcs</span>
          </p>
          <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed mb-4">
            {product?.description ||
              "Jajanan tradisional biskuit gabin dengan isian adonan fla manis & lembut. Isi 2 pcs per kemasan."}
          </p>
          <p
            className={`text-xs font-semibold ${
              isAvailable ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {isAvailable ? `Stok tersedia: ${stock}` : "Stok habis"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => onAddToCart?.(product, 1)}
          disabled={!isAvailable}
          className="w-11 h-11 bg-[#a2d6f9] hover:bg-[#83d6f9] text-white rounded-full flex items-center justify-center shadow-md hover:shadow-slate-400 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title={isAvailable ? "Tambah ke Keranjang" : "Stok habis"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
