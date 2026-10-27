import React from 'react'
import ProductGrid from '../components/ProductGrid'
import Strip from '../components/Strip'

export default function Products({ onAddToCart }) {
  return (
    <div className="flex flex-col gap-5 min-h-screen">
      <Strip />
      <ProductGrid onAddToCart={onAddToCart} />   
    </div>
  )
}
