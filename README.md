# MeetMe - AI-Powered Event Planning

Turn your vague event ideas into reality with AI assistance. MeetMe helps you plan every detail of your event, from venue suggestions to custom itineraries.

## Features

### Core Event Planning
- **AI-Powered Event Creation**: Enter a vague idea and let AI generate titles, descriptions, and itineraries
- **Smart Venue Suggestions**: Get contextual venue recommendations based on your event type and location
- **GIPHY Integration**: Browse and select event images from GIPHY's extensive library
- **Event Sharing**: Share events via shareable link, email, or SMS
- **RSVP Tracking**: Track guest responses and attendance in real-time
- **Calendar Integration**: Download .ics files or add directly to Google Calendar with one click

### UI/UX Enhancements
- **Animated Suggestions**: Scrolling text animation showing event ideas on the creation page
- **Google Places Autocomplete**: Real-time address suggestions as you type locations
- **Enhanced Visual Design**: Modern purple gradient theme with polished animations
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Intuitive 4-Step Flow**: Simple wizard-style event creation process

## Recent Updates (January 2026)

### ✨ Enhanced UI/UX
- **Scrolling Suggestions**: Added animated "I want to..." text carousel on event creation page with 5-color gradient
- **Improved Typography**: Increased text sizes and enhanced readability across all pages
- **Polished Animations**: Smoother transitions and gradient effects throughout the app

### 🗺️ Google Places Integration
- **Real-time Autocomplete**: Location input now features Google Places autocomplete with address suggestions
- **Improved UX**: Faster, more accurate location entry for event venues

### 🎨 Visual Refinements
- **Brand Colors Updated**: New purple gradient theme (#9a5ded, #15128f, #e4b9d7, #fdfaff)
- **Consistent Styling**: Unified color scheme across all pages (buttons, progress bars, inputs)
- **Better Contrast**: Enhanced text and UI element visibility

### 📅 Calendar Enhancements
- **RSVP Calendar Integration**: Added Google Calendar and ICS download buttons on RSVP confirmation
- **One-Click Add**: Quick actions to sync events to user's calendar

### 🐛 Bug Fixes
- Fixed Google Maps autocomplete race condition
- Fixed gradient rendering issues on scrolling text
- Fixed text alignment on Create Event page
- Improved script loading reliability

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **React**: Version 19.0.0
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 3.4.17 with custom animations
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **Icons**: Lucide React
- **Fonts**: Inter (headers), Rakkas (brand)

### Backend
- **API**: Next.js API Routes (Node.js runtime)
- **Storage**: In-memory JSON with file persistence (`storage.json`)
- **Authentication**: Mock session-based auth (HTTP-only cookies)

### External APIs
- **GIPHY API**: Real integration for event image selection (optional, falls back to mock)
- **Google Maps Places API**: Real autocomplete for address input
- **AI Service**: Mock AI (template-based, future: OpenAI/Gemini)
- **Email/SMS**: Mock implementations (logs to console)

### Key Libraries
- `date-fns`: Date formatting and manipulation
- `class-variance-authority`: Component variant styling
- `tailwind-merge`: Tailwind class merging utility
- `tailwindcss-animate`: Animation utilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
cd MeetMe
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
# GIPHY API Key (Get from https://developers.giphy.com/)
# Leave empty to use mock data
GIPHY_API_KEY=your_giphy_api_key_here

# Google Maps API Key (Get from https://console.cloud.google.com/)
# Required for Places Autocomplete on location input
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Public API key for client-side Google Maps usage
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**API Setup Instructions:**
- **GIPHY API**: Get a free key from [GIPHY Developers](https://developers.giphy.com/). If no key is provided, mock images will be used.
- **Google Maps API**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable "Maps JavaScript API" and "Places API"
  4. Create credentials (API key)
  5. Add the API key to both `GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

- **Email**: demo@meetme.com
- **Password**: password123

## How to Use

### Creating an Event

1. **Login** with the demo credentials
2. **Step 1**: Enter your event idea (e.g., "gothic birthday party")
3. **Step 2**: Select date and time
4. **Step 3**: Enter location (with Google Places autocomplete) or get AI venue suggestions
   - Start typing an address to see real-time suggestions
   - Or click "Show me some venues!" for AI-powered recommendations
5. **Step 4**: Review and edit AI-generated details
6. **Create**: Click to create your event

### Sharing Your Event

1. Go to your event page
2. Click "Share & Invite Guests"
3. Options available:
   - Copy shareable link
   - Send email invites (mocked - logs to console)
   - Send SMS invites (mocked - logs to console)
   - Download calendar file (.ics)
   - Add to Google Calendar

### RSVPing to an Event

1. Visit the event page or RSVP link
2. Click "RSVP to Event"
3. Fill in your name, email, and attendance status
4. Submit RSVP
5. View updated guest list on event page

## Project Structure

```
meetme/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── create/            # Event creation flow
│   ├── events/            # Event pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities
│   ├── ai-service.ts     # Mock AI service
│   ├── auth.ts           # Authentication
│   ├── calendar.ts       # Calendar integration
│   ├── storage.ts        # Data storage
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Features Not Yet Implemented (Future Enhancements)

- Real PostgreSQL database with Prisma
- Real AI integration (OpenAI/Gemini)
- Google Places API for venue suggestions
- Real email service (Resend)
- Real SMS service (Twilio)
- Full authentication with NextAuth.js
- User dashboard with event management
- Event editing and deletion
- Email/SMS notifications for RSVPs

## Notes

- This is a prototype with mock services for demonstration
- Data is persisted to `storage.json` file in development
- Email and SMS invites are mocked (check browser console)
- GIPHY integration requires an API key for real images
- Google Maps API key is required for address autocomplete

## Brand Colors

The MeetMe brand uses a modern purple color palette:

- **Lightest**: #fdfaff (Off-white background)
- **Light Purple**: #e4b9d7 (Secondary accents)
- **Primary Purple**: #9a5ded (Main brand color - buttons, gradients)
- **Deep Purple**: #15128f (Headers, dark accents)

### Typography
- **Headers**: Inter font family (clean, professional)
- **Brand Font**: Rakkas (used for logo and special branding elements)

## License

This project is for demonstration purposes.
