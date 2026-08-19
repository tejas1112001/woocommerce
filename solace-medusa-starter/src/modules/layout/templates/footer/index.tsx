import { createFooterNavigation } from '@lib/constants'
import { getCategoriesList } from '@lib/data/categories'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'
import {
  FacebookIcon,
  LinkedinIcon,
  TejasLogo,
  XLogoIcon,
} from '@modules/common/icons'

// Instagram Icon Component
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

// Social Media Component
function SocialMedia() {
  const socialLinks = [
    { href: '#', icon: LinkedinIcon, label: 'LinkedIn', testId: 'linkedin-link' },
    { href: '#', icon: FacebookIcon, label: 'Facebook', testId: 'facebook-link' },
    { href: '#', icon: XLogoIcon, label: 'X (Twitter)', testId: 'x-link' },
    { href: '#', icon: InstagramIcon, label: 'Instagram', testId: 'instagram-link' },
  ]

  return (
    <Box className="flex gap-4">
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <LocalizedClientLink
            key={social.testId}
            href={social.href}
            data-testid={social.testId}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:scale-110"
            aria-label={social.label}
          >
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </LocalizedClientLink>
        )
      })}
    </Box>
  )
}

// Footer Link Component
function FooterLink({
  href,
  children,
  testId,
}: {
  href: string
  children: React.ReactNode
  testId?: string
}) {
  return (
    <LocalizedClientLink
      href={href}
      data-testid={testId}
      className="group inline-flex items-center text-sm text-gray-400 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
      </span>
    </LocalizedClientLink>
  )
}

export default async function Footer({ countryCode }: { countryCode: string }) {
  const { product_categories } = await getCategoriesList()
  const footerNavigation = createFooterNavigation(product_categories)

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-amber-500/20 text-gray-300 overflow-hidden">
      {/* Top Saffron/Gold Accent Line */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 w-full" />

      <Container className="px-4 sm:px-6 py-12 sm:py-16 medium:py-20">
        {/* Devotional Banner Ribbon */}
        <div className="border-b border-white/10 pb-8 mb-10 sm:mb-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-amber-400 text-xl hidden sm:inline">✦</span>
            <div>
              <p className="text-amber-400 font-extrabold text-base tracking-widest uppercase">
                ॥ श्री स्वामी समर्थ ॥
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5 font-medium">
                अक्कलकोट स्वामी समर्थ महाराजांचे अधिकृत व विश्वासू दालन — स्वामी ओम एन्टरप्रायझेस
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/30 text-xs text-amber-300 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Pan-India Shipping • Fast Maharashtra Delivery
          </div>
        </div>

        {/* Main Footer Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-10 medium:grid-cols-2 large:grid-cols-4 large:gap-8 xl:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-5 large:col-span-1 text-center sm:text-left">
            <LocalizedClientLink
              href="/"
              className="group inline-flex w-max mx-auto sm:mx-0 transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <TejasLogo className="h-12 medium:h-14 text-white" />
              </div>
            </LocalizedClientLink>
            <Text className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-sm mx-auto sm:mx-0">
              Swami Om Enterprises — your trusted store for authentic Shree Swami Samarth devotional products from Akkalkot, Solapur. Serving retail and wholesale customers across Maharashtra and India.
            </Text>
            
            {/* Trust Badges */}
            <div className="flex flex-col gap-1.5 text-xs text-amber-300/90 font-medium">
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-amber-400">✓</span> 100% Authentic Akkalkot Devotional Items
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-amber-400">✓</span> Wholesale & Retail Orders Welcome
              </span>
            </div>

            <div className="flex justify-center sm:justify-start pt-1">
              <SocialMedia />
            </div>
          </div>

          {/* Navigation Columns */}
          {footerNavigation.navigation.map((section, index) => (
            <div key={`footer-section-${index}`} className="flex flex-col gap-4 text-center sm:text-left">
              <Heading
                as="h3"
                className="text-sm font-bold text-amber-400 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-2"
              >
                <span className="text-amber-500/70 text-xs">✦</span>
                {section.header}
              </Heading>
              <nav className="flex flex-col gap-2.5">
                {section.links.map((link, linkIndex) => (
                  <FooterLink
                    key={`${index}-link-${linkIndex}`}
                    href={link.href}
                    testId={formatNameForTestId(`${link.title}-link`)}
                  >
                    {link.title}
                  </FooterLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col gap-4 medium:flex-row medium:items-center medium:justify-between text-center sm:text-left">
            {/* Copyright */}
            <Text className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} Swami Om Enterprises. All rights reserved. | Built for Swami Samarth Devotees.
            </Text>

            {/* Legal Links */}
            <nav className="flex flex-wrap justify-center sm:justify-start gap-5">
              {footerNavigation.other.map((link, index) => (
                <LocalizedClientLink
                  key={`legal-${index}`}
                  href={link.href}
                  data-testid={formatNameForTestId(`${link.title}-link`)}
                  className="text-xs sm:text-sm text-gray-500 transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  {link.title}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  )
}
