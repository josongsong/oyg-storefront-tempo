export interface Promotion {
  id: string
  title: string
  description: string
  imageUrl?: string
  startDate: Date
  endDate: Date
  discountPercent?: number
  isActive: boolean
}

export interface LuckyDrawPrize {
  id: string
  name: string
  imageUrl: string
  probability: number
}

export interface LuckyDrawResult {
  prizeId: string
  prizeName: string
  timestamp: Date
}

