import Link from 'next/link';
import React from 'react'

const Collab = () => {
  return (
    <div>
        <section className="bg-white py-10 md:py-10 border-y border-gray-100">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-10 md:mb-16">
      <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black mb-2">
        In Collaboration With
      </h3>
      <div className="h-px w-20 bg-indigo-600 mx-auto">
      </div>
    </div>

    {/* Brand Grid with Transitions */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center opacity-70">
      
      {/* Nike */}
      <div className="group transition-all duration-500 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer">
        <span className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase">
          Nike
        </span>
      </div>

      {/* Allen Solly */}
      <div className="group transition-all duration-500 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer">
        <span className="text-lg md:text-xl font-serif font-bold text-black tracking-tight uppercase">
          Allen Solly
        </span>
      </div>

      {/* HRX */}
      <div className="group transition-all duration-500 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer">
        <span className="text-2xl md:text-3xl font-black text-black tracking-widest uppercase">
          HRX
        </span>
      </div>

      {/* New Balance */}
      <div className="group transition-all duration-500 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer">
        <span className="text-xl md:text-2xl font-extrabold text-black tracking-tighter">
          N<span className="text-indigo-600">B</span>
        </span>
      </div>

      {/* Levi's */}
      <div className="group transition-all duration-500 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer">
        <span className="text-2xl md:text-3xl font-black text-red-600 tracking-tighter uppercase">
          Levi's
        </span>
      </div>

      {/* Zara (Bonus for Gen-Z Vibe) */}
      <div className="group transition-all duration-500 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer text-center">
        <span className="text-xl md:text-2xl font-light text-black tracking-[0.3em] uppercase">
          Zara
        </span>
      </div>

    </div>
  </div>
</section>
    </div>
  )
}

export default Collab;