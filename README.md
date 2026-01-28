# MeetMe - AI-Powered Event Planning

Turn your vague event ideas into reality with AI assistance. MeetMe helps you plan every detail of your event, from venue suggestions to custom itineraries.

## Features

- **AI-Powered Event Creation**: Enter a vague idea and let AI generate titles, descriptions, and itineraries
- **Venue Suggestions**: Get contextual venue recommendations based on your event type and location
- **GIPHY Integration**: Automatic event image selection from GIPHY
- **Event Sharing**: Share events via link, email, or SMS
- **RSVP Tracking**: Track guest responses and attendance
- **Calendar Integration**: Download .ics files or add directly to Google Calendar

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: In-memory JSON storage (file-based persistence)
- **Authentication**: Simple mock authentication
- **APIs**: GIPHY (optional), Mock AI service

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

3. (Optional) Set up GIPHY API key
   - Get a free API key from [GIPHY Developers](https://developers.giphy.com/)
   - Add it to `.env.local`:
   ```
   GIPHY_API_KEY=your_api_key_here
   ```
   - If no API key is provided, mock images will be used

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
4. **Step 3**: Enter location or get AI venue suggestions
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

## Brand Colors

- Primary: #1e7094 (Blue)
- Secondary: #288f42 (Green)
- Background: #ffffff (White)
- Text: #000000 (Black)

## License

This project is for demonstration purposes.
