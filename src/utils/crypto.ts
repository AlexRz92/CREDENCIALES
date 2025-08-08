import CryptoJS from 'crypto-js'

export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128/8).toString()
}

export function hashPassword(password: string, salt?: string): { hashedPassword: string; salt: string } {
  const finalSalt = salt || generateSalt()
  
  const hashedPassword = CryptoJS.PBKDF2(password, finalSalt, {
    keySize: 256/32,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
  }).toString()
  
  return {
    hashedPassword,
    salt: finalSalt
  }
}