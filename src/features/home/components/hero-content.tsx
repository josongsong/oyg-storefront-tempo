interface HeroContentProps {
  title: {
    line1: string
    line2: string
  }
  description: string
  ctaText: string
  onCtaClick?: () => void
}

export function HeroContent({ title, description, ctaText, onCtaClick }: HeroContentProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-10">
      <h2 className="text-[3.5rem] md:text-[5rem] font-bold mb-4 tracking-tight leading-[0.9]">
        {title.line1}
        <br />
        {title.line2}
      </h2>
      <p className="text-[1.1rem] md:text-[1.3rem] font-medium mb-8 max-w-lg">{description}</p>
      <button
        onClick={onCtaClick}
        className="bg-white text-black px-8 py-3 text-base font-bold hover:bg-gray-100 transition-colors"
      >
        {ctaText}
      </button>
    </div>
  )
}

