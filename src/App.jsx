import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Payment from './pages/Payment';

const initialToastState = {
  title: '',
  message: '',
  type: 'success',
  isVisible: false,
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(initialToastState);

  const showToast = useCallback((title, message, type = 'success') => {
    setToast({ title, message, type, isVisible: true });
  }, []);

  const clearToast = useCallback(() => {
    setToast({ title: '', message: '', type: 'success', isVisible: false });
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    const amountToAdd = Math.max(1, Number.parseInt(quantity, 10) || 1);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      return existingItem
        ? currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + amountToAdd }
              : item,
          )
        : [...currentItems, { ...product, quantity: amountToAdd }];
    });

    const itemName = product?.name || 'Produk';
    showToast("Ditambahkan ke keranjang!", `${itemName} ditambahkan ke keranjang`, 'success');
  }, [showToast]);

  const changeCartQuantity = useCallback((productId, difference) => {
    const targetItem = cartItems.find((item) => item.id === productId);
    if (!targetItem) return;

    const actionText = difference > 0 ? 'ditambah ke' : 'dikurangi dari';

    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + difference }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

    showToast(`${actionText} keranjang!`, `${targetItem.name} ${actionText} keranjang`, 'info');
  }, [cartItems, showToast]);

  const removeFromCart = useCallback((productId) => {
    const targetItem = cartItems.find((item) => item.id === productId);
    if (!targetItem) return;

    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );

    showToast("Dihapus dari keranjang!", `${targetItem.name} dihapus dari keranjang`, 'info');
  }, [cartItems, showToast]);

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
            toast={toast}
            onClearToast={clearToast}
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
