import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../services/productServices";

export default function ProductGrid({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    const handleFocus = () => {
      loadProducts();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(products);

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
