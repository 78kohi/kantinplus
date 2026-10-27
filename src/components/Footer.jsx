import Logo from "./Logo";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mx-auto w-full bg-[#1b344d] px-10 pt-10 pb-8 font-sans">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Logo />
          <div className="text-[#5fa8d3] font-[Plus Jakarta Sans] text-2xl font-bold">
            Kantin<span className="text-[#a2d6f9]">plus</span>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <a href="#home" className="text-xl text-white font-semibold hover:text-sky-200 transition-colors">
            Home
          </a>
          <a
            href="https://wa.me/081290902110"
            target="_blank"
            rel="noreferrer"
            className="text-white font-jakarta text-xl font-semibold hover:text-sky-200 transition-colors duration-300 inline-flex items-center"
          >
            <i className="fa-brands fa-whatsapp text-white hover:text-sky-200"></i>
            <span>Kontak</span>
          </a>
          <a href="#products" className="text-xl text-white font-semibold hover:text-sky-200">
            Products
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-sky-100 text-[#1b344d] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Garis pemisah */}
      <hr className="mt-6 border-t border-slate-500/60" />

      {/* Bagian bawah: copyright */}
      <div className="mt-6 flex items-center justify-between text-xl">
        <p className="text-slate-400">© 2026 kantinplus</p>
        <p className="text-white">by Metadigz™</p>
      </div>
    </footer>
  );
}
