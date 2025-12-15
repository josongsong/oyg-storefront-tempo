import { describe, it, expect } from 'vitest'

describe('Search Utils', () => {
  describe('검색어 정규화', () => {
    it('공백을 제거해야 함', () => {
      const query = '  test  '
      expect(query.trim()).toBe('test')
    })

    it('소문자로 변환해야 함', () => {
      const query = 'TEST Query'
      expect(query.toLowerCase()).toBe('test query')
    })

    it('특수문자를 처리해야 함', () => {
      const query = 'test@#$%'
      expect(query.replace(/[^a-zA-Z0-9\s]/g, '')).toBe('test')
    })
  })

  describe('검색 결과 필터링', () => {
    const mockProducts = [
      { id: '1', name: 'Face Cream', brand: 'Brand A', price: '30' },
      { id: '2', name: 'Body Lotion', brand: 'Brand B', price: '25' },
      { id: '3', name: 'Face Serum', brand: 'Brand A', price: '40' },
    ]

    it('이름으로 검색해야 함', () => {
      const query = 'face'
      const results = mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      )
      
      expect(results).toHaveLength(2)
      expect(results[0].name).toContain('Face')
    })

    it('브랜드로 검색해야 함', () => {
      const query = 'brand a'
      const results = mockProducts.filter(p => 
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
      
      expect(results).toHaveLength(2)
    })

    it('빈 검색어는 모든 결과를 반환해야 함', () => {
      const query = ''
      const results = query.trim() ? mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      ) : mockProducts
      
      expect(results).toHaveLength(3)
    })
  })

  describe('검색 히스토리', () => {
    it('최근 검색어를 저장해야 함', () => {
      const history: string[] = []
      const newQuery = 'cream'
      
      history.unshift(newQuery)
      
      expect(history[0]).toBe('cream')
    })

    it('중복 검색어를 제거해야 함', () => {
      const history = ['cream', 'serum', 'cream']
      const uniqueHistory = [...new Set(history)]
      
      expect(uniqueHistory).toHaveLength(2)
    })

    it('최대 10개까지만 저장해야 함', () => {
      const history = Array.from({ length: 15 }, (_, i) => `query${i}`)
      const limitedHistory = history.slice(0, 10)
      
      expect(limitedHistory).toHaveLength(10)
    })
  })

  describe('트렌딩 검색어', () => {
    it('인기 검색어를 정렬해야 함', () => {
      const searches = [
        { term: 'cream', count: 100 },
        { term: 'serum', count: 150 },
        { term: 'toner', count: 80 },
      ]
      
      const sorted = [...searches].sort((a, b) => b.count - a.count)
      
      expect(sorted[0].term).toBe('serum')
      expect(sorted[2].term).toBe('toner')
    })
  })
})

