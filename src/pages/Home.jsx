import HeroContent from "../components/HeroContent";
import Peaks from "../components/Peaks";
import Products from "./Products";
import gabin from "../assets/gabin.png";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  return (
    <div className="bg-[#F7F8F3] min-h-screen relative isolate">
      {/* Komponen bawaan dari tim */}
      <Peaks />
      <HeroContent />
      
      {/* Komponen Grid Produk Gabin Fla dengan tema navy */}
      <ProductGrid />
    </div>
  );
}