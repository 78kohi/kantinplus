import gabin from "../assets/gabin.png";
import gabinElement from "../assets/gabin-element.png"
import Sparkle from "../components/svg/Sparkle.jsx"

export default function HeroArt() {
  return (
    <div className="relative isolate flex-1 mt-[-100px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        className="absolute inset-0 z-0 w-full h-full scale-[110%]"
        preserveAspectRatio="none"
      >
        <path
          fill="rgb(149,206,246)"
          fill-rule="evenodd"
          transform="scale(1.3)"
          d="M523 162.6C524.9 163.4 532.3 165.9 539.5 168.3C557.2 174.1 563.3 176.5 567 179.3C569.2 180.9 569.5 182.1 569.1 186C568.4 192.6 564.5 201.2 554.3 218.8C547.2 231 545.4 234.3 543.7 238.6C538.2 252.7 537.6 267 541.8 281C542.8 284.4 547.5 293.9 550.7 299C555.3 306.4 558.7 310.7 574.7 330.3C596.3 356.6 597.4 358.8 592.3 364.6C588.1 369.3 580.3 374.8 566 383.1C534.5 401.3 522.5 416.5 521.1 440C520.3 451.9 521.2 458 526.2 477.5C530 492.6 530.5 495.4 529.8 498.5C528.3 504.3 523.9 506.6 514 506.9C502.5 507.3 480.4 510.1 469 512.7C448.4 517.4 429.7 527.5 416.5 541.4C408.6 549.7 402.1 558.8 391.6 576.5C379.9 596 371.2 606.4 366.5 606.5C361.9 606.6 358.2 604.5 337 589.6C326.3 582.1 314.6 574.1 311 571.9C278.6 551.5 256.8 547.5 227.5 556.2C225.3 556.9 215.9 560.5 206.5 564.2C178.3 575.4 172.3 576.4 167.5 570.8C165.2 568.1 163.7 565 162.3 560C161.3 556.6 156.6 529.2 155.9 523.5C155.4 518.8 153.8 510.2 151.8 502C144.1 469.6 128 448.4 101.9 436.4C100.6 435.8 93.4 433.1 85.8 430.4C65.8 423.2 59 419.8 56.7 415.5C54.8 412.1 57.3 403.3 63.7 390.5C72.8 372.2 82.5 348.1 84.9 338C90 315.4 85.8 298.3 68.3 271C65.6 266.9 63.3 263.1 63 262.5C62.8 262 61.8 260.4 60.9 259C59.9 257.6 58.1 254.5 56.8 252C50.2 239.7 50.2 236.2 56.7 229.8C59.9 226.7 69.5 219.4 79 212.9C108.5 192.7 123.3 169.6 123.1 144C123.1 139.8 121 124.8 119.5 118C117.8 110.5 117.4 107.5 117.5 104C117.7 94.4 123.8 92.5 141.5 96.6C170.2 103.2 191.4 98.2 210.5 80.2C220.3 70.9 222.4 68.4 239 46C245.7 36.9 252.4 28.1 253.9 26.5C258.9 20.7 266.9 14.5 269.4 14.5C270.8 14.5 276.7 17.4 280 19.7C283.4 22.1 290.3 28.1 299.7 36.7C308.7 45 312.7 48.2 319.5 52.8C352.7 75 391.4 81.7 430 71.9C432.5 71.3 438.6 69.3 443.5 67.6C456 63.2 463 62.7 465.8 66C468.2 68.9 470.9 77.6 473 89.5C473.9 95 476.7 106.7 478.7 113.4C481.8 124.2 489.3 138.4 495.5 145.3C500.1 150.4 513.3 158.7 523 162.6ZM527.5 315.9C526.8 316.8 527 331.7 527.7 331C528 330.7 528.2 327.1 528.1 322.9C528 318.6 527.7 315.5 527.5 315.9Z"
        ></path>
      </svg>
      <img src={gabin} alt="gabin" className="relative z-10 mx-auto mt-15 w-[230px]" />

      <img src={gabinElement} alt="" className="absolute left-[8%] top-[14%] z-20 w-20 rotate-12 " />
      <img src={gabinElement} alt="" className="absolute right-[8%] bottom-[10%] z-20 w-24 -rotate-12 " />

      <div
        className="absolute right-[5%] top-[12%] z-20 -rotate-6 rounded-xl text-xl bg-white px-4 py-3 font-black text-blue-950 shadow-sm "
      >
        CRUNCH<br />TIME!
      </div>

      <Sparkle className="absolute left-[12%] top-[32%] z-20 w-16 h-16 -rotate-5 text-white" />
      <Sparkle className="absolute left-[25%] bottom-[12%] z-20 w-14 h-14 rotate-5 text-white" />
      <Sparkle className="absolute right-[21%] top-[36%] z-20 w-18 h-18 rotate-20 text-white" />

      <Sparkle className="absolute left-[0%] bottom-[6%] z-20 w-12 h-12 rotate-2 text-[#a2d6f9]" />
      <Sparkle className="absolute right-[10%] top-[-5%] z-20 w-16 h-16 -rotate-12 text-[#a2d6f9]" />
    </div>
  );
}
