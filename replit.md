# EduConnect - Educational Platform

## Overview

EduConnect is a comprehensive educational platform that connects students, parents, educators, and content creators in a unified learning ecosystem. The platform provides AI-powered tutoring, content marketplace, progress tracking, and communication tools for K-12+ education. Built with modern web technologies, it features role-based dashboards and real-time messaging capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables and dark mode support
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server (temporarily disconnected; frontend runs via Vite)
- **Database**: SQLite with Drizzle ORM for type-safe database operations
- **Authentication**: OpenID Connect integration with Replit Auth using Passport.js
- **Session Management**: Express sessions stored in PostgreSQL with connect-pg-simple
- **API Design**: RESTful endpoints with WebSocket support for real-time features

### Data Storage Solutions
- **Primary Database**: SQLite file database (`./data/learnlink.db`)
- **ORM**: Drizzle with migrations managed through drizzle-kit
- **Schema Design**: Comprehensive educational data model including:
  - User management with role-based access (student, parent, educator, content_creator, administrator)
  - Course and content management with hierarchical structure
  - Assessment and grading systems
  - Progress tracking and analytics
  - Messaging and communication features
  - Subscription and payment tracking

### Authentication and Authorization
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: Secure server-side sessions with PostgreSQL backend
- **Role-Based Access**: Multi-tier user roles with specific permissions
- **Security**: HTTPS enforcement, secure cookies, and CSRF protection

## External Dependencies

### AI Services
- **Anthropic Claude**: AI tutoring, content generation, and automated grading
- **Model**: Claude Sonnet 4 (claude-sonnet-4-20250514) for latest capabilities
- **Use Cases**: Personalized tutoring sessions, assignment grading, content recommendations

### Database Infrastructure
- **SQLite**: Local file-based database for development
- **Migrations**: Run `npm run db:generate` then `npm run db:migrate` after schema changes

### Development Tools
- **Replit Integration**: Development environment with live reload and error overlays
- **Build Pipeline**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript coverage across frontend and backend

### UI Components
- **Radix UI**: Accessible component primitives for complex interactions
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide Icons**: Consistent iconography throughout the application

### Communication
- **WebSocket**: Real-time messaging and notifications
- **Email Integration**: Planned for notifications and communication features