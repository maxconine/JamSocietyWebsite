import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'

/**
 * Vite Configuration for Jam Society Website
 * 
 * This configuration optimizes the build for production deployment with:
 * - React support with fast refresh
 * - Tailwind CSS with PostCSS processing
 * - Code splitting for better performance
 * - Asset optimization and compression
 * - Development server with HMR
 */
export default defineConfig({
  // React plugin for JSX support and fast refresh
  plugins: [react()],
  
  // CSS processing with Tailwind and Autoprefixer
  css: {
    postcss: {
      plugins: [
        tailwindcssPostcss, // Tailwind CSS processing
        autoprefixer        // Automatic vendor prefixing
      ]
    }
  },
  
  // Production build configuration
  build: {
    // Increase chunk size warning limit (useful for large dependencies)
    chunkSizeWarningLimit: 1000,
    
    // Rollup configuration for code splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],     // Core React libraries
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'], // Firebase services
          'ui': ['@headlessui/react', '@heroicons/react']          // UI component libraries
        }
      }
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.log in production
        drop_debugger: true    // Remove debugger statements
      }
    },
    
    // Build optimization
    sourcemap: false,           // Disable sourcemaps for smaller builds
    assetsInlineLimit: 4096,    // Inline assets smaller than 4KB
    cssCodeSplit: true,         // Split CSS into separate files
    reportCompressedSize: false // Disable size reporting for faster builds
  },
  
  // Development server configuration
  server: {
    hmr: {
      overlay: false  // Disable error overlay for cleaner development
    },
    headers: {
      // Disable caching in development
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  
  // Public directory for static assets
  publicDir: 'public'
})
