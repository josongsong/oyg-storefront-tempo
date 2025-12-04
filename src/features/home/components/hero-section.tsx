export function HeroSection() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] bg-gray-100 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2000&auto=format&fit=crop"
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-md">
          Spoil Them With
          <br />
          Every Spritz
        </h2>
        <p className="text-lg md:text-xl font-medium mb-8 max-w-lg drop-shadow-sm">
          Treat them to an iconic fragrance and compliments will follow everywhere they go.
        </p>
        <button className="bg-black text-white px-8 py-3 text-base font-medium hover:bg-gray-800 transition-colors">
          Shop now
        </button>
      </div>
    </div>
  )
}

