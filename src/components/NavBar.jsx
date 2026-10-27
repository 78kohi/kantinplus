import Cart from "./svg/Cart";
import Logo from "./Logo";

export default function NavBar({ cartCount = 0, onCartClick }) {
  return (
    <header className="bg-[#F7F8F3] flex items-center justify-between px-4 py-4 shadow-sm relative z-10 top-0">
      <div className="flex items-center space-x-2">
        <div className="opacity-90 p-1 rounded-md text-white font-[Plus Jakarta Sans] text-xl font-bold">
          <Logo w={52} h={52} />
        </div>
        <div className="text-[#19334b] font-[Plus Jakarta Sans] text-2xl font-bold">
          Kantin<span className="text-[#a2d6f9]">plus</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <a
          href="#products"
          className={`text-[#19334b] font-jakarta text-lg font-semibold hover:text-[#48cae4] transition-colors duration-300`}
        >
          Produk
        </a>
        <a
          href="https://wa.me/081290902110"
          target="_blank"
          rel="noreferrer"
          className="text-[#19334b] font-jakarta text-lg font-semibold hover:text-[#48cae4] transition-colors duration-300 inline-flex items-center"
        >
          <i className="fa-brands fa-whatsapp text-[#19334b] hover:text-[#48cae4] transition-colors"></i>
          <span>Kontak</span>
        </a>
        <button
          type="button"
          onClick={onCartClick}
          aria-label={cartCount > 0 ? `Buka keranjang, ${cartCount} item` : 'Buka keranjang'}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <Cart />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#19334b] px-1 text-[10px] font-bold text-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
