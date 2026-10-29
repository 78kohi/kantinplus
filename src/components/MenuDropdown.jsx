import { UserRound } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

export default function MenuDropdown({ displayName, isAdmin, setIsMenuOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col">
      <button
        onClick={() => {
          setIsMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="rounded-lg px-4 py-2 text-left hover:bg-slate-100"
      >
        Home
      </button>

      <button
        onClick={() => {
          setIsMenuOpen(false);
          document.getElementById("products")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="rounded-lg px-4 py-2 text-left hover:bg-slate-100"
      >
        Products
      </button>
      <a
        href="https://wa.me/6281290902110"
        target="_blank"
        rel="noreferrer"
        className="font-jakarta flex items-center ml-3 mb-4 pt-1"
      >
        <i className="fa-brands fa-whatsapp text-[#19334b] hover:text-[#48cae4] transition-colors"></i>
        <span>Kontak</span>
      </a>
      <div className="border-t-1"></div>

      <button
        onClick={() => {
          setIsMenuOpen(false);
          navigate("/profile");
        }}
        className="flex px-4 py-3"
      >
        <UserRound />
        <span className="ml-2 font-semibold">
          {displayName ? displayName : "guest"} {isAdmin ? "(admin)" : ""}
        </span>
      </button>
    </nav>
  );
}
