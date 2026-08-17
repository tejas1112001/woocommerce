type VariantColor = {
  Name: string
  Type?: Array<{
    Image?: {
      url: string
      alternativeText?: string
    }
    Color?: string
  }>
}

export const getVariantColor = (
  variantName: string,
  colors: VariantColor[]
) => {
  const color = colors.find((c) => c.Name === variantName)

  return color?.Type?.[0]
}
