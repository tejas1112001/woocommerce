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
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <Container className="px-6 py-16 medium:py-20">
        {/* Main Footer Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-12 medium:grid-cols-2 large:grid-cols-4 large:gap-8 xl:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 large:col-span-1">
            <LocalizedClientLink
              href="/"
              className="group inline-flex w-max transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <TejasLogo className="h-12 medium:h-14 text-white" />
              </div>
            </LocalizedClientLink>
            <Text className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Swami Om Enterprises — your trusted store for authentic Shree Swami Samarth devotional products from Akkalkot, Solapur. Serving retail and wholesale customers across Maharashtra and India.
            </Text>
            <SocialMedia />
          </div>

          {/* Navigation Columns */}
          {footerNavigation.navigation.map((section, index) => (
            <div key={`footer-section-${index}`} className="flex flex-col gap-5">
              <Heading
                as="h3"
                className="text-base font-semibold text-white tracking-wide"
              >
                {section.header}
              </Heading>
              <nav className="flex flex-col gap-3">
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
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col gap-6 medium:flex-row medium:items-center medium:justify-between">
            {/* Copyright */}
            <Text className="text-sm text-gray-500">
              © {new Date().getFullYear()} Swami Om Enterprises. All rights reserved.
            </Text>

            {/* Legal Links */}
            <nav className="flex flex-wrap gap-6">
              {footerNavigation.other.map((link, index) => (
                <LocalizedClientLink
                  key={`legal-${index}`}
                  href={link.href}
                  data-testid={formatNameForTestId(`${link.title}-link`)}
                  className="text-sm text-gray-500 transition-colors duration-300 hover:text-[#D4AF37]"
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
