const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public', 'Banner_Image')
const destDir = path.join(projectRoot, 'src', 'assets', 'banners')

const files = ['product1.png', 'product2.png']

if (!fs.existsSync(publicDir)) {
  console.error('Source public/Banner_Image does not exist:', publicDir)
  process.exit(1)
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

files.forEach((f) => {
  const src = path.join(publicDir, f)
  const dest = path.join(destDir, f)
  if (!fs.existsSync(src)) {
    console.warn('Source file missing, skipping:', src)
    return
  }
  fs.copyFileSync(src, dest)
  console.log('Copied', src, '->', dest)
})

console.log('\nDone. You can now import banners from src/assets/banners in your components.')
