const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const monorepoRoot = path.resolve(rootDir, '..', '..');

// Path to @medusajs/dashboard
let dashboardDistDir = path.join(monorepoRoot, 'node_modules', '@medusajs', 'dashboard', 'dist');
if (!fs.existsSync(dashboardDistDir)) {
  dashboardDistDir = path.join(rootDir, 'node_modules', '@medusajs', 'dashboard', 'dist');
}
const dashboardSrcDir = path.join(path.dirname(dashboardDistDir), 'src');

console.log('Using dashboard dir:', path.dirname(dashboardDistDir));

// 1. Update chunk-BITU2JBZ.mjs
const chunkPath = path.join(dashboardDistDir, 'chunk-BITU2JBZ.mjs');
if (fs.existsSync(chunkPath)) {
  let content = fs.readFileSync(chunkPath, 'utf-8');
  if (content.includes('const name = store?.name;') && !content.includes('document.title = `${name} Admin`')) {
    content = content.replace(
      'const name = store?.name;',
      'const name = store?.name; if (name && typeof document !== "undefined") { document.title = `${name} Admin`; }'
    );
    fs.writeFileSync(chunkPath, content, 'utf-8');
    console.log('Updated Header document.title in chunk-BITU2JBZ.mjs');
  }
}

// 2. Update dist/app.js
const appJsPath = path.join(dashboardDistDir, 'app.js');
if (fs.existsSync(appJsPath)) {
  let content = fs.readFileSync(appJsPath, 'utf-8');
  if (content.includes('const name = store?.name;') && !content.includes('document.title = `${name} Admin`')) {
    content = content.replace(
      'const name = store?.name;',
      'const name = store?.name; if (name && typeof document !== "undefined") { document.title = `${name} Admin`; }'
    );
    fs.writeFileSync(appJsPath, content, 'utf-8');
    console.log('Updated Header document.title in app.js');
  }
}

// 3. Update en.json translation files
const updateJson = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data.login && data.login.title) {
        data.login.title = 'Welcome';
      }
      if (data.invite && data.invite.title) {
        data.invite.title = 'Welcome';
      }
      if (data.invite && data.invite.successHint) {
        data.invite.successHint = 'Get started with Admin right away.';
      }
      if (data.invite && data.invite.successAction) {
        data.invite.successAction = 'Start Admin';
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Updated JSON translations at:', filePath);
    } catch (e) {
      console.error('Error updating JSON at', filePath, e);
    }
  }
};

updateJson(path.join(dashboardDistDir, 'en.json'));
updateJson(path.join(dashboardDistDir, 'enGB.json'));
updateJson(path.join(dashboardSrcDir, 'i18n', 'translations', 'en.json'));
updateJson(path.join(dashboardSrcDir, 'i18n', 'translations', 'enGB.json'));

console.log('Finished updating dashboard branding.');
