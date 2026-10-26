import ProductCard from './ProductCard'
import { products } from '../data/product'

export default function ProductGrid({ onAddToCart }) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 text-center">
        <h2 className="mb-2 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
          Gabin Fla Series ✨
        </h2>
        <p className="mx-auto max-w-lg text-sm text-gray-600 md:text-base">
          Jajanan tradisional hits biskuit gabin isi adonan fla lumer (2 pcs/kemasan) seharga Rp 8.000!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}
