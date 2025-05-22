import chokidar from 'chokidar';
import path from 'path';
import { processImage, getOptimalFormat, generateUniqueFilename } from '../src/utils/imageProcessing.ts';

const EQUIPMENT_IMAGES_DIR = path.join(process.cwd(), 'public', 'equipment-images');
const PROCESSED_IMAGES_DIR = path.join(process.cwd(), 'public', 'equipment-images', 'processed');

async function processNewImage(filePath: string) {
  try {
    const filename = path.basename(filePath);
    
    // Skip if it's already in the processed directory
    if (filePath.includes('processed')) {
      return;
    }

    // Skip if it's not an image file
    if (!/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      return;
    }

    console.log(`New image detected: ${filename}`);
    
    const outputFilename = generateUniqueFilename(filename);
    const outputPath = path.join(PROCESSED_IMAGES_DIR, outputFilename);

    await processImage(filePath, outputPath, {
      format: getOptimalFormat(filename),
      quality: 80,
      width: 800,
      height: 600
    });

    console.log(`Successfully processed ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Initialize watcher
const watcher = chokidar.watch(EQUIPMENT_IMAGES_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: false
});

// Add event listeners
watcher
  .on('add', processNewImage)
  .on('error', error => console.error('Watcher error:', error));

console.log('Watching for new equipment images...');
console.log('Press Ctrl+C to stop watching'); 