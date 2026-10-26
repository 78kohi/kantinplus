export default function NavBar({ cartCount = 0, onCartClick }) {
  return (
    <header className="relative z-10 top-0 flex items-center justify-between bg-[#F7F8F3] px-4 py-4 shadow-sm">
      <a href="#home" className="flex items-center space-x-2" aria-label="Kantinplus, ke halaman utama">
        <span className="rounded-md bg-[#a2d6f9] p-1 text-xl font-bold text-white">K+</span>
        <span className="text-2xl font-bold text-[#19334b]">
          Kantin<span className="text-[#a2d6f9]">plus</span>
        </span>
      </a>

      <nav className="flex items-center gap-3 sm:gap-4">
        <a
          href="#home"
          className="font-jakarta text-sm font-semibold text-[#19334b] transition-colors hover:text-[#48a9df] sm:text-base"
        >
          Home
        </a>
        <a
          href="#products"
          className="font-jakarta text-sm font-semibold text-[#19334b] transition-colors hover:text-[#48a9df] sm:text-base"
        >
          Produk
        </a>
        <button
          type="button"
          onClick={onCartClick}
          aria-label={cartCount > 0 ? `Buka keranjang, ${cartCount} item` : 'Buka keranjang'}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#19334b] px-1 text-[10px] font-bold text-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  )
}
