/**
 * Auth Feature Messages
 */

// @ts-ignore - Paraglide generated file
import * as m from '@/app/i18n/paraglide/messages.js'

export const authMessages = {
  invalidCredentials: m.auth_invalid_credentials,
  emailExists: m.auth_email_exists,
  loginSuccess: m.auth_login_success,
  registerSuccess: m.auth_register_success,
  verifyEmail: m.auth_verify_email,
} as const

export type AuthMessageKey = keyof typeof authMessages

