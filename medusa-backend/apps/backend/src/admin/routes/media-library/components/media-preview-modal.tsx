import React, { useState } from "react"
import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"

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

interface MediaPreviewModalProps {
  item: MediaItem | null
  onClose: () => void
  onDeleteRequest: (item: MediaItem) => void
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  item,
  onClose,
  onDeleteRequest,
}) => {
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formattedDate = new Date(item.createdAt).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-ui-bg-base border border-ui-border-base rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base bg-ui-bg-subtle">
          <div className="flex items-center gap-3 truncate">
            <span className="text-xl">🖼️</span>
            <div className="truncate">
              <Heading level="h2" className="text-base font-bold text-ui-fg-base truncate">
                {item.originalName || item.filename}
              </Heading>
              <Text className="text-xs text-ui-fg-subtle truncate font-mono">
                {item.filename}
              </Text>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ui-fg-subtle hover:text-ui-fg-base p-1.5 rounded-lg hover:bg-ui-bg-base transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual Image View */}
          <div className="w-full h-80 rounded-xl border border-ui-border-base bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-ui-bg-subtle flex items-center justify-center p-4 relative overflow-hidden">
            <img
              src={item.url}
              alt={item.filename}
              className="max-h-full max-w-full object-contain filter drop-shadow-md rounded"
            />
          </div>

          {/* Usage Status & Badges */}
          <div className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ui-fg-subtle">
                Usage & Reference Status
              </span>
              {item.isInUse ? (
                <Badge color="green" size="small" className="font-semibold">
                  ● In Active Use ({item.usages.length} reference{item.usages.length > 1 ? "s" : ""})
                </Badge>
              ) : (
                <Badge color="orange" size="small" className="font-semibold">
                  ● Unused / Orphan File (Safe to delete)
                </Badge>
              )}
            </div>

            {item.isInUse ? (
              <div className="space-y-2 pt-1">
                {item.usages.map((usage, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-ui-bg-base border border-ui-border-base text-xs"
                  >
                    <span className="mt-0.5">
                      {usage.type === "store_logo"
                        ? "🏷️"
                        : usage.type === "product_thumbnail"
                        ? "⭐"
                        : "🛍️"}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-ui-fg-base">{usage.name}</p>
                      {usage.detail && (
                        <p className="text-ui-fg-subtle text-[11px] mt-0.5">{usage.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ui-fg-muted">
                This image is not currently referenced by any active product thumbnail, product gallery, or store logo. It can be safely deleted to free up disk space.
              </p>
            )}
          </div>

          {/* File Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-ui-bg-subtle border border-ui-border-base">
              <span className="text-ui-fg-subtle block text-[11px]">File Size</span>
              <span className="font-semibold text-ui-fg-base mt-0.5 block">{item.formattedSize}</span>
            </div>

            <div className="p-3 rounded-lg bg-ui-bg-subtle border border-ui-border-base">
              <span className="text-ui-fg-subtle block text-[11px]">MIME Type</span>
              <span className="font-semibold text-ui-fg-base mt-0.5 block font-mono">{item.mimeType}</span>
            </div>

            <div className="p-3 rounded-lg bg-ui-bg-subtle border border-ui-border-base col-span-2 sm:col-span-1">
              <span className="text-ui-fg-subtle block text-[11px]">Uploaded / Modified</span>
              <span className="font-semibold text-ui-fg-base mt-0.5 block">{formattedDate}</span>
            </div>
          </div>

          {/* Direct Public URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ui-fg-subtle">Direct Public URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={item.url}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-ui-bg-subtle border border-ui-border-base text-ui-fg-base select-all focus:outline-none"
              />
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-ui-border-base bg-ui-bg-subtle">
          <Button
            size="small"
            variant="danger"
            type="button"
            onClick={() => {
              onClose()
              onDeleteRequest(item)
            }}
          >
            🗑️ Delete Image
          </Button>

          <Button size="small" variant="secondary" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
