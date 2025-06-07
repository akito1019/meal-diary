# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Meal Diary** is a Japanese food tracking web application built for fitness enthusiasts. It leverages AI image recognition to automatically identify food and estimate nutritional content (calories, protein, fat, carbs) from photos.

## Commands

### Development
```bash
npm run dev         # Start development server on localhost:3000
npm run build       # Build for production 
npm start          # Start production server
npm run lint       # Run ESLint checks
```

### Code Quality
When making changes, always run `npm run lint` to check for errors. The project uses ESLint with Next.js configuration.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **UI Framework**: Mantine v8 (replacing Tailwind CSS)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI Vision API for food recognition
- **Auth**: Supabase Auth with email/password and Google OAuth

### Key Architecture Patterns

#### Directory Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable components organized by domain
- `hooks/` - Custom React hooks for data fetching and state management
- `lib/` - External service configurations (Supabase, OpenAI)
- `types/` - TypeScript type definitions
- `utils/` - Pure utility functions

#### Component Organization
Components are organized by domain, not by type:
- `components/auth/` - Authentication components
- `components/meals/` - Meal recording and display
- `components/meal-types/` - Meal type management
- `components/ai/` - AI analysis results
- `components/nutrition/` - Nutritional information display
- `components/common/` - Shared UI components

#### Data Flow
1. **API Layer**: RESTful endpoints in `app/api/`
2. **Hooks Layer**: Custom hooks in `hooks/` handle data fetching and caching
3. **Component Layer**: React components consume data via hooks

### Database Schema (Supabase)
- `profiles` - User profile information
- `meals` - Food entries with nutritional data and images
- `meal_types` - User-customizable meal categories (breakfast, lunch, protein, etc.)
- `meal_suggestions` - AI recognition candidates with confidence scores

### Authentication Flow
- Uses Supabase Auth with Row Level Security (RLS)
- All data is automatically scoped to authenticated users
- Auth context provided via `components/providers/auth-provider.tsx`

### AI Integration
- Images uploaded to Supabase Storage
- OpenAI Vision API analyzes food images
- Custom prompts in `lib/ai/prompts.ts` optimize recognition accuracy
- Results processed through `hooks/useAI.ts`

## Important Implementation Notes

### Mantine UI Framework
The project uses Mantine v8 components. When adding new UI elements:
- Import from `@mantine/core`
- Use Mantine's responsive props: `{ base: 1, sm: 2, md: 3 }`
- Follow Mantine's theming system for colors and spacing

### Icon Usage
Icons use `@tabler/icons-react`. Common available icons:
- `IconFlame` (not `IconFire`) for calories
- `IconChartLine` (not `IconChart`) for statistics
- Always check availability before using new icons

### API Route Handlers
API routes follow Next.js App Router patterns:
- Use `NextRequest` and `NextResponse`
- Route parameters are `Promise<{ param: string }>` in Next.js 15+
- Always destructure params: `const { id } = await params`

### Image Handling
- Use Next.js `Image` component, not `<img>` tags
- All images require meaningful `alt` attributes
- Images stored in Supabase Storage with user-scoped paths

### State Management
- No global state management library
- Use React hooks and context for state
- Data fetching handled by custom hooks with built-in caching

### Error Handling
- Use the `Toast` system for user notifications
- API errors return standardized JSON responses
- Client-side error boundaries catch React errors

## Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anonymous key
OPENAI_API_KEY=                    # OpenAI API key for image analysis
```

## Key Files to Understand

### Core Hooks
- `hooks/use-meals.ts` - Meal CRUD operations
- `hooks/use-meal-types.ts` - Meal type management  
- `hooks/useAI.ts` - AI image analysis

### Main Components
- `app/components/layout/AppLayout.tsx` - App shell with navigation
- `components/meals/meal-form.tsx` - Meal creation/editing form
- `components/ai/AIImageAnalyzer.tsx` - AI analysis interface

### API Integration
- `lib/supabase/client.ts` - Client-side Supabase config
- `lib/supabase/server.ts` - Server-side Supabase config
- `lib/openai/client.ts` - OpenAI API client

## Development Guidelines

### TypeScript
- Strict mode enabled
- All components must be properly typed
- Use `types/database.ts` for Supabase schema types
- Define component prop interfaces

### React Patterns
- Prefer function components with hooks
- Use `useCallback` for functions in dependency arrays
- Implement proper error boundaries
- Follow React's recommended patterns for data fetching

### Performance
- Images are optimized with Next.js Image component
- Components use proper React.memo where beneficial
- API responses are cached appropriately
- Lazy loading implemented for large lists