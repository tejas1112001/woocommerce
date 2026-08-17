import React, { useState } from "react"
import { Heading, Text, Button, Input, Label, Badge } from "@medusajs/ui"

interface ResetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (result: any) => void
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [confirmText, setConfirmText] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExecuteReset = async () => {
    if (confirmText !== "RESET STORE DATA") {
      setErrorMsg("Confirmation text must match 'RESET STORE DATA' exactly.")
      return
    }

    setIsResetting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/admin/store-settings/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          confirm_text: confirmText,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset store data")
      }

      onSuccess(data)
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during store data reset.")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-ui-bg-base border border-rose-900/80 rounded-xl shadow-2xl p-6 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-ui-border-base pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge color="red">PERMANENT ACTION</Badge>
              <Heading level="h2" className="text-xl font-bold text-rose-400">
                Reset Store Data
              </Heading>
            </div>
            <Text className="text-xs text-ui-fg-subtle mt-1">
              This action will permanently delete products, orders, inventory, customers, and carts.
            </Text>
          </div>
          <button
            onClick={onClose}
            disabled={isResetting}
            className="text-ui-fg-muted hover:text-ui-fg-base text-lg font-semibold px-2"
          >
            ✕
          </button>
        </div>

        {/* Protection Alert Box */}
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-emerald-200 text-xs space-y-1">
          <div className="font-semibold text-emerald-300">✅ PRESERVED (NOT DELETED):</div>
          <div>Medusa Admin Accounts (`user`), Login Credentials, Roles & Core Store Setup will remain intact.</div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <Text className="text-xs font-medium text-ui-fg-base">
            To proceed, type <span className="font-mono text-rose-400 font-bold select-all">RESET STORE DATA</span> in the field below:
          </Text>
          <Input
            type="text"
            placeholder="RESET STORE DATA"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isResetting}
            className="w-full font-mono text-sm border-rose-800 focus:border-rose-500"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ui-border-base">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onClose}
            disabled={isResetting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={handleExecuteReset}
            isLoading={isResetting}
            disabled={confirmText !== "RESET STORE DATA" || isResetting}
          >
            Execute Reset Now
          </Button>
        </div>
      </div>
    </div>
  )
}
