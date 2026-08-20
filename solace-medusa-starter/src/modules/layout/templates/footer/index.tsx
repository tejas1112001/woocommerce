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
    <Box className="flex items-center justify-center sm:justify-start gap-2.5">
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <LocalizedClientLink
            key={social.testId}
            href={social.href}
            data-testid={social.testId}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-gray-300 shadow-xs transition-all duration-300 hover:border-orange-400 hover:bg-orange-500/25 hover:text-orange-300 hover:scale-105 hover:shadow-[0_0_12px_rgba(234,88,12,0.3)] focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label={social.label}
          >
            <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
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
      className="group inline-flex items-center text-xs sm:text-sm text-gray-300/80 font-normal transition-all duration-200 hover:text-orange-400 hover:translate-x-1 focus:outline-none focus:text-orange-400"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300 group-hover:w-full" />
      </span>
    </LocalizedClientLink>
  )
}

export default async function Footer({ countryCode }: { countryCode: string }) {
  const { product_categories } = await getCategoriesList()
  const footerNavigation = createFooterNavigation(product_categories)

  return (
    <footer className="relative bg-gradient-to-b from-[#0F0E0D] via-[#0A0A0A] to-[#050505] text-gray-300 border-t border-neutral-800/80 overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-orange-500/5 blur-[100px] rounded-full" />

      <Container className="!py-0 px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 relative z-10">
        {/* Devotional Banner Ribbon */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-950/40 via-orange-900/20 to-orange-950/40 border border-orange-500/30 p-4 sm:p-5 mb-8 sm:mb-10 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(234,88,12,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Decorative ambient light inside ribbon */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 shadow-inner">
              <span className="text-orange-400 text-base">✦</span>
            </div>
            <div>
              <p className="text-orange-400 font-bold text-sm sm:text-base tracking-widest uppercase font-serif drop-shadow-xs">
                ॥ श्री स्वामी समर्थ ॥
              </p>
              <p className="text-gray-300 text-xs mt-0.5 font-medium leading-relaxed">
                अक्कलकोट स्वामी समर्थ महाराजांचे अधिकृत व विश्वासू दालन | स्वामी ओम एन्टरप्रायझेस
              </p>
            </div>
          </div>

          <div className="z-10 flex items-center gap-2 bg-orange-500/15 px-3.5 py-1.5 rounded-full border border-orange-500/35 text-xs text-orange-200 font-medium shadow-xs backdrop-blur-xs shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
            </span>
            <span>Pan-India Shipping • Fast Maharashtra Delivery</span>
          </div>
        </div>

        {/* Main Footer Grid - 2 columns on mobile, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8 sm:gap-8 lg:gap-6 xl:gap-8">
          {/* Brand Column - full 2 cols on mobile, 1 col on desktop */}
          <div className="flex flex-col items-center sm:items-start gap-3.5 col-span-2 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <LocalizedClientLink
              href="/"
              className="group inline-flex w-max transition-transform duration-300 hover:scale-105"
              aria-label="Swami Om Enterprises Home"
            >
              <div className="flex items-center gap-2">
                <TejasLogo className="h-10 sm:h-12 w-auto text-white drop-shadow" />
              </div>
            </LocalizedClientLink>

            <Text className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-sm font-normal">
              Swami Om Enterprises | your trusted store for authentic Shree Swami Samarth devotional products from Akkalkot, Solapur. Serving retail and wholesale customers across Maharashtra and India.
            </Text>

            <div className="pt-1">
              <SocialMedia />
            </div>
          </div>

          {/* Navigation Columns - 1 col each on mobile */}
          {footerNavigation.navigation.map((section, index) => (
            <div key={`footer-section-${index}`} className="flex flex-col items-start gap-2.5 col-span-1 text-left">
              <Heading
                as="h3"
                className="text-xs sm:text-sm font-bold text-orange-400 tracking-wider uppercase flex items-center gap-1.5 pb-1 border-b border-orange-500/25 w-full"
              >
                <span className="text-orange-500/80 text-xs">✦</span>
                {section.header}
              </Heading>
              <nav aria-label={section.header} className="flex flex-col items-start gap-2 pt-0.5">
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

          {/* Trust & Payments Section Column - full 2 cols on mobile, 1 col on desktop */}
          <div className="flex flex-col items-center sm:items-start gap-3 col-span-2 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <Heading
              as="h3"
              className="text-xs sm:text-sm font-bold text-orange-400 tracking-wider uppercase flex items-center gap-2 pb-1.5 border-b border-orange-500/25 w-max"
            >
              <span className="text-orange-500/80 text-xs">✦</span>
              Trust & Payments
            </Heading>
            <div className="flex flex-col items-center sm:items-start gap-3 pt-0.5 w-full">
              {/* Razorpay Secured Badge */}
              <div className="flex items-center justify-center gap-2.5 bg-orange-500/10 border border-orange-500/30 px-3 py-2 rounded-xl text-xs text-orange-200/90 shadow-xs backdrop-blur-xs max-w-xs sm:max-w-none w-full">
                <svg className="w-4 h-4 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs leading-tight">
                  100% Secure Payments via <strong className="text-white font-bold">Razorpay</strong>
                </span>
              </div>

              {/* Security & Shipping Trust List */}
              <div className="flex flex-col items-center sm:items-start gap-1.5 text-xs text-gray-300/80 font-normal pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 text-[10px]">✦</span>
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 text-[10px]">✦</span>
                  <span>Pan-India Shipping Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 text-[10px]">✦</span>
                  <span>100% Authentic Devotional Items</span>
                </div>
              </div>

              {/* Accepted Payment Modes Badges */}
              <div className="pt-1 w-full text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-400/90 mb-1.5">Accepted Payment Modes</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[10px] font-extrabold text-white tracking-wider">UPI</span>
                  <span className="bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[10px] font-extrabold text-blue-300 tracking-wider">VISA</span>
                  <span className="bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[10px] font-extrabold text-amber-300 tracking-wider">MASTERCARD</span>
                  <span className="bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[10px] font-extrabold text-emerald-300 tracking-wider">RUPAY</span>
                  <span className="bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[10px] font-extrabold text-purple-300 tracking-wider">NET BANKING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Centered Copyright & Legal Links Bar */}
        <div className="mt-6 sm:mt-8 pt-4 pb-4 sm:pb-6 border-t border-orange-500/15 flex flex-col items-center justify-center gap-2 text-center">
          {/* Copyright */}
          <Text className="text-xs text-gray-400">
            © {new Date().getFullYear()} Swami Om Enterprises. Built for Swami Samarth Devotees. | Developed by{" "}
            <a
              href="https://codewavetech.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300"
            >
              CodeWaveTech
            </a>
          </Text>

          {/* Legal Links */}
          {footerNavigation.other.length > 0 && (
            <nav aria-label="Legal" className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              {footerNavigation.other.map((link, index) => (
                <LocalizedClientLink
                  key={`legal-${index}`}
                  href={link.href}
                  data-testid={formatNameForTestId(`${link.title}-link`)}
                  className="text-xs text-gray-400 transition-colors duration-200 hover:text-orange-400"
                >
                  {link.title}
                </LocalizedClientLink>
              ))}
            </nav>
          )}
        </div>
      </Container>
    </footer>
  )
}


