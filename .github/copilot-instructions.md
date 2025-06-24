# Copilot - **Core Features**: 
  - MP3 file upload from any source
  - Music playback with controls (play, pause, stop)
  - Playlist management (shuffle, repeat)
  - Background playback support for iOS
  - PWA capabilities for native app-like experience
  - Admin-only song management via Supabase dashboardtions for Music Player

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js music player application with the following key features:
- **Database**: Supabase for data storage and file management
- **UI Framework**: Bootstrap for responsive, mobile-first design
- **Theme**: Consistent dark theme with orange primary colors
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
- **Styling**: Bootstrap 5 with custom dark theme CSS
- **Theme Colors**: Dark background (#1e1e1e) with orange primary (#ff9230)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for MP3 files
- **Audio**: HTML5 Audio API with Media Session API for background playback
- **Deployment**: Vercel

## Development Guidelines
- Prioritize mobile-first responsive design
- Use consistent dark theme with orange primary colors (#ff9230)
- Implement proper error handling for file uploads
- Use TypeScript for type safety
- Follow Next.js App Router patterns
- Implement proper SEO and meta tags
- Add PWA manifest for installable app experience
- Ensure accessibility compliance
- Optimize for iOS Safari compatibility
- Keep codebase clean and production-ready
- Remove debug/test components from production builds
- Prevent anonymous users from deleting content (admin-only operations)

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
- ✅ Database integrated and working
- ✅ Clean production-ready codebase
- ✅ All debug tools removed

## Quick Setup Checklist
1. Run `supabase/init.sql` in Supabase SQL Editor
2. Create `music-files` storage bucket
3. Verify anon key in .env.local (not service_role key)
4. Deploy and enjoy your music player!
