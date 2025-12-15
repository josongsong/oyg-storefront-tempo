import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocalePopup } from '@/features/locale/components/locale-popup'
import { useLocaleStore } from '@/features/locale/stores/locale.store'

describe('LocalePopup', () => {
  beforeEach(() => {
    useLocaleStore.setState({
      settings: { language: 'ko', currency: 'KRW' },
      isPopupOpen: false,
    })
  })

  describe('렌더링', () => {
    it('팝업이 닫혀있을 때 렌더링되지 않아야 함', () => {
      render(<LocalePopup />)
      expect(screen.queryByText('Regional Settings')).not.toBeInTheDocument()
    })

    it('팝업이 열렸을 때 렌더링되어야 함', () => {
      useLocaleStore.setState({ isPopupOpen: true })
      render(<LocalePopup />)
      expect(screen.getByText('Regional Settings')).toBeInTheDocument()
    })

    it('언어 선택 옵션이 표시되어야 함', () => {
      useLocaleStore.setState({ isPopupOpen: true })
      render(<LocalePopup />)
      expect(screen.getByText('Korean')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Japanese')).toBeInTheDocument()
      expect(screen.getByText('Chinese')).toBeInTheDocument()
    })

    it('통화 선택 옵션이 표시되어야 함', () => {
      useLocaleStore.setState({ isPopupOpen: true })
      render(<LocalePopup />)
      expect(screen.getByText(/Korean Won/)).toBeInTheDocument()
      expect(screen.getByText(/US Dollar/)).toBeInTheDocument()
    })
  })

  describe('언어 선택', () => {
    it('현재 선택된 언어가 하이라이트되어야 함', () => {
      useLocaleStore.setState({
        settings: { language: 'ko', currency: 'KRW' },
        isPopupOpen: true,
      })
      const { container } = render(<LocalePopup />)
      const koreanButton = screen.getByText('Korean').closest('button')
      expect(koreanButton).toHaveClass('border-black')
    })

    it('언어를 변경할 수 있어야 함', async () => {
      useLocaleStore.setState({ isPopupOpen: true })
      const user = userEvent.setup()
      render(<LocalePopup />)

      await user.click(screen.getByText('English'))
      await user.click(screen.getByText('Save'))

      const { settings } = useLocaleStore.getState()
      expect(settings.language).toBe('en')
    })
  })

  describe('통화 선택', () => {
    it('현재 선택된 통화가 하이라이트되어야 함', () => {
      useLocaleStore.setState({
        settings: { language: 'ko', currency: 'KRW' },
        isPopupOpen: true,
      })
      render(<LocalePopup />)
      const krwButton = screen.getByText(/Korean Won/).closest('button')
      expect(krwButton).toHaveClass('border-black')
    })

    it('통화를 변경할 수 있어야 함', async () => {
      useLocaleStore.setState({ isPopupOpen: true })
      const user = userEvent.setup()
      render(<LocalePopup />)

      await user.click(screen.getByText(/US Dollar/))
      await user.click(screen.getByText('Save'))

      const { settings } = useLocaleStore.getState()
      expect(settings.currency).toBe('USD')
    })
  })

  describe('저장 및 닫기', () => {
    it('Save 버튼으로 설정을 저장하고 닫아야 함', async () => {
      useLocaleStore.setState({ isPopupOpen: true })
      const user = userEvent.setup()
      render(<LocalePopup />)

      await user.click(screen.getByText('English'))
      await user.click(screen.getByText(/US Dollar/))
      await user.click(screen.getByText('Save'))

      const { settings, isPopupOpen } = useLocaleStore.getState()
      expect(settings.language).toBe('en')
      expect(settings.currency).toBe('USD')
      expect(isPopupOpen).toBe(false)
    })

    it('Cancel 버튼으로 변경 없이 닫아야 함', async () => {
      useLocaleStore.setState({
        settings: { language: 'ko', currency: 'KRW' },
        isPopupOpen: true,
      })
      const user = userEvent.setup()
      render(<LocalePopup />)

      await user.click(screen.getByText('English'))
      await user.click(screen.getByText('Cancel'))

      const { settings, isPopupOpen } = useLocaleStore.getState()
      expect(settings.language).toBe('ko') // 변경되지 않음
      expect(isPopupOpen).toBe(false)
    })
  })

  describe('임시 설정', () => {
    it('팝업이 열릴 때마다 현재 설정을 로드해야 함', () => {
      useLocaleStore.setState({
        settings: { language: 'en', currency: 'USD' },
        isPopupOpen: false,
      })
      const { rerender } = render(<LocalePopup />)

      useLocaleStore.setState({ isPopupOpen: true })
      rerender(<LocalePopup />)

      const enButton = screen.getByText('English').closest('button')
      const usdButton = screen.getByText(/US Dollar/).closest('button')
      expect(enButton).toHaveClass('border-black')
      expect(usdButton).toHaveClass('border-black')
    })
  })
})

