export interface TikTokVideo {
  id: string
  thumbnail: string
  videoUrl?: string
  title: string
  product?: {
    id: number | string
    name: string
    price: string
    image: string
  }
  likes?: number
  views?: number
}
