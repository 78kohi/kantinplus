import React, { useEffect, useState } from "react";
import Cart from "./svg/Cart";
import { useFooterVisible } from "../hooks/useFooterVisible";

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function CartMobile({ cartCount = 0, total = 0, onCartClick }) {
  const footerVisible = useFooterVisible();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (cartCount <= 0 || footerVisible) {
      setShow(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setShow(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [cartCount, footerVisible]);

  // Don't unmount when footerVisible is true!

  return (
    <button
      className={`
        fixed bottom-[calc(1rem+env(safe-area-inset-bottom))]
        left-1/2 z-40
        flex w-[calc(100%-2rem)] -translate-x-1/2
        items-center gap-3 rounded-2xl
        bg-[#5fa8d3] px-2 py-2
        transition-[opacity,translate] duration-300 ease-in-out
        md:hidden
        ${
          show && cartCount > 0
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-8 opacity-0 pointer-events-none"
        }
      `}
      onClick={onCartClick}
      aria-hidden={!show || cartCount <= 0}
      tabIndex={show && cartCount > 0 ? 0 : -1}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-2">
        <Cart className="text-[#5fa8d3] -ml-1" />
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="text-left">
          <p className="text-sm font-semibold text-white">
            {cartCount} Item - Lihat keranjang
          </p>
          <p className="text-xs text-white/70">Pesananmu siap diperiksa</p>
        </span>

        <span className="mr-1 shrink-0 text-lg font-extrabold text-white">
          {formatRupiah(total)}
        </span>
      </div>
    </button>
  );
}
