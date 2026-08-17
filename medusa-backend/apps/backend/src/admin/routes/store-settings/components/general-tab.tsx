import React, { useState } from "react"
import { Container, Heading, Text, Button, Input, Label, Switch } from "@medusajs/ui"

interface GeneralTabProps {
  settings: Record<string, any>
  onSave: (updated: Record<string, any>) => Promise<void>
  isSaving: boolean
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ settings, onSave, isSaving }) => {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(
    settings["store.maintenance_mode"]?.value === "true"
  )
  const [brandName, setBrandName] = useState<string>(
    settings["store.brand_name"]?.value || "Solace E-Commerce Store"
  )
  const [supportEmail, setSupportEmail] = useState<string>(
    settings["store.support_email"]?.value || "support@solace-store.com"
  )
  const [supportPhone, setSupportPhone] = useState<string>(
    settings["store.support_phone"]?.value || ""
  )
  const [defaultCurrency, setDefaultCurrency] = useState<string>(
    settings["store.default_currency"]?.value || "INR"
  )

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMsg(null)
    try {
      await onSave({
        "store.maintenance_mode": maintenanceMode ? "true" : "false",
        "store.brand_name": brandName,
        "store.support_email": supportEmail,
        "store.support_phone": supportPhone,
        "store.default_currency": defaultCurrency,
      })
      setFeedbackMsg({ type: "success", text: "General store settings saved successfully!" })
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to save store settings" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Container className="p-6 bg-ui-bg-base border border-ui-border-base rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-ui-border-base pb-4">
          <div>
            <Heading level="h2" className="text-lg font-bold text-ui-fg-base">
              General Store Branding & Defaults
            </Heading>
            <Text className="text-xs text-ui-fg-subtle mt-1">
              Configure store maintenance status, support details, and default operational preferences.
            </Text>
          </div>
        </div>

        {feedbackMsg && (
          <div
            className={`p-3.5 rounded-lg text-sm font-medium ${
              feedbackMsg.type === "success"
                ? "bg-emerald-950/60 border border-emerald-700/80 text-emerald-200"
                : "bg-rose-950/60 border border-rose-700/80 text-rose-200"
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-ui-bg-subtle border border-ui-border-base">
            <div>
              <Label className="text-sm font-semibold text-ui-fg-base">Storefront Maintenance Mode</Label>
              <Text className="text-xs text-ui-fg-subtle">
                When enabled, storefront APIs can notify customers of ongoing site maintenance.
              </Text>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Brand Name */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ui-fg-subtle">Store Brand Name</Label>
              <Input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Default Currency */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ui-fg-subtle">Default Store Currency</Label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-ui-bg-field border border-ui-border-base text-ui-fg-base text-sm focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Support Email */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ui-fg-subtle">Support Email</Label>
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Support Phone */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ui-fg-subtle">Support Phone Number</Label>
              <Input
                type="text"
                placeholder="+91 98765 43210"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-ui-border-base">
          <Button type="submit" variant="primary" size="small" isLoading={isSaving}>
            Save Store Settings
          </Button>
        </div>
      </Container>
    </form>
  )
}
