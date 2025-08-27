# Image Processing & Deployment Guide

This guide covers how to process equipment images and deploy them to your Jam Society website.

## 📁 File Structure

```
JamSocietyWebsite/
├── public/
│   └── equipment-images/
│       ├── [original images] (.jpg, .png, etc.)
│       └── processed/
│           └── [processed images] (_P.webp)
├── scripts/
│   ├── processEquipmentImages.ts    # Process all images
│   └── processRolandImage.ts        # Process single image (if needed)
└── dist/                           # Build output (auto-generated)
    └── equipment-images/
        └── processed/
```

## 🖼️ Image Processing Workflow

### Option 1: Process All Images
```bash
# Run the main processing script
npx tsx scripts/processEquipmentImages.ts
```

### Option 2: Process a Single Image
```bash
# Create a single image script (if needed)
# Edit scripts/processRolandImage.ts to target specific image
npx tsx scripts/processRolandImage.ts
```

### What the Script Does:
- **Resizes**: Max 800x600 pixels (maintains aspect ratio)
- **Converts**: JPEG/PNG → WebP format
- **Optimizes**: 80% quality for good balance of size/quality
- **Saves**: To `public/equipment-images/processed/` with `_P.webp` suffix

### Example Output:
- Original: `roland_fp_30x.jpg` (1500x788, ~100KB)
- Processed: `roland_fp_30x_P.webp` (800x421, ~20KB)

## 🚀 Deployment Process

### Step 1: Build the Project
```bash
npm run build
```
This command:
- Builds your React app
- Copies all images from `public/equipment-images/` to `dist/equipment-images/`
- Copies all processed images to `dist/equipment-images/processed/`

### Step 2: Deploy to Firebase
```bash
firebase deploy --only hosting
```

### Step 3: Verify Deployment
- Check your website: https://jamsoc-2473e.web.app
- Images will be available at: `/equipment-images/processed/[filename]_P.webp`

## 🔧 Creating Custom Processing Scripts

If you need to process a specific image, create a new script:

```typescript
// scripts/processSpecificImage.ts
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const SOURCE_DIR = path.join(process.cwd(), 'public', 'equipment-images');
const PROCESSED_DIR = path.join(SOURCE_DIR, 'processed');

async function main() {
  const targetImage = 'your-image-name.jpg'; // Change this
  const inputPath = path.join(SOURCE_DIR, targetImage);
  const outputPath = path.join(PROCESSED_DIR, 'your-image-name_P.webp'); // Change this

  // Check if file exists
  try {
    await fs.access(inputPath);
  } catch (error) {
    console.error(`Error: File ${targetImage} not found`);
    process.exit(1);
  }

  // Process the image
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  image.resize({
    width: 800,
    height: 600,
    fit: 'inside',
    withoutEnlargement: true
  });

  image.webp({ quality: 80 });
  await image.toFile(outputPath);
  
  console.log(`Processed ${targetImage} successfully!`);
}

main();
```

## 📋 Quick Reference Commands

### Process & Deploy New Images
```bash
# 1. Process images
npx tsx scripts/processEquipmentImages.ts

# 2. Build project
npm run build

# 3. Deploy to website
firebase deploy --only hosting
```

### Check Image Status
```bash
# List original images
ls public/equipment-images/*.jpg

# List processed images
ls public/equipment-images/processed/*.webp

# Check build output
ls dist/equipment-images/processed/
```

### Troubleshooting
```bash
# If build fails, clean and rebuild
rm -rf dist/
npm run build

# If deployment fails, check Firebase login
firebase login

# Check Firebase project
firebase projects:list
```

## 🎯 Best Practices

### Image Preparation
- Use high-quality source images (JPG/PNG)
- Keep original files in `public/equipment-images/`
- Processed files go in `public/equipment-images/processed/`

### File Naming
- Original: `equipment-name.jpg`
- Processed: `equipment-name_P.webp`
- Use underscores, not spaces

### Quality Settings
- **Width**: 800px max
- **Height**: 600px max
- **Quality**: 80% (good balance)
- **Format**: WebP (better compression)

## 🔄 Workflow Summary

1. **Add new images** to `public/equipment-images/`
2. **Process images** with `npx tsx scripts/processEquipmentImages.ts`
3. **Build project** with `npm run build`
4. **Deploy** with `firebase deploy --only hosting`
5. **Verify** on your website

## 📞 Need Help?

- **Build issues**: Check `package.json` scripts
- **Deployment issues**: Check Firebase console
- **Image quality**: Adjust quality settings in script
- **File not found**: Check file paths and naming

---

**Last Updated**: August 2024
**Website**: https://jamsoc-2473e.web.app 