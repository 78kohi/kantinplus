export default function NavBar(activePage) {
  
  return (
    <header className="bg-[#F7F8F3] flex items-center justify-between px-4 py-4 shadow-sm relative z-10 top-0">
      <div className="flex items-center space-x-2">
        <div className="bg-[#A5D6A7] opacity-90 p-1 rounded-md text-white font-[Plus Jakarta Sans] text-xl font-bold">K+</div>
        <div className="text-[#193B32] font-[Plus Jakarta Sans] text-2xl font-bold">Kantin<span className="text-[#7da684]">plus</span></div>
      </div>
      <div className="flex gap-4">
        <a href="#home" className={`text-[#193B32] font-[Plus Jakarta Sans] ${activePage === 'home' ? 'underline' : ''} text-lg font-semibold hover:text-[#7da684] transition-colors duration-300`}>Home</a>
        <a href="#about" className={`text-[#193B32] font-[Plus Jakarta Sans] ${activePage === 'about' ? 'underline' : ''} text-lg font-semibold hover:text-[#7da684] transition-colors duration-300`}>Tentang Kami</a>
        <a href="#products" className={`text-[#193B32] font-[Plus Jakarta Sans] ${activePage === 'products' ? 'underline' : ''} text-lg font-semibold hover:text-[#7da684] transition-colors duration-300`}>Produk</a>
      </div>
    </header>
  )
}
