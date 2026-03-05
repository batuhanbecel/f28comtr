const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const portfoliosDir = path.join(__dirname, '..', 'public', 'portfolios');
const aiImagesDir = path.join(__dirname, '..', 'public', 'ai-images');

async function optimizeImage(inputPath, outputPath, maxWidth = 1200) {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    // Skip if already optimized (width <= maxWidth)
    if (metadata.width <= maxWidth) {
      console.log(`  Already optimized: ${path.basename(inputPath)}`);
      return false;
    }

    console.log(`  Resizing ${metadata.width}px → ${maxWidth}px: ${path.basename(inputPath)}`);
    
    await sharp(inputPath)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ Saved ${savings}% (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(optimizedSize / 1024 / 1024).toFixed(2)}MB)`);
    
    // Replace original with optimized
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    
    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

async function processDirectory(directory, maxWidth = 1200) {
  const items = fs.readdirSync(directory);
  let processed = 0;

  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && item !== 'previews') {
      console.log(`\nProcessing folder: ${item}`);
      processed += await processDirectory(itemPath, maxWidth);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      
      if (ext !== '.webp') continue;
      if (stat.size === 0) continue;

      const tempPath = itemPath.replace('.webp', '.temp.webp');
      const optimized = await optimizeImage(itemPath, tempPath, maxWidth);
      if (optimized) processed++;
    }
  }

  return processed;
}

async function main() {
  console.log('='.repeat(60));
  console.log('IMAGE OPTIMIZATION SCRIPT');
  console.log('Resizing images to max 1200px width for faster loading');
  console.log('='.repeat(60));
  
  let totalProcessed = 0;

  // Process portfolios
  if (fs.existsSync(portfoliosDir)) {
    console.log('\n📁 Processing portfolio images...');
    totalProcessed += await processDirectory(portfoliosDir, 1200);
  }

  // Process AI images
  if (fs.existsSync(aiImagesDir)) {
    console.log('\n📁 Processing AI images...');
    totalProcessed += await processDirectory(aiImagesDir, 1200);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✓ Complete! Optimized ${totalProcessed} images`);
  console.log('='.repeat(60));
}

main().catch(console.error);
