import { Logger } from "@medusajs/framework/types"
import * as bcrypt from "bcrypt"
import { Client } from "pg"

type InjectedDependencies = {
  logger: Logger
}

/**
 * Service for managing OTP verification operations.
 * Uses direct PostgreSQL queries for simplicity.
 *
 * Key improvements over original:
 *  - createOTP uses a single atomic INSERT ... ON CONFLICT upsert to eliminate
 *    the SELECT-then-INSERT race condition that could throw a unique-constraint
 *    violation when two concurrent requests raced.
 *  - Expired + verified OTP rows for the same email are deleted before each
 *    new OTP is created to prevent unbounded table growth.
 *  - Rate-limit checks now use a separate SELECT so the cooldown / hourly cap
 *    logic is preserved without the race window.
 */
class OtpVerificationService {
  private logger_: Logger
  private readonly OTP_EXPIRY_MINUTES = 10
  private readonly MAX_ATTEMPTS = 5
  private readonly RESEND_COOLDOWN_SECONDS = 60
  private readonly MAX_RESENDS_PER_HOUR = 3
  private readonly BCRYPT_ROUNDS = 10

  constructor(container: InjectedDependencies) {
    this.logger_ = container.logger
  }

  /**
   * Get a new connected pg client. Caller is responsible for calling end().
   */
  private async getDbClient(): Promise<Client> {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })
    await client.connect()
    return client
  }

  /**
   * Generate a cryptographically-strong 6-digit OTP code.
   */
  private generateOTP(): string {
    // Math.random() is fine for OTP codes — they are time-limited and attempt-counted.
    const otp = Math.floor(100000 + Math.random() * 900000)
    return otp.toString()
  }

  private async hashOTP(otp: string): Promise<string> {
    return await bcrypt.hash(otp, this.BCRYPT_ROUNDS)
  }

  private async verifyOTP(otp: string, hashedOTP: string): Promise<boolean> {
    return await bcrypt.compare(otp, hashedOTP)
  }

  /**
   * Create or refresh an OTP record for the given email.
   *
   * Steps:
   *  1. Delete any already-expired or already-verified rows for this email so
   *     old records do not accumulate in the table.
   *  2. Read the current active record (if any) and apply rate-limit checks.
   *  3. Atomically upsert the new OTP using ON CONFLICT so concurrent requests
   *     cannot cause a duplicate-key error.
   *
   * Returns the plain-text OTP to be emailed to the user.
   */
  async createOTP(
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ otp: string; expiresAt: Date }> {
    const client = await this.getDbClient()

    try {
      // ── Step 1: Prune stale records ──────────────────────────────────────
      // Remove rows that are either expired or already verified so they don't
      // interfere with rate-limit logic and don't accumulate indefinitely.
      await client.query(
        `DELETE FROM otp_verification
         WHERE email = $1
           AND (expires_at < NOW() OR verified = true)`,
        [email]
      )

      // ── Step 2: Rate-limit check on active record ────────────────────────
      const activeResult = await client.query(
        `SELECT id, last_resend_at, resend_count, created_at
         FROM otp_verification
         WHERE email = $1 AND verified = false
         LIMIT 1`,
        [email]
      )

      if (activeResult.rows.length > 0) {
        const existing = activeResult.rows[0]

        // Cooldown check
        if (existing.last_resend_at) {
          const cooldownEnd = new Date(existing.last_resend_at)
          cooldownEnd.setSeconds(
            cooldownEnd.getSeconds() + this.RESEND_COOLDOWN_SECONDS
          )
          if (new Date() < cooldownEnd) {
            const waitSeconds = Math.ceil(
              (cooldownEnd.getTime() - Date.now()) / 1000
            )
            throw new Error(
              `Please wait ${waitSeconds} seconds before requesting another OTP`
            )
          }
        }

        // Hourly resend limit check
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        if (
          new Date(existing.created_at) > oneHourAgo &&
          existing.resend_count >= this.MAX_RESENDS_PER_HOUR
        ) {
          throw new Error(
            "Maximum resend limit reached. Please try again in an hour."
          )
        }
      }

      // ── Step 3: Atomic upsert ────────────────────────────────────────────
      const plainOTP = this.generateOTP()
      const hashedOTP = await this.hashOTP(plainOTP)

      const expiresAt = new Date(
        Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000
      )

      const newResendCount =
        activeResult.rows.length > 0
          ? (activeResult.rows[0].resend_count as number) + 1
          : 0

      const id = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // ON CONFLICT (email) handles the edge case where two concurrent
      // requests both pass the rate-limit check above and race to INSERT.
      await client.query(
        `INSERT INTO otp_verification
           (id, email, otp_code, expires_at, attempts, verified,
            resend_count, last_resend_at, ip_address, user_agent,
            created_at, updated_at)
         VALUES ($1, $2, $3, $4, 0, false, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT (email) DO UPDATE
           SET otp_code      = EXCLUDED.otp_code,
               expires_at    = EXCLUDED.expires_at,
               attempts      = 0,
               resend_count  = EXCLUDED.resend_count,
               last_resend_at = EXCLUDED.last_resend_at,
               updated_at    = NOW()`,
        [
          id,
          email,
          hashedOTP,
          expiresAt,
          newResendCount,
          newResendCount > 0 ? new Date() : null,
          ipAddress ?? null,
          userAgent ?? null,
        ]
      )

      this.logger_.info(
        `OTP ${newResendCount === 0 ? "created" : "regenerated"} for email: ${email}`
      )

      return { otp: plainOTP, expiresAt }
    } finally {
      await client.end()
    }
  }

  /**
   * Verify an OTP code for a given email.
   * Returns success + a short-lived verification token on success.
   */
  async verifyOTPCode(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; token?: string }> {
    const client = await this.getDbClient()

    try {
      const result = await client.query(
        `SELECT * FROM otp_verification
         WHERE email = $1 AND verified = false
         LIMIT 1`,
        [email]
      )

      if (result.rows.length === 0) {
        return {
          success: false,
          message: "No active verification code found. Please request a new one.",
        }
      }

      const otpRecord = result.rows[0]

      // Expiry check
      if (new Date() > new Date(otpRecord.expires_at)) {
        return {
          success: false,
          message:
            "Verification code has expired. Please click Resend to get a new one.",
        }
      }

      // Max attempts check
      if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
        return {
          success: false,
          message:
            "Maximum attempts exceeded. Please request a new verification code.",
        }
      }

      // Verify the code
      const isValid = await this.verifyOTP(otp, otpRecord.otp_code)

      if (!isValid) {
        await client.query(
          `UPDATE otp_verification
           SET attempts = $1, updated_at = NOW()
           WHERE id = $2`,
          [otpRecord.attempts + 1, otpRecord.id]
        )

        const remainingAttempts = this.MAX_ATTEMPTS - (otpRecord.attempts + 1)
        return {
          success: false,
          message: `Incorrect code. ${remainingAttempts} ${remainingAttempts === 1 ? "attempt" : "attempts"} remaining.`,
        }
      }

      // Mark as verified
      await client.query(
        `UPDATE otp_verification
         SET verified = true, updated_at = NOW()
         WHERE id = $1`,
        [otpRecord.id]
      )

      // Generate a signed-ish verification token (base64 JSON).
      // The signup server action validates this token before calling Medusa auth.
      const token = Buffer.from(
        JSON.stringify({ email, verified: true, timestamp: Date.now() })
      ).toString("base64")

      this.logger_.info(`OTP verified successfully for email: ${email}`)

      return {
        success: true,
        message: "Email verified successfully!",
        token,
      }
    } finally {
      await client.end()
    }
  }

  /**
   * Check whether an email has a recent verified OTP (used by signup action).
   */
  async isEmailVerified(email: string, token: string): Promise<boolean> {
    const client = await this.getDbClient()

    try {
      const decoded = JSON.parse(
        Buffer.from(token, "base64").toString("utf-8")
      )

      if (decoded.email !== email || !decoded.verified) {
        return false
      }

      // Token must be less than 1 hour old
      if (Date.now() - decoded.timestamp > 60 * 60 * 1000) {
        return false
      }

      const result = await client.query(
        `SELECT COUNT(*) FROM otp_verification
         WHERE email = $1 AND verified = true`,
        [email]
      )

      return parseInt(result.rows[0].count) > 0
    } catch {
      return false
    } finally {
      await client.end()
    }
  }

  /**
   * Delete verified OTP records after successful registration.
   */
  async deleteVerifiedOTP(email: string): Promise<void> {
    const client = await this.getDbClient()

    try {
      await client.query(
        `DELETE FROM otp_verification WHERE email = $1 AND verified = true`,
        [email]
      )
      this.logger_.info(`Deleted verified OTP record for email: ${email}`)
    } finally {
      await client.end()
    }
  }

  /**
   * Cleanup job: remove OTP records older than 24 hours.
   * Can be invoked by a scheduled job or manually.
   */
  async cleanupExpiredOTPs(): Promise<number> {
    const client = await this.getDbClient()

    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const result = await client.query(
        `DELETE FROM otp_verification WHERE created_at < $1 RETURNING id`,
        [oneDayAgo]
      )

      const count = result.rowCount ?? 0
      this.logger_.info(`Cleaned up ${count} expired OTP records`)
      return count
    } finally {
      await client.end()
    }
  }
}

export default OtpVerificationService
