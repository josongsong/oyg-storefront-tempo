/**
 * Test IDs
 * 일관된 테스트 선택자를 위한 상수
 */

export const TEST_IDS = {
  // Product
  PRODUCT: {
    CARD: 'product-card',
    NAME: 'product-name',
    BRAND: 'product-brand',
    PRICE: 'product-price',
    RATING: 'product-rating',
    IMAGE: 'product-image',
    ADD_TO_CART: 'add-to-cart-btn',
    ADD_TO_WISHLIST: 'add-to-wishlist-btn',
  },

  // Cart
  CART: {
    CONTAINER: 'cart-container',
    ITEM: 'cart-item',
    ITEM_NAME: 'cart-item-name',
    ITEM_PRICE: 'cart-item-price',
    ITEM_QUANTITY: 'cart-item-quantity',
    SUBTOTAL: 'cart-subtotal',
    TAX: 'cart-tax',
    SHIPPING: 'cart-shipping',
    TOTAL: 'cart-total',
    CHECKOUT_BTN: 'checkout-btn',
    REMOVE_BTN: 'remove-item-btn',
  },

  // Auth
  AUTH: {
    LOGIN_FORM: 'login-form',
    SIGNUP_FORM: 'signup-form',
    EMAIL_INPUT: 'email-input',
    PASSWORD_INPUT: 'password-input',
    NAME_INPUT: 'name-input',
    SUBMIT_BTN: 'submit-btn',
    ERROR_MESSAGE: 'error-message',
  },

  // Search
  SEARCH: {
    INPUT: 'search-input',
    RESULTS: 'search-results',
    RESULT_ITEM: 'search-result-item',
    NO_RESULTS: 'no-results',
  },

  // Layout
  LAYOUT: {
    HEADER: 'header',
    FOOTER: 'footer',
    NAV: 'navigation',
    MENU_TOGGLE: 'menu-toggle',
  },

  // Common
  COMMON: {
    MODAL: 'modal',
    MODAL_CLOSE: 'modal-close',
    LOADING: 'loading',
    ERROR: 'error',
    EMPTY_STATE: 'empty-state',
  },
} as const

export type TestId = typeof TEST_IDS
