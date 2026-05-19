/**
 * generate-icon.js
 * Run: node generate-icon.js
 * Requires: npm install sharp (one-time)
 *
 * Generates build/icon.png which you can convert to .ico via icoconvert.com
 * or use sharp/png-to-ico for automated conversion.
 */

const fs = require('fs');
const path = require('path');

// SVG icon design
const svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="52" fill="#07070f"/>
  <rect x="8" y="8" width="240" height="240" rx="46" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.3"/>

  <!-- Stack of layers icon -->
  <g transform="translate(128,128)">
    <!-- Bottom layer -->
    <ellipse cx="0" cy="30" rx="68" ry="20" fill="#1e1e38" stroke="#f59e0b" stroke-width="2" opacity="0.6"/>
    <!-- Middle layer -->
    <ellipse cx="0" cy="8" rx="68" ry="20" fill="#252550" stroke="#f59e0b" stroke-width="2" opacity="0.8"/>
    <!-- Top layer -->
    <ellipse cx="0" cy="-14" rx="68" ry="20" fill="#f59e0b"/>
    <!-- M letter on top -->
    <text x="0" y="-7" font-family="Arial Black, sans-serif" font-size="22" font-weight="900"
          text-anchor="middle" fill="#000" letter-spacing="1">M</text>
    <!-- Vertical connection lines -->
    <line x1="-68" y1="-14" x2="-68" y2="30" stroke="#f59e0b" stroke-width="2" opacity="0.4"/>
    <line x1="68" y1="-14" x2="68" y2="30" stroke="#f59e0b" stroke-width="2" opacity="0.4"/>
  </g>

  <!-- Subtle grid dots -->
  <circle cx="40" cy="40" r="2" fill="#f59e0b" opacity="0.2"/>
  <circle cx="216" cy="40" r="2" fill="#f59e0b" opacity="0.2"/>
  <circle cx="40" cy="216" r="2" fill="#f59e0b" opacity="0.2"/>
  <circle cx="216" cy="216" r="2" fill="#f59e0b" opacity="0.2"/>
</svg>`;

const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

const svgPath = path.join(buildDir, 'icon.svg');
fs.writeFileSync(svgPath, svg);
console.log('✓ Written build/icon.svg');
console.log('');
console.log('Next steps:');
console.log('  1. Convert build/icon.svg to build/icon.ico');
console.log('     Online: https://icoconvert.com (use 256x256 PNG)');
console.log('  2. Or install sharp and png-to-ico:');
console.log('     npm install sharp png-to-ico');
console.log('  3. Then run: npm run build:win');
