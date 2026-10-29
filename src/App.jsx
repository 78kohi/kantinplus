import { useCallback, useState } from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import QRISPayment from "./pages/QRISPayment";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import OrderHistory from "./pages/OrderHistory"
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminInventory from "./pages/AdminInventory";

const initialToastState = {
  title: "",
  message: "",
  type: "success",
  isVisible: false,
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(initialToastState);

  const showToast = useCallback((title, message, type = "success") => {
    setToast({ title, message, type, isVisible: true });
  }, []);

  const clearToast = useCallback(() => {
    setToast({ title: "", message: "", type: "success", isVisible: false });
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const amountToAdd = Math.max(1, Number.parseInt(quantity, 10) || 1);

      const stock = Math.max(0, Number(product.stock) || 0);
      const existingItem = cartItems.find((item) => item.id === product.id);

      const currentQuantity = existingItem?.quantity || 0;
      const remainingStock = stock - currentQuantity;

      if (product.is_available === false || remainingStock <= 0) {
        showToast(
          "Stok tidak tersedia",
          `${product.name} sudah mencapai batas stok.`,
          "error",
        );
        return;
      }

      const allowedAmount = Math.min(amountToAdd, remainingStock);

      setCartItems((currentItems) => {
        const exists = currentItems.some((item) => item.id === product.id);

        if (exists) {
          return currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + allowedAmount }
              : item,
          );
        }

        return [...currentItems, { ...product, quantity: allowedAmount }];
      });

      if (allowedAmount < amountToAdd) {
        showToast(
          "Jumlah disesuaikan",
          `Hanya ${allowedAmount} item ${product.name} yang ditambahkan.`,
          "info",
        );
      } else {
        showToast(
          "Ditambahkan ke keranjang!",
          `${product.name} ditambahkan ke keranjang`,
          "success",
        );
      }
    },
    [cartItems, showToast],
  );

  const changeCartQuantity = useCallback(
    (productId, difference) => {
      const targetItem = cartItems.find((item) => item.id === productId);

      if (!targetItem) return;

      if (difference > 0) {
        const stock = Math.max(0, Number(targetItem.stock) || 0);

        if (
          targetItem.is_available === false ||
          targetItem.quantity + difference > stock
        ) {
          showToast(
            "Stok tidak mencukupi",
            `Stok ${targetItem.name} saat ini ${stock}.`,
            "error",
          );
          return;
        }
      }

      setCartItems((currentItems) =>
        currentItems
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + difference }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );

      showToast(
        "Keranjang diperbarui!",
        `${targetItem.name} ${difference > 0 ? "ditambahkan" : "dikurangi"}`,
        "info",
      );
    },
    [cartItems, showToast],
  );

  const removeFromCart = useCallback(
    (productId) => {
      const targetItem = cartItems.find((item) => item.id === productId);
      if (!targetItem) return;

      setCartItems((currentItems) =>
        currentItems.filter((item) => item.id !== productId),
      );

      showToast(
        "Dihapus dari keranjang!",
        `${targetItem.name} dihapus dari keranjang`,
        "info",
      );
    },
    [cartItems, showToast],
  );

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
            toast={toast}
            onShowToast={showToast}
            onClearToast={clearToast}
            onClearCart={() => setCartItems([])}
          />
        }
      />
      <Route path="/pembayaran" element={<QRISPayment />} />
      <Route path="/pesanan-berhasil" element={<OrderSuccess />} />
      <Route path="/riwayat-pesanan" element={<OrderHistory />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pesanan" element={<AdminOrders />} />
        <Route path="/admin/produk" element={<AdminProducts />} />
        <Route path="/admin/inventori" element={<AdminInventory />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
