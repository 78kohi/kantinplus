import React from 'react';
import ProductCart from './ProductCart';

export default function ProductGrid() {
  // Data 3 Varian Produk Gabin Fla Gen-Z dengan Tema Navy
  const products = [
    {
      id: 1,
      name: "Gabin Fla Cokelat",
      variant: "Cokelat",
      price: 8000,
      description: "Jajanan tradisional renyah dengan isian adonan fla cokelat manis & legit. Isi 2 pcs per kemasan.",
      image: "https://via.placeholder.com/250/1E293B/FFFFFF?text=Gabin+Cokelat"
    },
    {
      id: 2,
      name: "Gabin Fla Susu",
      variant: "Susu",
      price: 8000,
      description: "Biskuit gabin renyah dipadu fla susu creamy dan lumer di mulut. Isi 2 pcs per kemasan.",
      image: "https://via.placeholder.com/250/1E3A8A/FFFFFF?text=Gabin+Susu"
    },
    {
      id: 3,
      name: "Gabin Fla Matcha",
      variant: "Matcha",
      price: 8000,
      description: "Kombinasi biskuit gabin dengan isian adonan fla matcha kekinian bermutu tinggi. Isi 2 pcs per kemasan.",
      image: "https://via.placeholder.com/250/0F172A/FFFFFF?text=Gabin+Matcha"
    }
  ];

  const handleAddToCart = (product, quantity) => {
    alert(`Berhasil menambahkan ${quantity}x ${product.name} ke keranjang!`);
  };

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
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
          <ProductCart key={item.id} product={item} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}