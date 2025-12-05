export interface GridItem {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  buttonText: string
}

export const GRID_ITEMS: GridItem[] = [
  {
    id: 'party-looks',
    title: 'SERVE FACE ALL SZN',
    subtitle: 'PARTY LOOKS',
    description: "Lit looks that'll turn heads at every holiday function.",
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=1200&fit=crop',
    buttonText: 'SHOP NOW',
  },
  {
    id: 'winter-hydration',
    title: 'COZY UP TO SOFTER SKIN',
    subtitle: 'WINTER HYDRATION',
    description: "Cold weather stealin' your glow? Drip yourself in next-level nourishment.",
    image: 'https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=800&h=1200&fit=crop',
    buttonText: 'SHOP NOW',
  },
  {
    id: 'holiday-hairstyles',
    title: "'DO IT BIG",
    subtitle: 'HOLIDAY HAIRSTYLES',
    description: 'Stunt major styles with haircare that brings the repair.',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=1200&fit=crop',
    buttonText: 'SHOP NOW',
  },
  {
    id: 'scent-of-szn',
    title: 'SCENT OF THE SZN',
    subtitle: 'SCENT OF THE SZN',
    description: 'Signature scents that make a lasting impression.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1200&fit=crop',
    buttonText: 'SHOP NOW',
  },
]

