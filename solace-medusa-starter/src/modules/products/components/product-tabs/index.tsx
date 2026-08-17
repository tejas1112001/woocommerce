'use client'

import { useMemo } from 'react'

import { HttpTypes } from '@medusajs/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@modules/common/components/accordion'
import { Box } from '@modules/common/components/box'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import { MinusThinIcon, PlusIcon } from '@modules/common/icons'

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const dimensions = useMemo(() => {
    return Object.entries(product?.metadata || {})
      .filter(([key]) => key.startsWith('dim_'))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  }, [product?.metadata])

  const design = useMemo(() => {
    return Object.entries(product?.metadata || {})
      .filter(([key]) => key.startsWith('des_'))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  }, [product?.metadata])

  const tabs = [
    {
      label: 'Description',
      component: <ProductDescriptionTab description={product.description} />,
    },
    Object.entries(dimensions).length > 0 && {
      label: 'Dimensions',
      component: <ProductDimensionsTab dimensions={dimensions} />,
    },
    Object.entries(design).length > 0 && {
      label: 'Design',
      component: <ProductDesignTab design={design} />,
    },
    {
      label: 'Shipping & Returns',
      component: <ShippingInfoTab />,
    },
  ].filter(Boolean)

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="flex w-full flex-col divide-y divide-gray-100">
        {tabs.map((tab, id) => {
          return (
            <AccordionItem
              key={id}
              value={`item-${id}`}
              className="border-0 py-0"
              data-testid="product-tab"
            >
              <AccordionTrigger className="!rounded-none !py-4 transition-all duration-200 ease-in-out [&[data-state=closed]>#minusIconSvg]:hidden [&[data-state=open]>#plusIconSvg]:hidden hover:no-underline">
                <Heading
                  className="text-sm font-semibold uppercase tracking-widest text-basic-primary"
                  as="h3"
                >
                  {tab.label}
                </Heading>
                <div
                  id="plusIconSvg"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-basic-primary transition-colors hover:bg-gray-100"
                >
                  <PlusIcon />
                </div>
                <div
                  id="minusIconSvg"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-basic-primary transition-colors hover:bg-gray-100"
                >
                  <MinusThinIcon />
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 !pb-5 !pt-0">
                {tab.component}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

const ProductDescriptionTab = ({ description }: { description: string }) => {
  return (
    <Text
      data-testid="product-description-tab"
      size="md"
      className="whitespace-pre-line text-secondary"
    >
      {description}
    </Text>
  )
}

const ProductDimensionsTab = ({
  dimensions,
}: {
  dimensions: Record<string, unknown>
}) => {
  return (
    <Box data-testid="product-dimensions-tab">
      {Object.entries(dimensions).map(([key, value]) => (
        <div key={key}>
          <Text as="span" className="font-medium text-basic-primary">
            {formatKey(key, 'dim_')}:
          </Text>{' '}
          <Text as="span" className="text-secondary">
            {value as string}
          </Text>
        </div>
      ))}
    </Box>
  )
}

const ProductDesignTab = ({ design }: { design: Record<string, unknown> }) => {
  return (
    <Box data-testid="product-design-tab">
      {Object.entries(design).map(([key, value]) => (
        <div key={key}>
          <Text as="span" className="font-medium text-basic-primary">
            {formatKey(key, 'des_')}:
          </Text>{' '}
          <Text as="span" className="text-secondary">
            {value as string}
          </Text>
        </div>
      ))}
    </Box>
  )
}

const ShippingInfoTab = () => {
  return (
    <ul className="list-disc pl-4 text-md text-secondary 2xl:pl-5">
      <li>
        We ship across India. Orders are usually processed within 3–5 business days. No returns or exchanges are accepted once the order has been delivered.
      </li>
      <li>
        If you receive a damaged, defective, or incorrect product, please contact us within 24 hours of delivery with photos/videos of the product. Shipping charges are non-refundable.
      </li>
    </ul>
  )
}

const formatKey = (key: string, prefix: string): string => {
  return key
    .replace(prefix, '')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
