/**
 * Icon Generator Script for PWA
 * This script helps generate the required icon sizes for PWA installation
 * 
 * Usage:
 * 1. Install sharp: npm install --save-dev sharp
 * 2. Place your source icon (192x192 or larger) in public/icon-source.png
 * 3. Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp is not installed. Run: npm install --save-dev sharp');
  console.log('\nAlternative: Use an online tool like https://realfavicongenerator.net/');
  console.log('Or manually create logo192.png and logo512.png in the public folder.');
  process.exit(1);
}

const publicDir = path.join(__dirname, '../public');
const sourceIcon = path.join(publicDir, 'icon-source.png');

// Check if source icon exists
if (!fs.existsSync(sourceIcon)) {
  console.log('Source icon not found at:', sourceIcon);
  console.log('Please create icon-source.png (192x192 or larger) in the public folder.');
  console.log('Or download from: https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  process.exit(1);
}

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');
    
    // Generate 192x192 icon
    await sharp(sourceIcon)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'logo192.png'));
    console.log('✅ Generated logo192.png');
    
    // Generate 512x512 icon
    await sharp(sourceIcon)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'logo512.png'));
    console.log('✅ Generated logo512.png');
    
    console.log('\nIcons generated successfully!');
    console.log('Update manifest.json to use local icons instead of CDN URLs.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();


