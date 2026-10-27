import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/product";

export default function ProductGrid({ onAddToCart }) {
  const handleAddToCart = (product, quantity) => {
    alert(`Berhasil menambahkan ${quantity}x ${product.name} ke keranjang!`);
  };

  return (
    <section id="products" className="mt-10 mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 text-center">
        <h2 className="mb-2 !font-bowlby text-[#5fa8d3] text-4xl font-extrabold md:text-7xl">
          Produk Kami
        </h2>
        <h3 className="mx-auto mb-2 bg-[#19334b] w-fit py-1 px-4 font-jakarta text-2xl md:text-4xl font-bold text-[#a2d6f9]">
          Gabin Fla Series
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}
