import Cart from "./svg/Cart";
import Logo from "./Logo";
import AuthTest from "./AuthTest";
import { useState } from "react";
import { Menu, UserRound, X } from "lucide-react";
import MenuDropdown from "./MenuDropdown";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function NavBar({ cartCount = 0, onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { user, username, isAdmin, profileLoading } = useAuth();

  const displayName = profileLoading
    ? "Loading..."
    : username || user?.email || "Guest";

  return (
    <header className="bg-[#F7F8F3] flex items-center justify-between px-2 py-2 md:px-5 py-4 shadow-sm relative z-10 top-0">
      <div className="flex items-center md:space-x-1">
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
          className={`text-[#19334b] font-jakarta text-lg font-semibold hover:text-[#48cae4] transition-colors duration-300 hidden md:block`}
        >
          Produk
        </a>
        <a
          href="https://wa.me/081290902110"
          target="_blank"
          rel="noreferrer"
          className="text-[#19334b] font-jakarta text-lg font-semibold hover:text-[#48cae4] transition-colors duration-300 items-center hidden md:inline-flex"
        >
          <i className="fa-brands fa-whatsapp text-[#19334b] hover:text-[#48cae4] transition-colors"></i>
          <span>Kontak</span>
        </a>
        <button
          type="button"
          onClick={onCartClick}
          aria-label={
            cartCount > 0
              ? `Buka keranjang, ${cartCount} item`
              : "Buka keranjang"
          }
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <Cart />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#19334b] px-1 text-[10px] font-bold text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Buka menu"
          className="relative flex h-10 w-10 -ml-2 mr-2 items-center justify-center rounded-full text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Buka profil"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 hidden md:block"
        >
          <UserRound />
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[999] border-t border-slate-200 bg-white p-4 shadow-lg md:hidden">
          <MenuDropdown
            displayName={displayName}
            isAdmin={isAdmin}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
      )}
    </header>
  );
}
