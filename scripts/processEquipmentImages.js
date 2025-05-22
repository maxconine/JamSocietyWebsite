import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
const SOURCE_DIR = path.join(process.cwd(), 'public', 'equipment-images');
const PROCESSED_DIR = path.join(SOURCE_DIR, 'processed');
// Image processing options
const PROCESSING_OPTIONS = {
    width: 800, // Max width
    height: 600, // Max height
    quality: 80, // JPEG/WebP quality
    format: 'webp' // Output format
};
async function processImage(inputPath, outputPath) {
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        // Process the image
        const image = sharp(inputPath);
        // Get image metadata
        const metadata = await image.metadata();
        console.log(`Processing ${path.basename(inputPath)}...`);
        console.log(`Original size: ${metadata.width}x${metadata.height}`);
        // Resize the image
        image.resize({
            width: PROCESSING_OPTIONS.width,
            height: PROCESSING_OPTIONS.height,
            fit: 'inside', // Maintain aspect ratio
            withoutEnlargement: true // Don't enlarge if image is smaller
        });
        // Convert to WebP format
        image.webp({ quality: PROCESSING_OPTIONS.quality });
        // Save the processed image
        await image.toFile(outputPath);
        // Get the file size
        const stats = await fs.stat(outputPath);
        const fileSizeInKB = stats.size / 1024;
        console.log(`Processed image saved to ${outputPath}`);
        console.log(`File size: ${fileSizeInKB.toFixed(2)} KB\n`);
    }
    catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}
async function main() {
    try {
        // Create processed directory if it doesn't exist
        await fs.mkdir(PROCESSED_DIR, { recursive: true });
        // Get all image files
        const files = await fs.readdir(SOURCE_DIR);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !file.includes('processed');
        });
        console.log(`Found ${imageFiles.length} images to process`);
        // Process each image
        for (const file of imageFiles) {
            const inputPath = path.join(SOURCE_DIR, file);
            const outputPath = path.join(PROCESSED_DIR, `${path.parse(file).name}_P.webp`);
            await processImage(inputPath, outputPath);
        }
        console.log('All images processed successfully!');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
main();
