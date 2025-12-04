import { motion } from 'framer-motion'

interface GridItem {
  id: string
  title: string
  subtitle?: string
  image: string
  span: 'small' | 'medium' | 'large'
  textPosition: 'left' | 'center' | 'right'
  textColor: 'white' | 'black'
  overlay?: string
  cta?: string
}

const GRID_ITEMS: GridItem[] = [
  {
    id: 'party-looks',
    title: 'PARTY LOOKS',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&auto=format&fit=crop&q=80',
    span: 'small',
    textPosition: 'left',
    textColor: 'white',
    overlay: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
  },
  {
    id: 'winter-hydration',
    title: 'WINTER HYDRATION',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&auto=format&fit=crop&q=80',
    span: 'small',
    textPosition: 'left',
    textColor: 'white',
    overlay: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
  },
  {
    id: 'holiday-hairstyles',
    title: "'DO IT BIG",
    subtitle: 'HOLIDAY HAIRSTYLES',
    image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1200&auto=format&fit=crop&q=80',
    span: 'large',
    textPosition: 'center',
    textColor: 'white',
    overlay: 'bg-black/30',
    cta: 'SHOP NOW',
  },
  {
    id: 'scent-of-the-szn',
    title: 'SCENT OF THE SZN',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&auto=format&fit=crop&q=80',
    span: 'small',
    textPosition: 'center',
    textColor: 'white',
    overlay: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
  },
]

export function LifestyleGridSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1600px] mx-auto px-0 md:px-4">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-1 md:gap-2 h-[600px] lg:h-[700px]">
          {GRID_ITEMS.map((item, index) => {
            const isLarge = item.span === 'large'
            const colSpan = isLarge ? 'md:col-span-2' : 'md:col-span-1'
            const rowSpan = isLarge ? 'md:row-span-2' : 'md:row-span-1'

            return (
              <motion.div
                key={item.id}
                className={`relative overflow-hidden group cursor-pointer ${colSpan} ${rowSpan}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 ${item.overlay} group-hover:opacity-80 transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <div
                  className={`relative h-full flex flex-col justify-end p-6 md:p-8 ${
                    item.textPosition === 'center'
                      ? 'items-center justify-center text-center'
                      : item.textPosition === 'left'
                        ? 'items-start'
                        : 'items-end'
                  }`}
                >
                  {item.subtitle && (
                    <motion.p
                      className={`text-xs md:text-sm tracking-[0.2em] mb-2 ${
                        item.textColor === 'white' ? 'text-white' : 'text-black'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {item.subtitle}
                    </motion.p>
                  )}

                  <motion.h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${
                      item.textColor === 'white' ? 'text-white' : 'text-black'
                    } ${isLarge ? 'mb-6' : 'mb-2'}`}
                    style={{
                      writingMode: item.textPosition === 'right' && !isLarge ? 'vertical-rl' : 'horizontal-tb',
                      transform: item.textPosition === 'right' && !isLarge ? 'rotate(180deg)' : 'none',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {item.title}
                  </motion.h3>

                  {item.cta && (
                    <motion.button
                      className="bg-white text-black px-8 py-3 text-sm font-bold tracking-wide hover:bg-black hover:text-white transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.cta}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile Stack */}
        <div className="md:hidden space-y-1">
          {GRID_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative h-[400px] overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {/* Overlay */}
                <div className={`absolute inset-0 ${item.overlay}`} />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end items-center text-center p-8">
                {item.subtitle && (
                  <p className={`text-xs tracking-[0.2em] mb-2 ${item.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                    {item.subtitle}
                  </p>
                )}

                <h3 className={`text-3xl font-bold mb-4 ${item.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                  {item.title}
                </h3>

                {item.cta && (
                  <button className="bg-white text-black px-8 py-3 text-sm font-bold tracking-wide hover:bg-black hover:text-white transition-colors">
                    {item.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

