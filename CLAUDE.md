# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

The project goal is to create a website that allows people to enter an event idea that they would like to host and have the website suggest other details to publish the event. Oftentimes, people only have a vague idea of what they want to do. Those ideas could really become a reality with a little bit of AI magic. That’s where MeetMe comes in to fill in the gap and send out an invite so that people can automate the planning part and focus on executing and enjoying the event. 

## Product Requirement Document 

### Workflow
1. **Step 1 - Event Idea & Creator Info**: The user enters their name, email, and a vague event idea (i.e., "my gothic birthday party"). This creates a session for the user (no authentication/login required - just basic info to track event ownership and allow sharing). The name and email are stored in sessionStorage for use throughout the event creation flow.
2. **Step 2 - Date & Time**: The user selects a date and time for the event.
3. **Step 3 - Location/Venue**: The user can either enter a specific location OR request suggestions by typing something like "suggest something for me". If the user opts to get suggestions, ask necessary clarifying questions such as an approximate location (i.e., West LA) to get enough context to suggest a venue. If it's clear what the user wants, then suggest 1-2 venues that closely match the user's preference.
4. **Step 4 - AI-Generated Details**: After a location is selected, the user goes to a page that has the following: event title (automatically suggested based on previous context), event photo (use GIPHY API and suggest based on relevant context and also allow users to browse & replace), an event description (automatically suggested based on previous context), and an event itinerary (automatically suggested based on previous context, optional to keep). The user can edit these fields or create the event.
5. **Sharing & Invites**: After the event is created, a couple options to share and invite guests should be available: link, SMS, email. A calendar invite should be downloadable or quick action to sync to Google Calendar.
6. **RSVP Updates**: When a guest RSVPs, the event page gets updated with the guest names. 

## Designs, Styles, UX Guides
The style of the brand should be modern and invokes a sense of trustworthiness centered around the idea of "letting the us (website) create the event so you can enjoy the event". 

Primary colors should be #1e7094, #288f42, #ffffff, #000000. 

## Engineering Requirement Document

### Current Implementation (Prototype)
The prototype is fully functional with the following stack:

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Brand colors configured: #fdfaff, #e4b9d7, #9a5ded, #15128f
- Brand font: Rakkas

Use the folder ./brand assets for logo

### Backend
- Next.js API Routes
- Node.js runtime

### Database
- In-memory storage with file persistence (`lib/storage.ts`)
- Data persisted to `storage.json` file
- **Future**: Migrate to PostgreSQL with Prisma

### Session Management
- **No authentication required** - Users provide name/email in Step 1 to create events
- Session tracking via `lib/session.ts` and `lib/auth.ts`
- Creator info (name, email) stored with each event for ownership verification
- Session data stored in HTTP-only cookies
- Demo login available at homepage: demo@meetme.com / password123 (for testing protected routes)
- **Future**: Implement NextAuth.js or Clerk for full user accounts

### AI Service
- Mock AI service (`lib/ai-service.ts`)
- Template-based event title/description/itinerary generation
- Contextual venue suggestions
- **Future**: Integrate OpenAI GPT or Google Gemini

### External APIs
- **GIPHY API**: Real integration (optional, falls back to mock)
  - Get API key from https://developers.giphy.com/
  - Set in `.env.local` as `GIPHY_API_KEY`
- **Email/SMS**: Mock implementations (log to console)
  - **Future**: Integrate Resend (email) and Twilio (SMS)

### Calendar Integration
- ICS file generation working (`lib/calendar.ts`)
- Google Calendar link generation working

## Development Commands

### Setup
```bash
npm install                 # Install dependencies
```

### Development
```bash
npm run dev                 # Start dev server (http://localhost:3000)
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript type checking
```

### Environment Variables
Create `.env.local` file:
```
GIPHY_API_KEY=your_key_here           # Optional, uses mock if empty
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture Overview

### Data Flow
1. **Session Creation**: User enters name/email in Step 1 → Session cookie created → Creator info stored in sessionStorage
2. **Event Creation**:
   - Step 1: Collect name, email, event idea → Store in sessionStorage
   - Step 2: Collect date/time → Store in sessionStorage
   - Step 3: Collect location/venue → Store in sessionStorage
   - Step 4: Call AI API → Call GIPHY API → Create event in storage with creator info
3. **Event Display**: Fetch event + RSVPs from storage → Render
4. **RSVP**: Public submission (no auth required) → Update storage → Refresh event guest count

### Key Files

#### Core Infrastructure
- `lib/storage.ts` - In-memory data storage with file persistence
- `lib/auth.ts` - Mock authentication and session management
- `lib/ai-service.ts` - Mock AI event suggestion generator
- `lib/calendar.ts` - ICS file and Google Calendar link generation
- `types/index.ts` - TypeScript type definitions

#### Pages (App Router)
- `app/page.tsx` - Landing page (optional demo login available)
- `app/create/page.tsx` - Step 1: Name, email, and event idea input (creates session)
- `app/create/datetime/page.tsx` - Step 2: Date/time selection
- `app/create/location/page.tsx` - Step 3: Location/venue selection
- `app/create/details/page.tsx` - Step 4: AI-generated details editor
- `app/events/[id]/page.tsx` - Event display page
- `app/events/[id]/share/page.tsx` - Share and invite page
- `app/events/[id]/rsvp/page.tsx` - RSVP form (public, no auth required)

#### API Routes
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/api/events/route.ts` - Create/list events
- `app/api/events/[id]/route.ts` - Get event by ID
- `app/api/ai/suggestions/route.ts` - Generate AI event suggestions
- `app/api/giphy/route.ts` - GIPHY API proxy
- `app/api/venues/suggest/route.ts` - Venue suggestions
- `app/api/rsvp/route.ts` - RSVP creation and retrieval

### State Management
- **Session state**: HTTP-only cookies via Next.js cookies API
- **Event creation flow**: Browser `sessionStorage` (Steps 1-3)
- **Data persistence**: File-based JSON storage (`storage.json`)

### Styling
- Tailwind CSS with custom color palette
- Responsive design (mobile-friendly)
- Consistent spacing and typography
- Brand colors throughout

## Testing the Application

1. **Create Event**: Go to /create and follow the 4-step wizard (no login required)
   - Step 1: Enter name, email, and event idea
   - Step 2: Select date and time
   - Step 3: Choose or get venue suggestions
   - Step 4: Review AI-generated details and create event
2. **View Event**: See all details, image, itinerary, guest list
3. **Share**: Copy links, test calendar downloads
4. **RSVP**: Open RSVP link (no auth required), submit response
5. **Verify**: Check guest list updates on event page
6. **Optional Demo Login**: Use demo@meetme.com / password123 at homepage for testing protected routes

## Known Limitations (Prototype)

- No real database (data in `storage.json` file)
- Mock authentication (not production-ready)
- Mock AI (template-based, not real AI)
- Mock email/SMS (logs to console only)
- No user dashboard
- No event editing/deletion UI
- No image upload (GIPHY only)
- No real-time updates (requires page refresh)

## Future Enhancements

1. Replace in-memory storage with PostgreSQL + Prisma
2. Implement real AI (OpenAI/Gemini)
3. Add Google Places API for venues
4. Integrate Resend (email) and Twilio (SMS)
5. Implement NextAuth.js or Clerk
6. Add user dashboard
7. Add event editing and deletion
8. Add real-time RSVP updates (WebSockets/polling)
9. Deploy to Vercel