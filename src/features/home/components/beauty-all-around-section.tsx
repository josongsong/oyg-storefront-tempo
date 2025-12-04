export function BeautyAllAroundSection() {
  const items = [
    {
      title: 'Give a Glow',
      desc: 'Treat them to their next skincare obsession.',
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Gifts for Good Hair',
      desc: 'Their ticket to glossy, salon-level shine.',
      img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Makeup, Wrapped Up',
      desc: 'All is bright, all is glowy.',
      img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'All-Over Indulgence',
      desc: 'Something beautiful for every body.',
      img: 'https://images.unsplash.com/photo-1556228720-1987df3629e5?w=600&auto=format&fit=crop&q=80',
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h2 className="text-3xl font-normal mb-8">Beauty All Around</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-square overflow-hidden mb-4 bg-gray-100">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

