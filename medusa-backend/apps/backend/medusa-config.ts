import {
  loadEnv,
  defineConfig,
  Modules,
  ContainerRegistrationKeys,
} from '@medusajs/framework/utils'
import { existsSync } from 'fs'
import { resolve } from 'path'
import dotenv from 'dotenv'

const nodeEnv = process.env.NODE_ENV || 'development'
loadEnv(nodeEnv, process.cwd())

const localEnvPath = resolve(process.cwd(), '.env.local')
if (nodeEnv !== 'production' && existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true })
}

const productionEnvPath = resolve(process.cwd(), '.env.production')
if (nodeEnv === 'production' && existsSync(productionEnvPath)) {
  dotenv.config({ path: productionEnvPath, override: true })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      pool: {
        min: 2,
        max: 10,
      },
    },
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  plugins: [],
  modules: [
    {
      resolve: "./src/modules/store-settings",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              backend_url: `${process.env.BACKEND_URL}/static`,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      dependencies: [Modules.PAYMENT, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          {
            resolve:
              "medusa-plugin-razorpay-v2/providers/payment-razorpay/src",
            id: "razorpay",
            options: {
              key_id:
                process.env.RAZORPAY_TEST_KEY_ID ?? process.env.RAZORPAY_ID,
              key_secret:
                process.env.RAZORPAY_TEST_KEY_SECRET ??
                process.env.RAZORPAY_SECRET,
              razorpay_account:
                process.env.RAZORPAY_TEST_ACCOUNT || process.env.RAZORPAY_ACCOUNT || undefined,
              automatic_expiry_period:
                process.env.RAZORPAY_TEST_AUTO_EXPIRY_PERIOD ??
                process.env.RAZORPAY_AUTO_EXPIRY_PERIOD,
              manual_expiry_period:
                process.env.RAZORPAY_TEST_MANUAL_EXPIRY_PERIOD ??
                process.env.RAZORPAY_MANUAL_EXPIRY_PERIOD,
              webhook_secret:
                process.env.RAZORPAY_TEST_WEBHOOK_SECRET ??
                process.env.RAZORPAY_WEBHOOK_SECRET,
              // Enable automatic payment capture
              // When true, payments are automatically captured after authorization
              // This removes the need for manual "Capture Payment" in admin
              auto_capture: true,
            },
          },
        ],
      },
    },
  ],
})
// Reload trigger

