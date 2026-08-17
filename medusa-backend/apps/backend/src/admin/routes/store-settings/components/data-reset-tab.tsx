import React, { useState } from "react"
import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { ResetModal } from "./reset-modal"

export const DataResetTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastResetResult, setLastResetResult] = useState<any>(null)

  return (
    <div className="space-y-6">
      <Container className="p-6 bg-ui-bg-base border border-rose-950/60 rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ui-border-base pb-4">
          <div>
            <Heading level="h2" className="text-lg font-bold text-rose-400 flex items-center gap-2">
              E-Commerce Data Reset (Danger Zone)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle mt-1">
              Safely reset operational e-commerce data (orders, catalog, inventory, customers) while keeping all admin credentials intact.
            </Text>
          </div>
          <Badge color="red">Protected Action</Badge>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What gets cleared */}
          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/60 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span>🗑️</span>
              <span>Data That Will Be Reset / Deleted</span>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-200/90 list-disc list-inside">
              <li>Products, Variants, Options, Collections & Categories</li>
              <li>Inventory Items, Levels & Stock Locations</li>
              <li>Orders, Line Items, Adjustments & Transactions</li>
              <li>Active Carts, Shipping Methods & Payment Sessions</li>
              <li>Store Customers & Customer Addresses</li>
              <li>Promotions, Price Sets & Tax Rates</li>
            </ul>
          </div>

          {/* What gets preserved */}
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span>🛡️</span>
              <span>Protected Data (NEVER DELETED)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-200/90 list-disc list-inside">
              <li>Medusa Admin Users (`user` table & login credentials)</li>
              <li>Authentication identities & password hashes</li>
              <li>Admin RBAC roles & permissions</li>
              <li>Pending Admin Invites</li>
              <li>Root Store Configuration & Core Currencies</li>
              <li>System Settings & Key-Value Configurations</li>
            </ul>
          </div>
        </div>

        {/* Safety & Transaction Guarantees */}
        <div className="p-4 rounded-lg bg-ui-bg-subtle border border-ui-border-base space-y-2 text-xs text-ui-fg-subtle">
          <div className="font-semibold text-ui-fg-base text-sm flex items-center gap-2">
            <span>⚙️</span> Transaction Safety & Automatic Pre-Reset Backup
          </div>
          <div>
            Before executing the reset, the system automatically attempts to generate a timestamped SQL database dump in <code className="text-emerald-400 font-mono">apps/backend/backups/</code>.
            The reset is executed within a single PostgreSQL transaction block. If an error occurs, all changes roll back automatically.
          </div>
        </div>

        {/* Result Notification */}
        {lastResetResult && (
          <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 text-xs space-y-2">
            <div className="font-bold text-sm text-emerald-300">✅ {lastResetResult.message}</div>
            <div>Reset Timestamp: {lastResetResult.reset_timestamp}</div>
            <div>Admin Accounts Preserved: {lastResetResult.preserved?.admin_users_preserved}</div>
            <div>Backup Created: {lastResetResult.backup?.backup_file}</div>
          </div>
        )}

        {/* Trigger Button */}
        <div className="flex justify-end pt-4 border-t border-ui-border-base">
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={() => setIsModalOpen(true)}
          >
            Reset Store Data...
          </Button>
        </div>
      </Container>

      {/* Confirmation Modal */}
      <ResetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(result) => setLastResetResult(result)}
      />
    </div>
  )
}
