import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/product';

export default function ProductGrid() {

  const handleAddToCart = (product, quantity) => {
    alert(`Berhasil menambahkan ${quantity}x ${product.name} ke keranjang!`);
  };

  return (
    <section className="mt-5 py-10 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 mb-2">
          Gabin Fla Series ✨
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base">
          Jajanan tradisional hits biskuit gabin isi adonan fla lumer (2 pcs/kemasan) seharga Rp 8.000!
        </p>
      </div>

      {/* Tampilan Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}
