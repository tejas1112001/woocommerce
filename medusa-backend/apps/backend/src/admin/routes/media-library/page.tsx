import React, { useState, useEffect, useRef } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Badge } from "@medusajs/ui"
import { MediaPreviewModal, MediaItem } from "./components/media-preview-modal"
import { MediaDeleteModal } from "./components/media-delete-modal"

// Custom Media Library Icon for Admin Sidebar
const MediaLibraryIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

type FilterTab = "all" | "unused" | "in_use"
type SortOption = "newest" | "oldest" | "largest" | "smallest"

const MediaLibraryPage = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [summary, setSummary] = useState<{
    totalFiles: number
    totalSizeBytes: number
    formattedTotalSize: string
    inUseCount: number
    unusedCount: number
  }>({
    totalFiles: 0,
    totalSizeBytes: 0,
    formattedTotalSize: "0 B",
    inUseCount: 0,
    unusedCount: 0,
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterTab, setFilterTab] = useState<FilterTab>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  // Selection states for bulk actions
  const [selectedFilenames, setSelectedFilenames] = useState<Set<string>>(new Set())

  // Modal states
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [itemsToDelete, setItemsToDelete] = useState<MediaItem[]>([])
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Upload states
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadFeedback, setUploadFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/admin/media", {
        credentials: "include",
        headers: { Accept: "application/json" },
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      setMediaList(data.media || [])
      setSummary(
        data.summary || {
          totalFiles: 0,
          totalSizeBytes: 0,
          formattedTotalSize: "0 B",
          inUseCount: 0,
          unusedCount: 0,
        }
      )
      // Reset selections on fresh fetch
      setSelectedFilenames(new Set())
    } catch (err: any) {
      setError(err.message || "Failed to load media library")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFeedback(null)
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/admin/media", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload file")
      }

      setUploadFeedback({
        type: "success",
        text: `Image "${file.name}" uploaded successfully!`,
      })
      await fetchMedia()
    } catch (err: any) {
      setUploadFeedback({
        type: "error",
        text: err.message || "Upload failed",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Delete Action Handler
  const handleConfirmDelete = async (filenames: string[], force: boolean) => {
    setIsDeleting(true)
    try {
      const res = await fetch("/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filenames, force }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete files")
      }

      setItemsToDelete([])
      await fetchMedia()
    } catch (err: any) {
      alert(`Deletion error: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter & Sort Logic
  const filteredMedia = mediaList
    .filter((item) => {
      // Search filter
      const matchesSearch =
        item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.filename.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // Tab filter
      if (filterTab === "unused") return !item.isInUse
      if (filterTab === "in_use") return item.isInUse
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "largest") return b.sizeBytes - a.sizeBytes
      if (sortBy === "smallest") return a.sizeBytes - b.sizeBytes
      return 0
    })

  // Bulk Selection Helpers
  const toggleSelect = (filename: string) => {
    const next = new Set(selectedFilenames)
    if (next.has(filename)) {
      next.delete(filename)
    } else {
      next.add(filename)
    }
    setSelectedFilenames(next)
  }

  const selectAllUnused = () => {
    const unusedFilenames = mediaList.filter((m) => !m.isInUse).map((m) => m.filename)
    setSelectedFilenames(new Set(unusedFilenames))
  }

  const clearSelection = () => {
    setSelectedFilenames(new Set())
  }

  const triggerBulkDelete = () => {
    const items = mediaList.filter((m) => selectedFilenames.has(m.filename))
    if (items.length > 0) {
      setItemsToDelete(items)
    }
  }

  return (
    <div className="w-full max-w-none px-4 sm:px-8 py-6 space-y-6 min-h-screen bg-ui-bg-base text-ui-fg-base">
      {/* ─── 1. TOP HEADER & UPLOAD BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ui-border-base pb-5">
        <div>
          <Heading level="h1" className="text-2xl font-bold text-ui-fg-base flex items-center gap-2.5">
            <MediaLibraryIcon /> Media Library
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            Browse, inspect, upload, and safely manage all images stored in Medusa File Module.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,image/avif"
            onChange={handleFileUpload}
            className="hidden"
            id="media-library-upload-input"
          />
          <Button
            size="small"
            variant="primary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
          >
            📤 Upload Image
          </Button>

          <Button
            size="small"
            variant="secondary"
            type="button"
            onClick={fetchMedia}
            isLoading={isLoading}
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Upload Feedback Toast / Alert */}
      {uploadFeedback && (
        <div
          className={`p-3.5 rounded-xl text-sm font-medium flex items-center justify-between shadow-xs ${
            uploadFeedback.type === "success"
              ? "bg-emerald-950/60 border border-emerald-700 text-emerald-200"
              : "bg-rose-950/60 border border-rose-700 text-rose-200"
          }`}
        >
          <span>{uploadFeedback.text}</span>
          <button
            onClick={() => setUploadFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── 2. STATS SUMMARY CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Images */}
        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex items-center justify-center text-2xl shadow-xs">
            📁
          </div>
          <div>
            <Text className="text-xs text-ui-fg-subtle font-medium">Total Stored Files</Text>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-ui-fg-base">{summary.totalFiles}</span>
              <span className="text-xs text-ui-fg-muted">({summary.formattedTotalSize})</span>
            </div>
          </div>
        </Container>

        {/* In-Use Images */}
        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-2xl shadow-xs">
            🟢
          </div>
          <div>
            <Text className="text-xs text-ui-fg-subtle font-medium">Active In-Use Images</Text>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-300">{summary.inUseCount}</span>
              <span className="text-xs text-ui-fg-muted">linked to products/store</span>
            </div>
          </div>
        </Container>

        {/* Unused / Orphan Images */}
        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-center text-2xl shadow-xs">
            🟡
          </div>
          <div>
            <Text className="text-xs text-ui-fg-subtle font-medium">Unused / Orphan Files</Text>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-amber-300">{summary.unusedCount}</span>
              <span className="text-xs text-ui-fg-muted">safe to delete</span>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── 3. SEARCH, FILTERS & BULK ACTIONS BAR ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base">
        {/* Left: Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === "all"
                ? "bg-ui-bg-base text-ui-fg-base border border-ui-border-base shadow-xs"
                : "text-ui-fg-subtle hover:text-ui-fg-base"
            }`}
          >
            All ({summary.totalFiles})
          </button>

          <button
            onClick={() => setFilterTab("unused")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === "unused"
                ? "bg-amber-950/60 text-amber-200 border border-amber-800 shadow-xs"
                : "text-amber-400/80 hover:text-amber-200"
            }`}
          >
            🟡 Unused / Safe ({summary.unusedCount})
          </button>

          <button
            onClick={() => setFilterTab("in_use")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === "in_use"
                ? "bg-emerald-950/60 text-emerald-200 border border-emerald-800 shadow-xs"
                : "text-emerald-400/80 hover:text-emerald-200"
            }`}
          >
            🟢 In-Use ({summary.inUseCount})
          </button>
        </div>

        {/* Right: Search & Sort */}
        <div className="flex items-center gap-3">
          <Input
            type="search"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-56 h-8 text-xs"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-8 px-2.5 rounded-md bg-ui-bg-base border border-ui-border-base text-ui-fg-base text-xs focus:outline-none shrink-0"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest Size</option>
            <option value="smallest">Smallest Size</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Controls Bar (When items are selected or unused exist) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          {summary.unusedCount > 0 && (
            <Button
              size="small"
              variant="secondary"
              type="button"
              onClick={selectAllUnused}
              className="text-xs"
            >
              Select All Unused ({summary.unusedCount})
            </Button>
          )}

          {selectedFilenames.size > 0 && (
            <Button
              size="small"
              variant="transparent"
              type="button"
              onClick={clearSelection}
              className="text-xs text-ui-fg-subtle hover:text-ui-fg-base"
            >
              Clear Selection ({selectedFilenames.size})
            </Button>
          )}
        </div>

        {selectedFilenames.size > 0 && (
          <Button
            size="small"
            variant="danger"
            type="button"
            onClick={triggerBulkDelete}
            className="text-xs flex items-center gap-1.5"
          >
            🗑️ Delete Selected ({selectedFilenames.size})
          </Button>
        )}
      </div>

      {/* ─── 4. MEDIA GALLERY GRID ─── */}
      {isLoading ? (
        <Container className="p-12 text-center text-ui-fg-subtle text-sm animate-pulse">
          Loading media assets and checking references...
        </Container>
      ) : error ? (
        <Container className="p-4 bg-rose-950/50 border border-rose-800 text-rose-200 rounded-xl text-sm flex items-center justify-between">
          <span>Error loading media: {error}</span>
          <Button size="small" variant="transparent" onClick={fetchMedia}>
            Retry
          </Button>
        </Container>
      ) : filteredMedia.length === 0 ? (
        <Container className="p-12 text-center text-ui-fg-muted space-y-3 rounded-2xl border border-dashed border-ui-border-base">
          <div className="text-3xl">🔍</div>
          <p className="text-sm font-semibold text-ui-fg-base">No media files found</p>
          <p className="text-xs text-ui-fg-subtle">
            {searchQuery
              ? `No images matched "${searchQuery}". Try a different keyword.`
              : filterTab === "unused"
              ? "All stored images are currently in active use!"
              : "No media uploaded yet."}
          </p>
        </Container>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedFilenames.has(item.filename)

            return (
              <div
                key={item.id}
                className={`group relative rounded-xl border bg-ui-bg-base transition-all duration-150 flex flex-col overflow-hidden shadow-xs hover:shadow-md ${
                  isSelected
                    ? "border-ui-border-interactive ring-2 ring-ui-border-interactive"
                    : "border-ui-border-base hover:border-ui-border-base-hover"
                }`}
              >
                {/* Checkbox Selector (Top-Left) */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.filename)}
                    className="h-4 w-4 rounded border-ui-border-base bg-ui-bg-base/90 text-ui-fg-interactive cursor-pointer shadow-xs"
                  />
                </div>

                {/* Status Badge (Top-Right) */}
                <div className="absolute top-2 right-2 z-10 pointer-events-none">
                  {item.isInUse ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/85 text-emerald-300 border border-emerald-700/80 shadow-xs">
                      In Use
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/85 text-amber-300 border border-amber-700/80 shadow-xs">
                      Unused
                    </span>
                  )}
                </div>

                {/* Thumbnail Click to Preview */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="h-36 w-full cursor-pointer bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:12px_12px] bg-ui-bg-subtle flex items-center justify-center p-2 relative overflow-hidden"
                >
                  <img
                    src={item.url}
                    alt={item.filename}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* Card Info & Quick Actions */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2 border-t border-ui-border-base bg-ui-bg-base">
                  <div>
                    <p
                      onClick={() => setPreviewItem(item)}
                      title={item.originalName}
                      className="text-xs font-semibold text-ui-fg-base truncate cursor-pointer hover:text-ui-fg-interactive"
                    >
                      {item.originalName}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-ui-fg-muted mt-1">
                      <span>{item.formattedSize}</span>
                      <span className="font-mono text-[10px] uppercase">
                        {item.mimeType.split("/")[1] || "IMG"}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Buttons Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-ui-border-base/50">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="text-[11px] text-ui-fg-subtle hover:text-ui-fg-base font-medium flex items-center gap-1 p-1 rounded hover:bg-ui-bg-subtle transition-colors"
                      title="Inspect & Preview"
                    >
                      👁️ Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => setItemsToDelete([item])}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 p-1 rounded hover:bg-rose-950/30 transition-colors"
                      title="Delete Image"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── 5. MODALS ─── */}
      {previewItem && (
        <MediaPreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDeleteRequest={(item) => setItemsToDelete([item])}
        />
      )}

      {itemsToDelete.length > 0 && (
        <MediaDeleteModal
          itemsToDelete={itemsToDelete}
          onClose={() => setItemsToDelete([])}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Media Library",
  icon: MediaLibraryIcon,
})

export default MediaLibraryPage
