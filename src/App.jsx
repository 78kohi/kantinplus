import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Payment from './pages/Payment';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    const amountToAdd = Math.max(1, Number.parseInt(quantity, 10) || 1);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + amountToAdd }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: amountToAdd }];
    });
  }, []);

  const changeCartQuantity = useCallback((productId, difference) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + difference }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            onAddToCart={addToCart}
            onChangeCartQuantity={changeCartQuantity}
            onRemoveFromCart={removeFromCart}
          />
        }
      />
      <Route
        path="/bayar"
        element={
          <Payment
            cartItems={cartItems}
            subtotal={subtotal}
            onChangeCartQuantity={changeCartQuantity}
            onRemoveFromCart={removeFromCart}
          />
        }
      />
    </Routes>
  );
}

export default App
