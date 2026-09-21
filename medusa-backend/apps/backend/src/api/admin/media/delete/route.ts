import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { STORE_SETTINGS_MODULE } from "../../../../modules/store-settings"
import StoreSettingsModuleService from "../../../../modules/store-settings/service"
import fs from "fs"
import path from "path"

const STATIC_DIR = path.resolve(process.cwd(), "static")

const PROTECTED_FILENAMES = new Set([
  "store-settings-store.json",
  ".gitkeep",
  ".gitignore",
])

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as {
      filenames?: string[]
      filename?: string
      force?: boolean
    }

    const rawList = body.filenames || (body.filename ? [body.filename] : [])
    const force = Boolean(body.force)

    if (!Array.isArray(rawList) || rawList.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one filename to delete.",
      })
    }

    // 1. Sanitize input filenames
    const filenamesToDelete: string[] = []
    for (const item of rawList) {
      if (typeof item === "string" && item.trim()) {
        const base = path.basename(item.trim())
        if (PROTECTED_FILENAMES.has(base.toLowerCase()) || base.startsWith("private-")) {
          return res.status(400).json({
            message: `File "${base}" is a protected system file and cannot be deleted.`,
          })
        }
        filenamesToDelete.push(base)
      }
    }

    if (filenamesToDelete.length === 0) {
      return res.status(400).json({ message: "No valid filenames provided." })
    }

    // 2. Query products & store settings to check usages if force is not set
    let blockedFiles: Array<{ filename: string; usages: string[] }> = []

    if (!force) {
      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
      let products: any[] = []
      try {
        const result = await query.graph({
          entity: "product",
          fields: ["id", "title", "handle", "thumbnail", "images.*"],
        })
        products = result.data || []
      } catch (e) {
        console.warn("Could not query products during media deletion check:", e)
      }

      let storeLogoUrl = ""
      try {
        let settingsService: StoreSettingsModuleService
        try {
          settingsService = req.scope.resolve(STORE_SETTINGS_MODULE)
        } catch {
          settingsService = new StoreSettingsModuleService()
        }
        storeLogoUrl = (await settingsService.getSetting("store.logo_url")) || ""
      } catch (e) {
        console.warn("Could not query store settings during media deletion check:", e)
      }

      for (const filename of filenamesToDelete) {
        const usages: string[] = []

        // Check store logo
        if (storeLogoUrl) {
          const decodedLogoUrl = decodeURIComponent(storeLogoUrl)
          if (
            decodedLogoUrl.includes(filename) ||
            storeLogoUrl.includes(filename) ||
            path.basename(decodedLogoUrl) === filename
          ) {
            usages.push("Active Storefront Logo")
          }
        }

        // Check products
        for (const p of products) {
          const productTitle = p.title || p.handle || p.id
          if (p.thumbnail) {
            const decodedThumb = decodeURIComponent(p.thumbnail)
            if (
              decodedThumb.includes(filename) ||
              p.thumbnail.includes(filename) ||
              path.basename(decodedThumb) === filename
            ) {
              usages.push(`Thumbnail for "${productTitle}"`)
            }
          }

          if (Array.isArray(p.images)) {
            for (const img of p.images) {
              if (img && img.url) {
                const decodedImg = decodeURIComponent(img.url)
                if (
                  decodedImg.includes(filename) ||
                  img.url.includes(filename) ||
                  path.basename(decodedImg) === filename
                ) {
                  usages.push(`Gallery image for "${productTitle}"`)
                }
              }
            }
          }
        }

        if (usages.length > 0) {
          blockedFiles.push({ filename, usages })
        }
      }
    }

    // If any file is in use and force is false, block deletion with a detailed warning
    if (blockedFiles.length > 0) {
      return res.status(400).json({
        message: "Cannot delete media: Some images are currently in active use.",
        blocked: blockedFiles,
        requireForce: true,
      })
    }

    // 3. Perform safe deletion
    const deleted: string[] = []
    const failed: Array<{ filename: string; reason: string }> = []

    for (const filename of filenamesToDelete) {
      const filePath = path.join(STATIC_DIR, filename)

      // Ensure no path traversal outside STATIC_DIR
      if (!filePath.startsWith(STATIC_DIR)) {
        failed.push({ filename, reason: "Invalid path outside static folder" })
        continue
      }

      if (!fs.existsSync(filePath)) {
        // Already gone or not on disk
        deleted.push(filename)
        continue
      }

      try {
        fs.unlinkSync(filePath)
        deleted.push(filename)
      } catch (err: any) {
        console.error(`Failed to unlink file ${filename}:`, err)
        failed.push({ filename, reason: err.message || "Failed to remove from disk" })
      }
    }

    return res.json({
      message: `Successfully deleted ${deleted.length} file(s).`,
      deleted,
      failed,
      count: deleted.length,
    })
  } catch (error: any) {
    console.error("Error in POST /admin/media/delete:", error)
    return res.status(500).json({
      message: "Failed to delete media files",
      error: error.message || String(error),
    })
  }
}
