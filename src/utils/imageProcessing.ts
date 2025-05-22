import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  width: 800,
  height: 600,
  quality: 80,
  format: 'jpeg'
};

export async function processImage(
  inputPath: string,
  outputPath: string,
  options: ImageProcessingOptions = {}
): Promise<string> {
  try {
    // Merge default options with provided options
    const processingOptions = { ...DEFAULT_OPTIONS, ...options };

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Process the image
    const image = sharp(inputPath);
    
    // Resize the image
    image.resize({
      width: processingOptions.width,
      height: processingOptions.height,
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: true // Don't enlarge if image is smaller
    });

    // Convert and compress based on format
    switch (processingOptions.format) {
      case 'jpeg':
        image.jpeg({ quality: processingOptions.quality });
        break;
      case 'png':
        image.png({ quality: processingOptions.quality });
        break;
      case 'webp':
        image.webp({ quality: processingOptions.quality });
        break;
    }

    // Save the processed image
    await image.toFile(outputPath);

    // Get the file size
    const stats = await fs.stat(outputPath);
    const fileSizeInKB = stats.size / 1024;

    console.log(`Processed image saved to ${outputPath}`);
    console.log(`File size: ${fileSizeInKB.toFixed(2)} KB`);

    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Helper function to get the optimal format based on file extension
export function getOptimalFormat(filename: string): 'jpeg' | 'png' | 'webp' {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'png';
  if (ext === '.webp') return 'webp';
  return 'jpeg';
}

// Helper function to generate a unique filename
export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename);
  const baseName = path.basename(originalFilename, ext);
  return `${baseName}_P${ext}`;
} 