export function isDefaultVariantTitle(title?: string | null): boolean {
  if (!title) return true
  const lower = title.toLowerCase().trim()
  return (
    lower === 'default variant' ||
    lower === 'default option' ||
    lower === 'default option value' ||
    lower === 'default'
  )
}
