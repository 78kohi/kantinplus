
import Smile from "./svg/Smile";

export default function HeroContent() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative z-20 w-full min-w-0 flex-1 md:w-auto">
      <h1 className="!font-bowlby text-6xl md:text-7xl xl:text-8xl text-[#5fa8d3]">
        Little Bites
      </h1>

      <h1 className="!font-bowlby text-5xl md:text-7xl xl:text-8xl text-[#5fa8d3]">
        Big Smiles{" "}
        <Smile className="relative inline-block h-12 w-12 md:h-[72px] md:w-[72px] xl:h-[84px] xl:w-[84px]" />
      </h1>

      <h2 className="mt-6 ml-1 w-fit rotate-[-3deg] bg-[#19334b] px-3 py-1 font-jakarta font-bold text-[#a2d6f9] text-2xl md:mt-8 md:text-4xl xl:text-5xl">
        Happiness in
      </h2>

      <h2 className="ml-[5px] w-fit bg-[#19334b] px-3 py-1 font-jakarta font-bold text-[#a2d6f9] text-2xl md:text-4xl xl:text-5xl">
        Every Bite
      </h2>

      <button
        className="mt-6 min-h-12 rounded-3xl bg-[#a2d6f9] px-8 py-3 text-lg font-bold text-white transition hover:bg-[#5fa8d3] sm:px-10 sm:text-xl md:mt-8 md:px-14 md:py-4 md:text-2xl x;:text-4xl"
        onClick={scrollToProducts}
      >
        Order Now!
      </button>
    </div>
  );
}
