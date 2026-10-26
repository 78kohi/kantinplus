import { useCallback, useState } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((product, quantity = 1) => {
    const amountToAdd = Math.max(1, Number.parseInt(quantity, 10) || 1)

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + amountToAdd }
            : item,
        )
      }

      return [...currentItems, { ...product, quantity: amountToAdd }]
    })
  }, [])

  const changeCartQuantity = useCallback((productId, difference) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + difference }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }, [])

  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <NavBar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Home />
      <Products onAddToCart={addToCart} />
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={closeCart}
        onChangeQuantity={changeCartQuantity}
        onRemove={removeFromCart}
      />
    </>
  )
}

export default App
