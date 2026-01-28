// User types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would be hashed
}

export interface Session {
  userId: string;
  email: string;
  name: string;
}

// Event types
export interface Event {
  id: string;
  userId: string;
  idea: string; // Original event idea input
  title: string; // AI-generated or user-edited title
  description: string; // AI-generated or user-edited description
  date: string; // ISO date string
  time: string; // HH:MM format
  location: string;
  venue?: VenueSuggestion;
  imageUrl?: string; // GIPHY image URL
  itinerary?: string; // Optional AI-generated itinerary
  createdAt: string;
  updatedAt: string;
  guestCount: number;
}

// Venue suggestion types
export interface VenueSuggestion {
  name: string;
  address: string;
  type: string;
  description: string;
}

// RSVP types
export interface RSVP {
  id: string;
  eventId: string;
  name: string;
  email: string;
  attending: boolean;
  plusOne: number;
  createdAt: string;
}

// AI Suggestion types
export interface AIEventSuggestion {
  title: string;
  description: string;
  itinerary: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Event creation workflow state
export interface EventCreationState {
  step: 1 | 2 | 3 | 4;
  idea?: string;
  date?: string;
  time?: string;
  location?: string;
  venue?: VenueSuggestion;
  suggestedVenues?: VenueSuggestion[];
}

// GIPHY types
export interface GiphyImage {
  id: string;
  url: string;
  title: string;
  images: {
    original: {
      url: string;
    };
    downsized: {
      url: string;
    };
  };
}

export interface GiphySearchResponse {
  data: GiphyImage[];
}
