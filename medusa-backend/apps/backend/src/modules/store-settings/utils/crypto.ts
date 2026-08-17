import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"

function getSecretKey(): Buffer {
  const secret = process.env.JWT_SECRET || process.env.COOKIE_SECRET || "medusa_store_settings_master_secret"
  return crypto.createHash("sha256").update(secret).digest()
}

export function encrypt(text: string): string {
  if (!text) return ""
  try {
    const iv = crypto.randomBytes(12)
    const key = getSecretKey()
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    const authTag = cipher.getAuthTag().toString("hex")
    return `${iv.toString("hex")}:${authTag}:${encrypted}`
  } catch (err) {
    console.error("Encryption error:", err)
    return text
  }
}

export function decrypt(cipherText: string): string {
  if (!cipherText) return ""
  if (!cipherText.includes(":")) return cipherText // Unencrypted legacy fallback
  try {
    const parts = cipherText.split(":")
    if (parts.length !== 3) return cipherText
    const [ivHex, authTagHex, encryptedText] = parts
    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")
    const key = getSecretKey()
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (err) {
    console.error("Decryption error:", err)
    return cipherText
  }
}

export function maskSecret(secret: string): string {
  if (!secret) return ""
  if (secret.startsWith("••••••••")) return secret // Already masked
  if (secret.length <= 8) {
    return "••••••••"
  }
  const prefix = secret.slice(0, 4)
  const suffix = secret.slice(-4)
  return `${prefix}••••••••${suffix}`
}

export function isMasked(value: string): boolean {
  return typeof value === "string" && value.includes("••••••••")
}
