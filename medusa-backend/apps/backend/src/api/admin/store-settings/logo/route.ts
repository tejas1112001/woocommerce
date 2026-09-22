import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_SETTINGS_MODULE } from "../../../../modules/store-settings"
import StoreSettingsModuleService from "../../../../modules/store-settings/service"
import fs from "fs"
import path from "path"

const STATIC_DIR = path.resolve(process.cwd(), "static")
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"])
const ALLOWED_MIME_PREFIXES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"]

function getService(req: MedusaRequest): StoreSettingsModuleService {
  try {
    return req.scope.resolve(STORE_SETTINGS_MODULE)
  } catch {
    return new StoreSettingsModuleService()
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = getService(req)
    const logoUrl = await service.getSetting("store.logo_url")
    return res.json({
      logo_url: logoUrl || "",
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to get store logo",
      error: error.message || String(error),
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = getService(req)
    const multerFile = (req as any).file

    let buffer: Buffer | null = null
    let filename = "store-logo.png"

    // ─── 1. Multipart FormData (Primary via multer) ───
    if (multerFile) {
      const originalExt = path.extname(multerFile.originalname || "").toLowerCase()
      const mimeType = (multerFile.mimetype || "").toLowerCase()

      const isValidMime = ALLOWED_MIME_PREFIXES.some((m) => mimeType.startsWith(m))
      const isValidExt = ALLOWED_EXTENSIONS.has(originalExt)

      if (!isValidMime && !isValidExt) {
        return res.status(400).json({
          message: "Invalid image format. Allowed formats: PNG, JPG, JPEG, WebP, SVG.",
        })
      }

      if (multerFile.size > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({
          message: "File size is too large. Please upload an image smaller than 5 MB.",
        })
      }

      buffer = multerFile.buffer
      const ext = originalExt && ALLOWED_EXTENSIONS.has(originalExt)
        ? originalExt
        : mimeType.includes("svg")
        ? ".svg"
        : mimeType.includes("webp")
        ? ".webp"
        : mimeType.includes("jpeg") || mimeType.includes("jpg")
        ? ".jpg"
        : ".png"

      filename = `logo-${Date.now()}${ext}`
    } else {
      // ─── 2. Fallback to JSON / Base64 / URL ───
      const body = req.body as any
      if (!body) {
        return res.status(400).json({ message: "No file or data provided" })
      }

      if (body.dataUrl && typeof body.dataUrl === "string") {
        const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ message: "Invalid base64 image data format" })
        }
        const mimeType = matches[1]
        if (!ALLOWED_MIME_PREFIXES.some((m) => mimeType.toLowerCase().startsWith(m))) {
          return res.status(400).json({
            message: "Invalid image format. Allowed formats: PNG, JPG, JPEG, WebP, SVG.",
          })
        }

        buffer = Buffer.from(matches[2], "base64")
        const ext = mimeType.includes("svg")
          ? ".svg"
          : mimeType.includes("webp")
          ? ".webp"
          : mimeType.includes("jpeg") || mimeType.includes("jpg")
          ? ".jpg"
          : ".png"
        filename = `logo-${Date.now()}${ext}`
      } else if (body.base64 && typeof body.base64 === "string") {
        buffer = Buffer.from(body.base64, "base64")
        const originalExt = path.extname(body.filename || "").toLowerCase()
        const ext = ALLOWED_EXTENSIONS.has(originalExt) ? originalExt : ".png"
        filename = `logo-${Date.now()}${ext}`
      } else if (body.url && typeof body.url === "string") {
        await service.setSetting("store.logo_url", body.url.trim(), false)
        return res.json({
          message: "Store logo updated successfully",
          logo_url: body.url.trim(),
        })
      } else {
        return res.status(400).json({
          message: "Please provide a valid image file",
        })
      }
    }

    if (!buffer) {
      return res.status(400).json({ message: "Failed to process image buffer" })
    }

    // Size validation check
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        message: "File size is too large. Please upload an image smaller than 5 MB.",
      })
    }

    // Ensure static directory exists
    if (!fs.existsSync(STATIC_DIR)) {
      fs.mkdirSync(STATIC_DIR, { recursive: true })
    }

    // Clean up old uploaded logo file if one exists
    try {
      const oldLogoUrl = await service.getSetting("store.logo_url")
      if (oldLogoUrl && oldLogoUrl.includes("/static/logo-")) {
        const oldFilename = path.basename(oldLogoUrl)
        const oldFilePath = path.join(STATIC_DIR, oldFilename)
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath)
        }
      }
    } catch (e) {
      console.warn("Could not remove old logo file:", e)
    }

    // Save new file to static directory
    const targetFilePath = path.join(STATIC_DIR, filename)
    fs.writeFileSync(targetFilePath, buffer)

    // Construct public URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:9000"
    const publicLogoUrl = `${backendUrl.replace(/\/$/, "")}/static/${filename}`

    // Update StoreSettingsModuleService
    await service.setSetting("store.logo_url", publicLogoUrl, false)

    return res.json({
      message: "Store logo uploaded successfully",
      logo_url: publicLogoUrl,
    })
  } catch (error: any) {
    console.error("Error uploading store logo:", error)
    return res.status(500).json({
      message: "Failed to upload store logo due to a server error",
      error: error.message || String(error),
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = getService(req)

    // Remove physical file from static directory if custom uploaded
    try {
      const oldLogoUrl = await service.getSetting("store.logo_url")
      if (oldLogoUrl && oldLogoUrl.includes("/static/logo-")) {
        const oldFilename = path.basename(oldLogoUrl)
        const oldFilePath = path.join(STATIC_DIR, oldFilename)
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath)
        }
      }
    } catch (e) {
      console.warn("Could not delete physical logo file:", e)
    }

    // Reset logo URL in settings
    await service.setSetting("store.logo_url", "", false)

    return res.json({
      message: "Store logo deleted successfully. Default logo will be used.",
      logo_url: "",
    })
  } catch (error: any) {
    console.error("Error deleting store logo:", error)
    return res.status(500).json({
      message: "Failed to delete store logo",
      error: error.message || String(error),
    })
  }
}
