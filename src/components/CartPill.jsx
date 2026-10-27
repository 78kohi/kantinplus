import React from "react";

export default function () {
  let cartCount = 2;

  return (
    <button className="fixed bottom-6 right-6 z-40 flex items-center rounded-full bg-[#59ACF8] hover:bg-[#59c0f8] transition-colors px-5 py-3 text-white shadow-lg">
      <i class="fa-solid fa-cart-shopping mx-1"></i>
      <span className="mx-1 bg-white w-[20px] h-[20px] rounded-full flex items-center justify-center text-[#59acf8] text-sm ">
        {cartCount}
      </span>
      <span className="mx-1">|</span>
      <span className="">Keranjang</span>
    </button>
  );
}
