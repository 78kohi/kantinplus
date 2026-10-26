import HeroContent from "../components/HeroContent";
import Peaks from "../components/Peaks";
import Products from "./Products";
import gabin from "../assets/gabin.png";

export default function Home() {

    return (
        <div className="bg-[#F7F8F3] min-h-screen relative isolate">
            <Peaks />
            <HeroContent />
        </div>
    )
}