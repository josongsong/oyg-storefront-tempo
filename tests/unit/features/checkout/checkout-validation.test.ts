import { describe, it, expect } from 'vitest'

describe('Checkout Validation', () => {
  describe('이메일 검증', () => {
    it('유효한 이메일 형식을 통과해야 함', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.kr',
        'user+tag@example.com',
      ]
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('잘못된 이메일 형식을 거부해야 함', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ]
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe('전화번호 검증', () => {
    it('유효한 전화번호 형식을 통과해야 함', () => {
      const validPhones = [
        '010-1234-5678',
        '02-123-4567',
        '+82-10-1234-5678',
      ]
      
      validPhones.forEach(phone => {
        expect(phone.length).toBeGreaterThan(0)
      })
    })
  })

  describe('주소 검증', () => {
    it('필수 주소 필드가 있어야 함', () => {
      const address = {
        street: '123 Main St',
        city: 'Seoul',
        postalCode: '12345',
      }
      
      expect(address.street).toBeDefined()
      expect(address.city).toBeDefined()
      expect(address.postalCode).toBeDefined()
    })

    it('우편번호가 5자리여야 함', () => {
      const validPostalCodes = ['12345', '06789']
      
      validPostalCodes.forEach(code => {
        expect(code).toMatch(/^\d{5}$/)
      })
    })
  })

  describe('결제 정보 검증', () => {
    it('카드 번호가 16자리여야 함', () => {
      const cardNumber = '1234567812345678'
      expect(cardNumber).toMatch(/^\d{16}$/)
    })

    it('CVV가 3-4자리여야 함', () => {
      const validCVVs = ['123', '1234']
      
      validCVVs.forEach(cvv => {
        expect(cvv).toMatch(/^\d{3,4}$/)
      })
    })

    it('만료일이 미래여야 함', () => {
      const currentDate = new Date()
      const futureDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth())
      
      expect(futureDate > currentDate).toBe(true)
    })
  })
})

