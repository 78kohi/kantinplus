import Logo from "./Logo";

export default function NavBar({ activePage }) {
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
          href="#home"
          className={`text-[#19334b] font-jakarta ${activePage === "home" ? "underline" : ""} text-lg font-semibold hover:text-[#48cae4] transition-colors duration-300`}
        >
          Home
        </a>
        <a
          href="#products"
          className={`text-[#19334b] font-jakarta ${activePage === "products" ? "underline" : ""} text-lg font-semibold hover:text-[#48cae4] transition-colors duration-300`}
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
        <button className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          <i className="fa-solid fa-cart-shopping"></i>
        </button>
      </div>
    </header>
  );
}
