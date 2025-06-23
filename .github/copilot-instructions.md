# Copilot Instructions for Music Player

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js music player application with the following key features:
- **Database**: Supabase for data storage and file management
- **UI Framework**: Bootstrap for responsive, mobile-first design
- **Target Platform**: Primarily iOS mobile devices
- **Core Features**: 
  - MP3 file upload from any source
  - Music playback with controls (play, pause, stop)
  - Playlist management (shuffle, repeat)
  - Song deletion
  - Background playback support for iOS
  - PWA capabilities for native app-like experience

## Technical Stack
- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Bootstrap 5 with custom CSS for mobile optimization
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for MP3 files
- **Audio**: HTML5 Audio API with Media Session API for background playback
- **Deployment**: Vercel

## Development Guidelines
- Prioritize mobile-first responsive design
- Implement proper error handling for file uploads
- Use TypeScript for type safety
- Follow Next.js App Router patterns
- Implement proper SEO and meta tags
- Add PWA manifest for installable app experience
- Ensure accessibility compliance
- Optimize for iOS Safari compatibility

## Key Components to Implement
- Music upload component with drag-and-drop ✅
- Audio player with custom controls ✅
- Playlist management system (future enhancement)
- Mobile-optimized UI components ✅
- Background playback service worker ✅
- Supabase integration utilities ✅
- Error handling and user feedback ✅

## Current Status
- ✅ Project structure created
- ✅ Core components implemented
- ✅ PWA support added
- ✅ Error handling improved
- ⚠️  Database setup required (see TROUBLESHOOTING.md)
- ⚠️  Supabase configuration needs verification

## Quick Setup Checklist
1. Run `supabase/init.sql` in Supabase SQL Editor
2. Create `music-files` storage bucket
3. Verify anon key in .env.local (not service_role key)
4. Test file upload functionality
