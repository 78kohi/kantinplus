import { UserRound } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

export default function MenuDropdown({ displayName, isAdmin, setIsMenuOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col gap-2">
      <button
        onClick={() => {
          setIsMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="rounded-lg px-4 py-3 text-left hover:bg-slate-100"
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
        className="rounded-lg px-4 py-3 text-left hover:bg-slate-100"
      >
        Products
      </button>
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
