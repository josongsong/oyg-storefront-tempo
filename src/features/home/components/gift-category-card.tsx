interface GiftCategoryCardProps {
  title: string
  subtitle?: string
  image: string
  isQuiz?: boolean
}

export function GiftCategoryCard({ title, subtitle, image, isQuiz }: GiftCategoryCardProps) {
  return (
    <div
      className="shrink-0 w-[280px] md:w-[320px] h-[280px] md:h-[320px] relative group cursor-pointer overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.opacity = '0'
        }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

      {isQuiz ? (
        <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{title}</h3>
          <button className="border-2 border-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors">
            {subtitle}
          </button>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      )}
    </div>
  )
}

