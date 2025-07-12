# BYFORT - TikTok Clone

## Overview

BYFORT is a full-stack TikTok-inspired social media application built with React and Express. It features video sharing, user authentication, social interactions (likes, comments, follows), and an admin dashboard. The application uses a monorepo structure with shared components and schemas.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Enhanced Profile Page**: Added avatar, name, bio, statistics, edit profile modal, and video grid layout
- **Monetization System**: Automatically activated for users with 1000+ followers with withdrawal functionality
- **Enhanced Upload Page**: TikTok-style upload interface with video preview, metadata form, and privacy settings
- **Enhanced Inbox Page**: Comprehensive notification system with filtering, search, and interaction tracking
- **Settings Page**: Complete account management including monetization settings, privacy controls, and logout
- **Navigation Improvements**: Updated routing to ensure Upload and Inbox navigate to proper pages instead of video content
- **Mobile Responsive**: All pages now properly support mobile navigation with bottom padding for mobile navbar

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First**: Responsive design with mobile-optimized navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
- **Users**: Authentication, profiles, social stats
- **Videos**: Content metadata, engagement metrics
- **Social Features**: Likes, comments, follows system
- **Admin Features**: User management and content moderation

## Key Components

### Authentication System
- JWT-based authentication with refresh tokens
- Registration and login flows
- Protected routes and middleware
- Admin role-based access control

### Video Management
- Video upload and metadata handling
- Feed algorithms for content discovery
- Engagement tracking (views, likes, comments)
- User-generated content with tagging

### Social Features
- Follow/unfollow system
- Like and comment interactions
- User profiles with statistics
- Content discovery and trending

### Admin Dashboard
- User management and statistics
- Content moderation tools
- Analytics and trending content
- System health monitoring

## Data Flow

1. **Authentication Flow**: User registers/logs in → JWT token issued → Token stored in localStorage → Authenticated requests include Bearer token
2. **Video Upload Flow**: User uploads video → Metadata stored in database → Video accessible through feed
3. **Social Interaction Flow**: User interacts with content → Database updated → Real-time statistics reflected
4. **Admin Operations**: Admin performs actions → Database updated → Changes reflected across platform

## External Dependencies

### UI Components
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- shadcn/ui for pre-built component library

### Database & Storage
- Neon Database for PostgreSQL hosting
- Drizzle ORM for type-safe database operations
- Firebase (configured but not actively used)

### Development Tools
- Vite for build tooling and HMR
- TypeScript for type safety
- ESBuild for production builds

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with TypeScript execution via tsx
- Database migrations through Drizzle Kit
- Environment-based configuration

### Production
- Frontend built to static assets via Vite
- Backend bundled with ESBuild
- PostgreSQL database with connection pooling
- Environment variables for sensitive configuration

### Build Process
- `npm run build`: Creates production build
- `npm run start`: Runs production server
- `npm run dev`: Starts development environment
- `npm run db:push`: Applies database schema changes

The application follows a modern full-stack architecture with type safety throughout, mobile-first design principles, and scalable database design for social media features.