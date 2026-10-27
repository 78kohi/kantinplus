import HeroContent from "../components/HeroContent";
import Peaks from "../components/HeroArt";
import Products from "./Products";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CartPill from "../components/CartPill";
import Toast from "../components/Toast";
import CartDrawer from "../components/CartDrawer";
import HeroArt from "../components/HeroArt"
import { useCallback, useState } from "react";

export default function Home({
  cartItems,
  cartCount,
  subtotal,
  onAddToCart,
  onChangeCartQuantity,
  onRemoveFromCart,
  toast,
  onClearToast,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <>
      <NavBar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <div className="bg-[#F7F8F3] min-h-screen relative isolate">
          <div className="flex relative z-10 min-h-screen px-8 py-32 md:px-20 md:py-40 justify-start"> 
            <HeroContent />
            <HeroArt />
          </div>
        </div>
        <Products onAddToCart={onAddToCart} />
      </main>
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={closeCart}
        onChangeQuantity={onChangeCartQuantity}
        onRemove={onRemoveFromCart}
      />

      <CartPill
        cartCount={cartCount}
        total={subtotal}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Toast
        title={toast.title}
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={onClearToast}
      />
    </>
  );
}
