import HeroContent from "../components/HeroContent";
import Peaks from "../components/Peaks";
import Products from "./Products";
import gabin from "../assets/gabin.png";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CartPill from "../components/CartPill"
import Toast from "../components/Toast";

export default function Home() {

    return (
        <>
        <NavBar />
        <main>
            <div className="bg-[#F7F8F3] min-h-screen relative isolate">
                <Peaks />
                <HeroContent />
            </div>
            <Products />
        </main>
        <Footer />

        <CartPill />
        <Toast />
        </>
    )
}