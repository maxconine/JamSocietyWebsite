/**
 * Equipment Image Processing Script
 * 
 * This script processes equipment images for the Jam Society website by:
 * - Resizing images to optimal dimensions
 * - Converting to WebP format for better compression
 * - Maintaining aspect ratios
 * - Creating processed versions in a separate directory
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Directory paths
const SOURCE_DIR = path.join(process.cwd(), 'public', 'equipment-images');
const PROCESSED_DIR = path.join(SOURCE_DIR, 'processed');

/**
 * Image processing configuration
 * Optimized for web performance while maintaining quality
 */
const PROCESSING_OPTIONS = {
  width: 800,        // Maximum width in pixels
  height: 600,       // Maximum height in pixels
  quality: 100,       // WebP quality (0-100)
  format: 'webp' as const // Output format for better compression
};

/**
 * Process a single image file
 * @param inputPath - Path to the source image
 * @param outputPath - Path where the processed image will be saved
 */
async function processImage(inputPath: string, outputPath: string): Promise<void> {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Initialize Sharp with the input image
    const image = sharp(inputPath);
    
    // Get original image metadata for logging
    const metadata = await image.metadata();
    console.log(`Processing ${path.basename(inputPath)}...`);
    console.log(`Original size: ${metadata.width}x${metadata.height}`);

    // Resize the image while maintaining aspect ratio
    image.resize({
      width: PROCESSING_OPTIONS.width,
      height: PROCESSING_OPTIONS.height,
      fit: 'inside',              // Maintain aspect ratio
      withoutEnlargement: true    // Don't enlarge images smaller than target
    });

    // Convert to WebP format for better compression
    image.webp({ quality: PROCESSING_OPTIONS.quality });

    // Save the processed image
    await image.toFile(outputPath);

    // Log file size information
    const stats = await fs.stat(outputPath);
    const fileSizeInKB = stats.size / 1024;
    console.log(`Processed image saved to ${outputPath}`);
    console.log(`File size: ${fileSizeInKB.toFixed(2)} KB\n`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

/**
 * Main function to process all equipment images
 * Scans the source directory for image files and processes them
 */
async function main(): Promise<void> {
  try {
    // Create processed directory if it doesn't exist
    await fs.mkdir(PROCESSED_DIR, { recursive: true });

    // Get all files in the source directory
    const files = await fs.readdir(SOURCE_DIR);
    
    // Filter for supported image formats, excluding already processed files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
      return supportedFormats.includes(ext) && !file.includes('processed');
    });

    console.log(`Found ${imageFiles.length} images to process`);

    // Process each image sequentially to avoid overwhelming the system
    for (const file of imageFiles) {
      const inputPath = path.join(SOURCE_DIR, file);
      const outputPath = path.join(
        PROCESSED_DIR,
        `${path.parse(file).name}_P.webp`  // Add '_P' suffix to processed files
      );
      await processImage(inputPath, outputPath);
    }

    console.log('All images processed successfully!');
  } catch (error) {
    console.error('Error during image processing:', error);
    process.exit(1);
  }
}

// Run the main function
main();