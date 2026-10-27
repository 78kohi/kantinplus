import React from 'react'

export default function Strip() {
  const features = [
    "RASA INOVATIF",
    "GURIHNYA PAS",
    "A TASTE OF HOME",
    "PURE COMFORT",
    "NGEMIL JADI LEBIH SERU",
    "YOUR LITTLE TREAT",
    "ALWAYS A CLASSIC SNACK"
  ]

  return (
    <div className="flex w-max border-y-3 border-[#5fa8d3] rotate-[-2deg] mt-[-49px] animate-marquee overflow-hidden">
      {[...features, ...features].map((feature) => (
        <div className="flex items-center justify-center bg-white border-r-3 border-[#5fa8d3] px-4 py-5 text-center text-lg font-extrabold uppercase text-[#5fa8d3] last:border-r-0">
          {feature}
        </div>
      ))}
    </div>
  )
}
