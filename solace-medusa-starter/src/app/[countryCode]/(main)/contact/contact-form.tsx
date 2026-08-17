'use client'

import { useState } from 'react'

import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Input } from '@modules/common/components/input'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate a short delay — replace with real API call as needed
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Box className="flex flex-col items-center gap-4 rounded-xl border border-basic-primary bg-fg-secondary px-8 py-12 text-center">
        <span className="text-3xl">✓</span>
        <p className="text-lg font-medium text-basic-primary">Message sent!</p>
        <p className="text-secondary">
          Thanks for reaching out. We will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm text-action-primary underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </Box>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Box className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full Name"
          name="fullName"
          placeholder="Jane Doe"
          required
          autoComplete="name"
        />
        <Input
          label="Mobile Number"
          name="mobile"
          type="tel"
          placeholder="+91 98765 43210"
          required
          autoComplete="tel"
        />
      </Box>

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      {/* Textarea — styled to match the Input component */}
      <Box className="flex w-full flex-col gap-2">
        <label
          htmlFor="message"
          className="text-sm font-normal text-secondary"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="How can we help you?"
          className="w-full resize-none border border-primary bg-secondary px-4 py-3.5 text-lg text-basic-primary outline-none placeholder:text-secondary focus:border-action-primary focus:ring-0"
        />
      </Box>

      <Button
        type="submit"
        variant="filled"
        size="md"
        isLoading={loading}
        className="w-full sm:w-auto sm:self-start"
      >
        {loading ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
