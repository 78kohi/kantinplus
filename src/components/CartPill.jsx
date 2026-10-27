import React, { useEffect, useState } from "react";
import Cart from "./svg/Cart";

export default function CartPill({ cartCount, total, onCartClick }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setShow(false);

      const frame = requestAnimationFrame(() => {
        setShow(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    setShow(false);
  }, [cartCount]);

  if (cartCount <= 0 && !show) return null;

  return (
    <button
      className={`
        fixed bottom-6 right-6 z-40 px-4 py-3 flex items-center rounded-full bg-[#59ACF8]
        hover:bg-[#59c0f8] text-white shadow-lg
        transition-all duration-500 ease-out
        transform
        ${
          show
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-6 opacity-0 pointer-events-none"
        }
      `}
      onClick={onCartClick}
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full">
        <Cart />
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#59acf8]">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </span>
      <span className="mx-1">|</span>
      <span className="font-semibold">Rp. {total}</span>
    </button>
  );
}
