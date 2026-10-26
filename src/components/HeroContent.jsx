import gabin from "../assets/gabin.png";

export default function HeroContent() {
  return (
    <div className="flex relative z-10 min-h-screen px-8 py-32 md:px-20 md:py-40 justify-start"> 
      <div>
        <h1 className="font-bowlby md:text-7xl text-[#5fa8d3]">Little Bites</h1>
        <h1 className="font-bowlby md:text-7xl text-[#5fa8d3]">Big Smiles :<div className="smile"></div></h1>

        <h2 className="bg-black w-fit py-1 px-4 font-jakarta text-2xl md:text-4xl font-bold text-white rotate-[-3deg] ml-[-1px] mt-8">Happiness in</h2>
        <h2 className="bg-black w-fit py-1 px-4 font-jakarta text-2xl md:text-4xl font-bold text-white">Every Bite</h2>

        <button className="mt-8 max-w-xs rounded-xl bg-[#a2d6f9] px-8 py-4 text-xl font-bold text-white transition hover:bg-[#5fa8d3]">
          Order Now!
        </button>
      </div>

      <div className="w-[50%] flex justify-end items-center">
        <img src={gabin} alt="gabin" className="" />
      </div>
    </div>
  )
}
