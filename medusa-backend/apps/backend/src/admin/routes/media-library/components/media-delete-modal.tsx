import React, { useState } from "react"
import { Container, Heading, Text, Button, Checkbox, Label } from "@medusajs/ui"
import { MediaItem } from "./media-preview-modal"

interface MediaDeleteModalProps {
  itemsToDelete: MediaItem[]
  onClose: () => void
  onConfirmDelete: (filenames: string[], force: boolean) => Promise<void>
  isDeleting: boolean
}

export const MediaDeleteModal: React.FC<MediaDeleteModalProps> = ({
  itemsToDelete,
  onClose,
  onConfirmDelete,
  isDeleting,
}) => {
  const [forceAcknowledge, setForceAcknowledge] = useState<boolean>(false)

  if (itemsToDelete.length === 0) return null

  const inUseItems = itemsToDelete.filter((item) => item.isInUse)
  const hasInUseItems = inUseItems.length > 0
  const isSingle = itemsToDelete.length === 1
  const singleItem = itemsToDelete[0]

  const handleDelete = async () => {
    const filenames = itemsToDelete.map((i) => i.filename)
    await onConfirmDelete(filenames, forceAcknowledge)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-ui-bg-base border border-ui-border-base rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base bg-rose-950/20">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚠️</span>
            <Heading level="h2" className="text-base font-bold text-rose-200">
              {isSingle ? "Delete Media File" : `Delete ${itemsToDelete.length} Media Files`}
            </Heading>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-ui-fg-subtle hover:text-ui-fg-base p-1.5 rounded-lg hover:bg-ui-bg-base transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isSingle ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ui-bg-subtle border border-ui-border-base">
              <div className="h-16 w-16 rounded-lg bg-ui-bg-base border border-ui-border-base flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={singleItem.url}
                  alt={singleItem.filename}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="truncate flex-1">
                <p className="font-semibold text-xs text-ui-fg-base truncate">
                  {singleItem.originalName}
                </p>
                <p className="text-[11px] text-ui-fg-subtle font-mono truncate">{singleItem.filename}</p>
                <p className="text-[11px] text-ui-fg-muted mt-0.5">{singleItem.formattedSize}</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-ui-fg-subtle">
              You are about to permanently delete{" "}
              <strong className="text-ui-fg-base">{itemsToDelete.length} files</strong> from the server disk.
            </div>
          )}

          {/* IN USE CRITICAL WARNING */}
          {hasInUseItems ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-lg text-rose-400 mt-0.5">🚨</span>
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-bold text-rose-200">
                    Warning: {inUseItems.length} image{inUseItems.length > 1 ? "s are" : " is"} currently in active use!
                  </p>
                  <p className="text-[11px] text-rose-300/80 leading-relaxed">
                    Deleting {inUseItems.length > 1 ? "these images" : "this image"} will break product thumbnails, storefront galleries, or the store logo where it is currently displayed.
                  </p>
                </div>
              </div>

              {/* Usages Breakdown */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                {inUseItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-rose-950/60 border border-rose-900 text-[11px] space-y-1"
                  >
                    <p className="font-semibold text-rose-100 truncate">{item.originalName}</p>
                    <ul className="list-disc list-inside text-rose-300/80 text-[10px] space-y-0.5 pl-1">
                      {item.usages.map((u, uIdx) => (
                        <li key={uIdx} className="truncate">
                          {u.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Force confirmation checkbox */}
              <div className="pt-2 border-t border-rose-800/60 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="force-delete-checkbox"
                  checked={forceAcknowledge}
                  onChange={(e) => setForceAcknowledge(e.target.checked)}
                  className="mt-0.5 rounded border-rose-700 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <label
                  htmlFor="force-delete-checkbox"
                  className="text-xs font-medium text-rose-200 cursor-pointer select-none"
                >
                  I understand this will cause broken images on active products or store branding. Force delete anyway.
                </label>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
              <span>🛡️</span>
              <p>
                All selected files are <strong>unused orphans</strong>. Deleting them is 100% safe and will not affect any active products or store settings.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ui-border-base bg-ui-bg-subtle">
          <Button
            size="small"
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            size="small"
            variant="danger"
            type="button"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={hasInUseItems && !forceAcknowledge}
          >
            {hasInUseItems && !forceAcknowledge
              ? "Acknowledge Warning First"
              : isSingle
              ? "Permanently Delete"
              : `Delete (${itemsToDelete.length}) Files`}
          </Button>
        </div>
      </div>
    </div>
  )
}
