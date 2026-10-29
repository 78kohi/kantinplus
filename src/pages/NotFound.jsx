import { Link } from "react-router";
import Logo from "../components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="flex items-center md:space-x-1">
        <div className="opacity-90 p-1 rounded-md text-white font-[Plus Jakarta Sans] text-xl font-bold">
          <Logo w={52} h={52} />
        </div>
        <div className="text-[#19334b] font-[Plus Jakarta Sans] text-2xl font-bold">
          Kantin<span className="text-[#a2d6f9]">plus</span>
        </div>
      </div>

      <h1 className="mt-4 text-8xl font-bold text-[#5fa8d3]">404</h1>

      <h2 className="mt-4 text-2xl font-bold">Oops! Halaman tidak ditemukan</h2>

      <p className="mt-3 max-w-md text-gray-500">
        Sepertinya halaman yang kamu cari tidak tersedia atau mungkin sudah
        dipindahkan.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-[#5fa8d3] px-6 py-3
                   font-semibold text-white transition
                   hover:bg-sky-600"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
