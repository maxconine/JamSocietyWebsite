# Jam Society Website

A modern, fast, and mobile-friendly website for the Harvey Mudd College Jam Society.  
This site provides information about the club, equipment checkout, room reservations, event updates, and more for HMC students.

## Features

- **React + TypeScript + Vite**: Fast, modern frontend stack
- **Firebase Hosting**: Secure, scalable, and reliable hosting
- **Progressive Web App (PWA)**: Installable and works offline
- **SEO Optimized**: Meta tags, sitemap, robots.txt, and structured data
- **Responsive Design**: Looks great on all devices
- **Equipment Checkout**: Track and manage music equipment
- **Room Reservation**: Reserve the jam room for your band or practice
- **Admin Tools**: Manage users, equipment, and events
- **Image Optimization**: Uses WebP and lazy loading for fast performance

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jamsocietywebsite.git
   cd jamsocietywebsite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Make sure you have access to the Firebase project.
   - Run `firebase login` and `firebase use --add` to select the correct project.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure

- `src/` — React components, pages, and logic
- `public/` — Static assets (images, icons, manifest, etc.)
- `functions/` — (Optional) Firebase Cloud Functions
- `firebase.json` — Firebase Hosting configuration
- `vite.config.ts` — Vite build configuration

## Image Processing

For detailed instructions on processing and deploying equipment images, see [IMAGE_PROCESSING_GUIDE.md](./IMAGE_PROCESSING_GUIDE.md).

### Quick Commands:
```bash
# Process all equipment images
npx tsx scripts/processEquipmentImages.ts

# Build and deploy
npm run build
firebase deploy --only hosting
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

## Credits

- Harvey Mudd College Jam Society
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
