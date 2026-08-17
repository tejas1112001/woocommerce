import React, { useState } from "react"
import { Container, Heading, Text, Button, Input, Label, Badge, Switch } from "@medusajs/ui"

interface RazorpayTabProps {
  settings: Record<string, any>
  onSave: (updated: Record<string, any>) => Promise<void>
  isSaving: boolean
}

export const RazorpayTab: React.FC<RazorpayTabProps> = ({ settings, onSave, isSaving }) => {
  const [mode, setMode] = useState<string>(settings["razorpay.mode"]?.value || "test")
  const [keyId, setKeyId] = useState<string>(settings["razorpay.key_id"]?.value || "")
  const [keySecret, setKeySecret] = useState<string>(settings["razorpay.key_secret"]?.value || "")
  const [webhookSecret, setWebhookSecret] = useState<string>(settings["razorpay.webhook_secret"]?.value || "")
  const [autoCapture, setAutoCapture] = useState<boolean>(settings["razorpay.auto_capture"]?.value === "true")

  const [testingConnection, setTestingConnection] = useState<boolean>(false)
  const [testResult, setTestResult] = useState<{ status: string; connected: boolean; message: string } | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleTestConnection = async () => {
    setTestingConnection(true)
    setTestResult(null)
    try {
      const res = await fetch("/admin/store-settings/razorpay/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          key_id: keyId,
          key_secret: keySecret,
        }),
      })
      const data = await res.json()
      setTestResult({
        status: data.status || (res.ok ? "connected" : "error"),
        connected: Boolean(data.connected),
        message: data.message || "Connection test finished.",
      })
    } catch (err: any) {
      setTestResult({
        status: "error",
        connected: false,
        message: err.message || "Failed to reach backend connection test endpoint",
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMsg(null)
    try {
      await onSave({
        "razorpay.mode": mode,
        "razorpay.key_id": keyId,
        "razorpay.key_secret": keySecret,
        "razorpay.webhook_secret": webhookSecret,
        "razorpay.auto_capture": autoCapture ? "true" : "false",
      })
      setFeedbackMsg({ type: "success", text: "Razorpay settings saved successfully!" })
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to save Razorpay settings" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Container className="p-6 bg-ui-bg-base border border-ui-border-base rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ui-border-base pb-4">
          <div>
            <Heading level="h2" className="text-lg font-bold text-ui-fg-base flex items-center gap-2">
              Razorpay Payment Gateway Configuration
            </Heading>
            <Text className="text-xs text-ui-fg-subtle mt-1">
              Configure API key credentials, webhook secrets, and auto-capture settings for your Razorpay integration.
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge color={mode === "live" ? "green" : "orange"}>
              {mode === "live" ? "Production / Live Mode" : "Test / Sandbox Mode"}
            </Badge>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment Mode */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ui-fg-subtle">Environment Mode</Label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-ui-bg-field border border-ui-border-base text-ui-fg-base text-sm focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive"
            >
              <option value="test">Test Mode (rzp_test_...)</option>
              <option value="live">Live / Production Mode (rzp_live_...)</option>
            </select>
            <Text className="text-xs text-ui-fg-muted">
              Select sandbox/test mode during development and testing.
            </Text>
          </div>

          {/* Auto Capture Toggle */}
          <div className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center justify-between p-3 rounded-lg bg-ui-bg-subtle border border-ui-border-base">
              <div>
                <Label className="text-sm font-semibold text-ui-fg-base">Automatic Payment Capture</Label>
                <Text className="text-xs text-ui-fg-subtle">
                  Automatically capture funds after authorization without manual admin approval.
                </Text>
              </div>
              <Switch checked={autoCapture} onCheckedChange={setAutoCapture} />
            </div>
          </div>

          {/* Razorpay Key ID */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-semibold text-ui-fg-subtle">Razorpay Key ID</Label>
            <Input
              type="text"
              placeholder="rzp_test_..."
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              className="w-full"
            />
            <Text className="text-xs text-ui-fg-muted">
              Your public Razorpay API Key ID from the Razorpay Dashboard.
            </Text>
          </div>

          {/* Razorpay Key Secret */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ui-fg-subtle">
              Razorpay Key Secret <span className="text-amber-500 font-normal">(Encrypted at Rest)</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter new secret or leave masked..."
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              className="w-full font-mono text-sm"
            />
            <Text className="text-xs text-ui-fg-muted">
              Masked secrets are preserved unless overwritten with a new value.
            </Text>
          </div>

          {/* Webhook Secret */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ui-fg-subtle">
              Razorpay Webhook Secret <span className="text-amber-500 font-normal">(Encrypted at Rest)</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter new webhook secret..."
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full font-mono text-sm"
            />
            <Text className="text-xs text-ui-fg-muted">
              Used to verify signature headers for payment webhooks.
            </Text>
          </div>
        </div>

        {/* Webhook Endpoint Info Box */}
        <div className="p-4 rounded-lg bg-ui-bg-subtle border border-ui-border-base space-y-2">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-semibold text-ui-fg-subtle uppercase tracking-wider">
              Webhook Endpoint URL for Razorpay Dashboard
            </Text>
            <Badge color="blue" size="small">Standard Route</Badge>
          </div>
          <code className="block p-2.5 rounded bg-ui-bg-field text-emerald-400 text-xs font-mono select-all overflow-x-auto">
            /hooks/payment/razorpay_razorpay
          </code>
          <Text className="text-xs text-ui-fg-subtle">
            Add this endpoint in your Razorpay Dashboard under Webhooks to receive payment events (`payment.authorized`, `payment.failed`, `order.paid`).
          </Text>
        </div>

        {/* Connection Status & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-ui-border-base">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handleTestConnection}
              isLoading={testingConnection}
            >
              Test Razorpay Connection
            </Button>

            {testResult && (
              <Badge color={testResult.connected ? "green" : "red"}>
                {testResult.message}
              </Badge>
            )}
          </div>

          <Button type="submit" variant="primary" size="small" isLoading={isSaving}>
            Save Razorpay Settings
          </Button>
        </div>
      </Container>
    </form>
  )
}
