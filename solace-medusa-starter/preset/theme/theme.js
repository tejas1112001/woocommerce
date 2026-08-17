const { animation, keyframes } = require('./animations')
const { boxShadow, colors } = require('./colors')
const { screens } = require('./constants')
const { fontFamily, fontSize } = require('./typography')

const uiTheme = {
  // NOTE: fontSize is kept at top-level so it fully replaces Tailwind's default
  // font sizes (intentional — this project uses its own size scale).
  fontSize,
  extend: {
    // Merging screens into `extend` means the project's custom breakpoints
    // (xsmall, small, medium, large) are ADDED to Tailwind's defaults (sm, md,
    // lg, xl, 2xl) rather than replacing them. This fixes the issue where
    // standard `sm:`, `md:`, `lg:` prefixes produced no CSS output.
    screens,
    fontFamily,
    ...colors,
    boxShadow,
    keyframes,
    animation,
  },
}

module.exports = uiTheme
