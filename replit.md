# Gelatina Reductora - React PWA

## Overview
A mobile-first Progressive Web App built with React, TypeScript, and Vite. This is a health and wellness product showcase app with a Spanish interface featuring product catalogs, bonuses, and exclusive locked content.

## Project Information
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (inline via className)
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
- PWA installation capability
- Local storage for user preferences
- Daily motivational quotes

## Development
- **Port**: 5000 (configured for Replit)
- **Host**: 0.0.0.0 with allowedHosts set to 'all' for Replit proxy
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build`

## Environment Variables
The app references `GEMINI_API_KEY` in the Vite config but doesn't actively use it in the current implementation. This is likely reserved for future AI features.

## Recent Changes
- 2025-11-26: Initial import and Replit setup
  - Configured Vite to use port 5000
  - Added allowedHosts configuration for Replit proxy compatibility
  - Set up development workflow
