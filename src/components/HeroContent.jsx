import Smile from "./svg/Smile";

export default function HeroContent() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex-1">
      <h1 className="!font-bowlby md:text-7xl text-[#5fa8d3]">Little Bites</h1>
      <h1 className="!font-bowlby md:text-7xl text-[#5fa8d3]">
        Big Smiles <Smile className="relative inline-block h-[72px] w-[72px]" />
      </h1>

      <h2 className="bg-[#19334b] w-fit py-1 px-4 font-jakarta text-2xl md:text-4xl font-bold text-[#a2d6f9] rotate-[-3deg] ml-[-1px] mt-8">
        Happiness in
      </h2>
      <h2 className="bg-[#19334b] w-fit py-1 px-4 font-jakarta text-2xl md:text-4xl font-bold text-[#a2d6f9]">
        Every Bite
      </h2>

      <button
        className="mt-8 max-w-xs rounded-3xl bg-[#a2d6f9] px-14 py-4 text-2xl font-bold text-white transition hover:bg-[#5fa8d3]"
        onClick={scrollToProducts}
      >
        Order Now!
      </button>
    </div>
  );
}
