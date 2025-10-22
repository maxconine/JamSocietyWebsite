# Jam Society Website

A modern, fast, and mobile-friendly website for the Harvey Mudd College Jam Society.  
This site provides information about the club, equipment checkout, room reservations, event updates, and more for HMC students.

## 🚀 Features

- **React + TypeScript + Vite**: Fast, modern frontend stack with hot module replacement
- **Firebase Integration**: Authentication, Firestore database, and Cloud Storage
- **Progressive Web App (PWA)**: Installable and works offline with service workers
- **SEO Optimized**: Meta tags, sitemap, robots.txt, and structured data for search engines
- **Responsive Design**: Mobile-first design that looks great on all devices
- **Equipment Management**: Track and manage music equipment with admin controls
- **Room Reservation System**: Reserve the jam room for bands and practice sessions
- **Admin Dashboard**: Manage users, equipment, and events with role-based access
- **Image Optimization**: WebP format and lazy loading for optimal performance
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

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

## 📁 Project Structure

```
JamSocietyWebsite/
├── src/                          # Source code
│   ├── components/               # Reusable React components
│   ├── pages/                   # Page components (Home, Equipment, etc.)
│   ├── contexts/                # React context providers
│   ├── firebase/               # Firebase configuration and utilities
│   ├── data/                   # Static data files
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets (images, icons, manifest)
├── scripts/                    # Build and utility scripts
├── functions/                  # Firebase Cloud Functions
├── dist/                       # Production build output
├── firebase.json              # Firebase Hosting configuration
├── vite.config.ts             # Vite build configuration
└── package.json               # Dependencies and scripts
```

### Key Directories

- **`src/components/`** — Reusable UI components (NavBar, Footer, etc.)
- **`src/pages/`** — Main application pages (Home, Equipment, Admin, etc.)
- **`src/firebase/`** — Firebase configuration and authentication utilities
- **`public/`** — Static assets served directly (images, favicon, manifest)
- **`scripts/`** — Build utilities and image processing scripts

## Image Processing

For detailed instructions on processing and deploying equipment images, see [IMAGE_PROCESSING_GUIDE.md](./IMAGE_PROCESSING_GUIDE.md).

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Image Processing
npm run process-images   # Process equipment images to WebP
npm run watch-images     # Watch and process images automatically

# Build Process
npm run build:types      # Compile TypeScript
npm run build:app        # Build Vite application
npm run build:assets     # Copy static assets to dist
```

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
