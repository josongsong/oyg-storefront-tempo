export interface SearchResult {
  id: string
  name: string
  category: string
  relevance: number
}

export interface SearchHistory {
  query: string
  timestamp: number
}

export interface TrendingSearch {
  query: string
  count: number
}

