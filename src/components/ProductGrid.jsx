import React from 'react';
import ProductCard from './ProductCard'; // Pastikan path impor ini sesuai dengan letak file ProductCard

export default function ProductGrid() {
  // Data dummy varian Gabin Fla dengan tema navy
  const products = [
    {
      id: 1,
      name: 'Gabin Fla Original Susu',
      description: 'Biskuit gabin renyah dengan isian fla susu manis yang lumer di mulut.',
      price: 15000,
      category: 'Best Seller',
      image: '' 
    },
    {
      id: 2,
      name: 'Gabin Fla Cokelat Premium',
      description: 'Perpaduan gabin gurih dan fla cokelat rich yang bikin ketagihan.',
      price: 18000,
      category: 'Favorite',
      image: ''
    },
    {
      id: 3,
      name: 'Gabin Fla Matcha Green Tea',
      description: 'Rasa matcha Jepang yang khas berpadu sempurna dengan lembutnya fla.',
      price: 20000,
      category: 'New',
      image: ''
    }
  ];

  return (
    <section id="products" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Menu Pilihan Gabin Fla</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Nikmati kelezatan jajanan tradisional dengan sentuhan modern khas Kantinplus.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}