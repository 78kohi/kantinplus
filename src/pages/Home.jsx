import HeroContent from "../components/HeroContent";
import Peaks from "../components/Peaks";
import Products from "./Products";
import gabin from "../assets/gabin.png";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CartPill from "../components/CartPill";
import Toast from "../components/Toast";
import CartDrawer from "../components/CartDrawer";
import { useCallback, useState } from "react";

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <NavBar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <div className="bg-[#F7F8F3] min-h-screen relative isolate">
          <Peaks />
          <HeroContent />
        </div>
        <Products onAddToCart={addToCart} />
      </main>
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={closeCart}
        onChangeQuantity={changeCartQuantity}
        onRemove={removeFromCart}
      />

      <CartPill 
        cartCount={cartCount}
        total={total}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Toast />
    </>
  );
}
