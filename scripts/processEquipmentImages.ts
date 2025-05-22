import path from 'path';
import fs from 'fs/promises';
import { processImage, getOptimalFormat, generateUniqueFilename } from '../src/utils/imageProcessing.ts';

const EQUIPMENT_IMAGES_DIR = path.join(process.cwd(), 'public', 'equipment-images');
const PROCESSED_IMAGES_DIR = path.join(process.cwd(), 'public', 'equipment-images', 'processed');

async function processAllEquipmentImages() {
  try {
    // Create processed directory if it doesn't exist
    await fs.mkdir(PROCESSED_IMAGES_DIR, { recursive: true });

    // Get all image files
    const files = await fs.readdir(EQUIPMENT_IMAGES_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && 
      !file.includes('processed')
    );

    console.log(`Found ${imageFiles.length} images to process`);

    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(EQUIPMENT_IMAGES_DIR, file);
      const outputFilename = generateUniqueFilename(file);
      const outputPath = path.join(PROCESSED_IMAGES_DIR, outputFilename);

      console.log(`Processing ${file}...`);
      
      await processImage(inputPath, outputPath, {
        format: getOptimalFormat(file),
        quality: 80,
        width: 800,
        height: 600
      });
    }

    console.log('All images processed successfully!');
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

// Run the script
processAllEquipmentImages(); 