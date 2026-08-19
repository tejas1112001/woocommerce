const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetDir = path.join(rootDir, '.medusa', 'server');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy .env
if (fs.existsSync(path.join(rootDir, '.env'))) {
  fs.copyFileSync(path.join(rootDir, '.env'), path.join(targetDir, '.env'));
  console.log('Copied .env to .medusa/server/.env');
}

// Copy .env.production
if (fs.existsSync(path.join(rootDir, '.env.production'))) {
  fs.copyFileSync(path.join(rootDir, '.env.production'), path.join(targetDir, '.env.production'));
  console.log('Copied .env.production to .medusa/server/.env.production');
}

// Copy static directory
const staticSrc = path.join(rootDir, 'static');
const staticDest = path.join(targetDir, 'static');
if (fs.existsSync(staticSrc)) {
  try {
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
    console.log('Copied static files to .medusa/server/static');
  } catch (err) {
    console.warn('Static folder copy warning:', err.message);
  }
}

// Copy admin build from .medusa/server/public/admin to root public/admin
const adminSrc = path.join(targetDir, 'public', 'admin');
const adminDest = path.join(rootDir, 'public', 'admin');
if (fs.existsSync(adminSrc)) {
  try {
    fs.mkdirSync(adminDest, { recursive: true });
    fs.cpSync(adminSrc, adminDest, { recursive: true, force: true });
    console.log('Copied admin dashboard build to public/admin');
  } catch (err) {
    console.warn('Admin folder copy warning:', err.message);
  }
}
