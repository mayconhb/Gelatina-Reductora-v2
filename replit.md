# Gelatina Reductora - React PWA

## Overview
A mobile-first Progressive Web App built with React, TypeScript, and Vite. This is a health and wellness product showcase app with a Spanish interface featuring product catalogs, bonuses, and exclusive locked content.

## Project Information
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS (CDN for development)
- **Icons**: Lucide React
- **Target**: Mobile-first responsive design

## Architecture
- **Entry Point**: `index.tsx` renders `App.tsx`
- **Main Components**:
  - `App.tsx`: Main application logic and routing
  - `LoginView.tsx`: User authentication screen
  - `HomeView.tsx`: Main product catalog with carousels
  - `ProfileView.tsx`: User profile management
  - `ProductDetailView.tsx`: Product details overlay
  - `TabBar.tsx`: Bottom navigation

## Key Features
- User login and profile management
- Product carousels with drag-to-scroll functionality
- Locked premium content with upgrade prompts
- Full PWA installation capability with native install prompt
- Fallback installation instructions for iOS (Share → Add to Home Screen) and Android (Menu → Install app)
- Service worker for offline capability
- Local storage for user preferences
- Daily motivational quotes

## Development
- **Port**: 5000 (configured for Replit)
- **Host**: 0.0.0.0 with allowedHosts set to `true` for Replit proxy
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build`

## Deployment
- **Type**: Static site deployment
- **Build Output**: `dist/` directory
- **Build Command**: `npm run build`

## Security Notes
- The app originally referenced `GEMINI_API_KEY` but doesn't use it in the code
- API key exposure risk removed from Vite config to prevent secrets in client bundle
- If API integration is added later, handle secrets server-side or use VITE_ prefixed public variables

## Recent Changes
- 2025-11-26: Initial import and Replit setup
  - Migrated from AI Studio platform to Replit environment
  - Removed AI Studio CDN import maps from index.html
  - Configured Vite to use port 5000 with proper host allowlist
  - Fixed potential security issue by removing API key from client bundle
  - Set up development workflow and static deployment configuration
