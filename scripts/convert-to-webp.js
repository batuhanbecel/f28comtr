const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const portfoliosDir = path.join(__dirname, '..', 'public', 'portfolios');

async function convertImagesToWebP(directory) {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && item !== 'previews') {
      // Recursively process subdirectories
      await convertImagesToWebP(itemPath);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      
      // Skip if already webp or not an image
      if (ext === '.webp') continue;
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
      
      // Skip 0-byte files
      if (stat.size === 0) {
        console.log(`Skipping 0-byte file: ${itemPath}`);
        continue;
      }

      try {
        const outputPath = itemPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Skip if webp version already exists
        if (fs.existsSync(outputPath)) {
          console.log(`Already converted: ${item}`);
          continue;
        }

        console.log(`Converting: ${item}`);
        
        await sharp(itemPath)
          .webp({ quality: 85 })
          .toFile(outputPath);
        
        console.log(`✓ Converted: ${item} -> ${path.basename(outputPath)}`);
        
        // Optionally delete original file
        // fs.unlinkSync(itemPath);
      } catch (error) {
        console.error(`Error converting ${item}:`, error.message);
      }
    }
  }
}

async function convertPreviewImages() {
  const previewsDir = path.join(portfoliosDir, 'previews');
  
  if (!fs.existsSync(previewsDir)) return;

  const files = fs.readdirSync(previewsDir);

  for (const file of files) {
    const filePath = path.join(previewsDir, file);
    const ext = path.extname(file).toLowerCase();
    
    if (ext === '.webp') continue;
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    try {
      const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      if (fs.existsSync(outputPath)) {
        console.log(`Preview already converted: ${file}`);
        continue;
      }

      console.log(`Converting preview: ${file}`);
      
      await sharp(filePath)
        .webp({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`✓ Converted preview: ${file}`);
    } catch (error) {
      console.error(`Error converting preview ${file}:`, error.message);
    }
  }
}

async function main() {
  console.log('Starting image conversion to WebP...\n');
  
  // Convert preview images
  console.log('Converting preview images...');
  await convertPreviewImages();
  
  console.log('\nConverting portfolio images...');
  await convertImagesToWebP(portfoliosDir);
  
  console.log('\n✓ Conversion complete!');
  console.log('Note: Original files are preserved. Delete them manually if needed.');
}

main().catch(console.error);
