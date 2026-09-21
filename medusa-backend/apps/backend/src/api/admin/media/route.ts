import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { STORE_SETTINGS_MODULE } from "../../../modules/store-settings"
import StoreSettingsModuleService from "../../../modules/store-settings/service"
import fs from "fs"
import path from "path"

const STATIC_DIR = path.resolve(process.cwd(), "static")
const ALLOWED_IMAGE_EXTS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".ico",
  ".bmp",
  ".avif",
])

const PROTECTED_FILENAMES = new Set([
  "store-settings-store.json",
  ".gitkeep",
  ".gitignore",
])

function isImageFile(filename: string): boolean {
  if (PROTECTED_FILENAMES.has(filename.toLowerCase())) return false
  if (filename.startsWith("private-") && filename.endsWith(".csv")) return false
  const ext = path.extname(filename).toLowerCase()
  return ALLOWED_IMAGE_EXTS.has(ext)
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  switch (ext) {
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".webp":
      return "image/webp"
    case ".svg":
      return "image/svg+xml"
    case ".gif":
      return "image/gif"
    case ".ico":
      return "image/x-icon"
    case ".bmp":
      return "image/bmp"
    case ".avif":
      return "image/avif"
    default:
      return "application/octet-stream"
  }
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export interface MediaUsage {
  type: "product_thumbnail" | "product_gallery" | "store_logo"
  id?: string
  name: string
  detail?: string
}

export interface MediaItem {
  id: string
  filename: string
  originalName: string
  url: string
  sizeBytes: number
  formattedSize: string
  mimeType: string
  createdAt: string
  isInUse: boolean
  usages: MediaUsage[]
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    if (!fs.existsSync(STATIC_DIR)) {
      fs.mkdirSync(STATIC_DIR, { recursive: true })
    }

    // 1. Fetch all products to inspect their images and thumbnails
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    let products: any[] = []
    try {
      const result = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle", "thumbnail", "images.*"],
      })
      products = result.data || []
    } catch (e) {
      console.warn("Could not query products for media usage detection:", e)
    }

    // 2. Fetch active store logo from store-settings
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
      console.warn("Could not query store settings for logo URL:", e)
    }

    // 3. Scan physical static directory
    const dirEntries = fs.readdirSync(STATIC_DIR, { withFileTypes: true })
    const backendUrl = (process.env.BACKEND_URL || "http://localhost:9000").replace(/\/$/, "")

    const mediaList: MediaItem[] = []
    let totalSizeBytes = 0
    let inUseCount = 0
    let unusedCount = 0

    for (const entry of dirEntries) {
      if (!entry.isFile() || !isImageFile(entry.name)) {
        continue
      }

      const filename = entry.name
      const filePath = path.join(STATIC_DIR, filename)

      let stat: fs.Stats
      try {
        stat = fs.statSync(filePath)
      } catch {
        continue
      }

      const sizeBytes = stat.size
      totalSizeBytes += sizeBytes

      // Extract original name without timestamp prefix if present
      const matchPrefix = filename.match(/^\d+-(.+)$/)
      const originalName = matchPrefix ? matchPrefix[1] : filename

      const publicUrl = `${backendUrl}/static/${encodeURIComponent(filename)}`
      const rawPublicUrl = `${backendUrl}/static/${filename}`

      // Check usages across all products
      const usages: MediaUsage[] = []

      // A) Check store logo
      if (storeLogoUrl) {
        const decodedLogoUrl = decodeURIComponent(storeLogoUrl)
        if (
          decodedLogoUrl.includes(filename) ||
          storeLogoUrl.includes(filename) ||
          path.basename(decodedLogoUrl) === filename
        ) {
          usages.push({
            type: "store_logo",
            name: "Storefront Logo",
            detail: "Active brand logo used in storefront header, mobile menu, and invoices",
          })
        }
      }

      // B) Check products
      for (const p of products) {
        const productTitle = p.title || p.handle || p.id

        // Check thumbnail
        if (p.thumbnail) {
          const decodedThumbnail = decodeURIComponent(p.thumbnail)
          if (
            decodedThumbnail.includes(filename) ||
            p.thumbnail.includes(filename) ||
            path.basename(decodedThumbnail) === filename
          ) {
            usages.push({
              type: "product_thumbnail",
              id: p.id,
              name: `Product Thumbnail: ${productTitle}`,
              detail: `Used as the primary thumbnail for "${productTitle}"`,
            })
          }
        }

        // Check gallery images
        if (Array.isArray(p.images)) {
          for (const img of p.images) {
            if (img && img.url) {
              const decodedImgUrl = decodeURIComponent(img.url)
              if (
                decodedImgUrl.includes(filename) ||
                img.url.includes(filename) ||
                path.basename(decodedImgUrl) === filename
              ) {
                // Avoid duplicate if already matched thumbnail with same name
                const alreadyListed = usages.some(
                  (u) => u.id === p.id && u.type === "product_gallery"
                )
                if (!alreadyListed) {
                  usages.push({
                    type: "product_gallery",
                    id: p.id,
                    name: `Product Media: ${productTitle}`,
                    detail: `Used in the image gallery for "${productTitle}"`,
                  })
                }
              }
            }
          }
        }
      }

      const isInUse = usages.length > 0
      if (isInUse) {
        inUseCount++
      } else {
        unusedCount++
      }

      mediaList.push({
        id: filename,
        filename,
        originalName,
        url: rawPublicUrl,
        sizeBytes,
        formattedSize: formatBytes(sizeBytes),
        mimeType: getMimeType(filename),
        createdAt: stat.mtime.toISOString(),
        isInUse,
        usages,
      })
    }

    // Sort newest first by default
    mediaList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return res.json({
      media: mediaList,
      summary: {
        totalFiles: mediaList.length,
        totalSizeBytes,
        formattedTotalSize: formatBytes(totalSizeBytes),
        inUseCount,
        unusedCount,
      },
    })
  } catch (error: any) {
    console.error("Error in GET /admin/media:", error)
    return res.status(500).json({
      message: "Failed to fetch media library items",
      error: error.message || String(error),
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const multerFile = (req as any).file
    if (!multerFile) {
      return res.status(400).json({ message: "No file uploaded. Please select an image file." })
    }

    const originalName = multerFile.originalname || "image.png"
    const ext = path.extname(originalName).toLowerCase()

    if (!ALLOWED_IMAGE_EXTS.has(ext)) {
      return res.status(400).json({
        message: `Invalid file format (${ext}). Allowed formats: PNG, JPG, JPEG, WebP, SVG, GIF, AVIF.`,
      })
    }

    if (!fs.existsSync(STATIC_DIR)) {
      fs.mkdirSync(STATIC_DIR, { recursive: true })
    }

    // Sanitize filename and prepend unique timestamp
    const cleanBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60)
    const filename = `${Date.now()}-${cleanBaseName || "upload"}${ext}`
    const targetPath = path.join(STATIC_DIR, filename)

    fs.writeFileSync(targetPath, multerFile.buffer)

    const backendUrl = (process.env.BACKEND_URL || "http://localhost:9000").replace(/\/$/, "")
    const publicUrl = `${backendUrl}/static/${filename}`
    const sizeBytes = multerFile.size || multerFile.buffer.length

    return res.json({
      message: "Image uploaded successfully to Media Library",
      file: {
        id: filename,
        filename,
        originalName,
        url: publicUrl,
        sizeBytes,
        formattedSize: formatBytes(sizeBytes),
        mimeType: multerFile.mimetype || getMimeType(filename),
        createdAt: new Date().toISOString(),
        isInUse: false,
        usages: [],
      },
    })
  } catch (error: any) {
    console.error("Error in POST /admin/media:", error)
    return res.status(500).json({
      message: "Failed to upload media file",
      error: error.message || String(error),
    })
  }
}
