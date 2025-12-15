/**
 * Web Crypto API Utilities
 * localStorage 암호화를 위한 유틸리티
 */

const ENCRYPTION_KEY_NAME = 'app-encryption-key'

/**
 * 암호화 키 생성 또는 가져오기
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  // 기존 키가 있는지 확인
  const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME)
  
  if (storedKey) {
    try {
      const keyData = JSON.parse(storedKey)
      return await crypto.subtle.importKey(
        'jwk',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
    } catch {
      // 키 로드 실패 시 새로 생성
    }
  }

  // 새 키 생성
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  // 세션에 저장 (페이지 새로고침 시까지 유지)
  const exportedKey = await crypto.subtle.exportKey('jwk', key)
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey))

  return key
}

/**
 * 데이터 암호화
 */
export async function encryptData(data: string): Promise<string> {
  try {
    const key = await getEncryptionKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encodedData = new TextEncoder().encode(data)

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    )

    // IV와 암호화된 데이터를 합쳐서 base64로 인코딩
    const combined = new Uint8Array(iv.length + encryptedData.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)

    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption failed:', error)
    // Fallback: 암호화 실패 시 원본 반환 (개발 중에만)
    return data
  }
}

/**
 * 데이터 복호화
 */
export async function decryptData(encryptedData: string): Promise<string | null> {
  try {
    const key = await getEncryptionKey()
    
    // base64 디코딩
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
    
    // IV와 데이터 분리
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    )

    return new TextDecoder().decode(decryptedData)
  } catch (error) {
    console.error('Decryption failed:', error)
    // 복호화 실패 시 null 반환 (기존 평문 데이터일 수 있음)
    return null
  }
}

/**
 * 안전한 localStorage 저장
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    const encrypted = await encryptData(value)
    localStorage.setItem(key, encrypted)
  } catch (error) {
    console.error('Failed to store secure item:', error)
    throw error
  }
}

/**
 * 안전한 localStorage 읽기
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null

    const decrypted = await decryptData(encrypted)
    
    // 복호화 실패 시 평문으로 시도 (하위 호환성)
    if (!decrypted) {
      return encrypted
    }

    return decrypted
  } catch (error) {
    console.error('Failed to retrieve secure item:', error)
    return null
  }
}

/**
 * 안전한 localStorage 삭제
 */
export function removeSecureItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove secure item:', error)
  }
}

