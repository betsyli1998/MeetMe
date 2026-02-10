import { AIEventSuggestion, VenueSuggestion } from '@/types';
import { generateEventDetails, generateVenueSuggestions as geminiVenues } from './gemini-service';

// AI service with Gemini integration and template fallback
export class AIService {
  private static eventTitleTemplates = {
    birthday: [
      "{theme} Birthday Celebration",
      "{theme} Birthday Bash",
      "A {theme} Birthday Experience",
      "{theme} Birthday Party",
    ],
    wedding: [
      "{theme} Wedding Celebration",
      "{theme} Wedding Ceremony",
      "A {theme} Wedding",
    ],
    corporate: [
      "{theme} Corporate Event",
      "{theme} Business Gathering",
      "{theme} Team Event",
    ],
    casual: [
      "{theme} Get-Together",
      "{theme} Social Event",
      "{theme} Gathering",
      "A {theme} Evening",
    ],
  };

  private static descriptionTemplates = {
    birthday: "Join us for an unforgettable {theme} birthday celebration! We're bringing together friends and family for a special day filled with joy, laughter, and memories. This event promises to be a unique experience that reflects the personality and style of our guest of honor.",
    wedding: "You're invited to celebrate the union of two hearts in a {theme} wedding ceremony. Join us for this special day as we embark on a new journey together, surrounded by love, joy, and the people who matter most.",
    corporate: "Join us for a {theme} corporate event designed to bring our team together. This gathering will provide an excellent opportunity for networking, collaboration, and team building in a professional yet relaxed atmosphere.",
    casual: "Come join us for a {theme} gathering! This casual event is all about good vibes, great company, and making memories. Whether you're looking to catch up with old friends or make new ones, this is the perfect occasion.",
  };

  private static itineraryTemplates = {
    formal: [
      "6:00 PM - Arrival and Welcome Reception",
      "7:00 PM - Main Event Begins",
      "8:00 PM - Dinner Service",
      "9:00 PM - Entertainment and Activities",
      "11:00 PM - Event Concludes",
    ],
    casual: [
      "Doors open - Arrive anytime!",
      "Food and drinks available throughout",
      "Activities and entertainment",
      "Socializing and mingling",
      "Event wraps up around closing time",
    ],
    party: [
      "7:00 PM - Doors Open",
      "7:30 PM - Welcome and Introductions",
      "8:00 PM - Games and Activities Begin",
      "9:00 PM - Cake/Food Service",
      "10:00 PM - Dancing and Music",
      "12:00 AM - Event Ends",
    ],
  };

  static async generateEventSuggestion(
    idea: string,
    location: string,
    date: string,
    time: string
  ): Promise<AIEventSuggestion> {
    try {
      // Try Gemini first
      const datetime = `${date} at ${time}`;
      const geminiResult = await generateEventDetails(idea, location, datetime);

      // Transform Gemini response to match AIEventSuggestion format
      return {
        title: geminiResult.title,
        description: geminiResult.description,
        itinerary: geminiResult.itinerary
          .map((item: any) => `${item.time} - ${item.activity}`)
          .join('\n')
      };
    } catch (error) {
      console.warn('Gemini generation failed, using template fallback:', error);
      // Fall back to existing template logic
      return this.generateEventSuggestionTemplate(idea, location, date, time);
    }
  }

  private static generateEventSuggestionTemplate(
    idea: string,
    location: string,
    date: string,
    time: string
  ): AIEventSuggestion {
    const lowerIdea = idea.toLowerCase();

    // Determine event type
    let eventType: keyof typeof this.eventTitleTemplates = 'casual';
    if (lowerIdea.includes('birthday') || lowerIdea.includes('bday')) {
      eventType = 'birthday';
    } else if (lowerIdea.includes('wedding') || lowerIdea.includes('marriage')) {
      eventType = 'wedding';
    } else if (lowerIdea.includes('corporate') || lowerIdea.includes('business') || lowerIdea.includes('work')) {
      eventType = 'corporate';
    }

    // Extract theme from idea
    const theme = this.extractTheme(idea);

    // Generate title
    const titleTemplates = this.eventTitleTemplates[eventType];
    const titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    const title = titleTemplate.replace('{theme}', theme);

    // Generate description
    const descriptionTemplate = this.descriptionTemplates[eventType];
    const description = descriptionTemplate.replace('{theme}', theme.toLowerCase());

    // Generate itinerary
    const itineraryType = this.getItineraryType(lowerIdea);
    const itineraryLines = this.itineraryTemplates[itineraryType];
    const itinerary = itineraryLines.join('\n');

    return {
      title,
      description,
      itinerary,
    };
  }

  static extractTheme(idea: string): string {
    // Extract meaningful words and capitalize them
    const stopWords = ['a', 'an', 'the', 'my', 'for', 'to', 'in', 'on', 'at'];
    const words = idea
      .split(' ')
      .filter(word => !stopWords.includes(word.toLowerCase()))
      .map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // If too long, take first few words
    if (words.length > 3) {
      return words.slice(0, 3).join(' ');
    }

    return words.join(' ') || 'Special';
  }

  static getItineraryType(idea: string): keyof typeof this.itineraryTemplates {
    if (idea.includes('formal') || idea.includes('elegant') || idea.includes('gala')) {
      return 'formal';
    } else if (idea.includes('party') || idea.includes('celebration') || idea.includes('bash')) {
      return 'party';
    }
    return 'casual';
  }

  static async generateVenueSuggestions(
    idea: string,
    approximateLocation: string
  ): Promise<VenueSuggestion[]> {
    try {
      // Try Gemini first
      const geminiResult = await geminiVenues(idea, approximateLocation);

      // Transform to VenueSuggestion format
      return geminiResult.venues.map((v: any) => ({
        name: v.name,
        address: approximateLocation, // Generic address
        type: v.type,
        description: v.reason
      }));
    } catch (error) {
      console.warn('Gemini venue generation failed, using template fallback:', error);
      // Fall back to existing template logic
      return this.generateVenueSuggestionsTemplate(idea, approximateLocation);
    }
  }

  private static generateVenueSuggestionsTemplate(
    idea: string,
    approximateLocation: string
  ): VenueSuggestion[] {
    const lowerIdea = idea.toLowerCase();
    const venues: VenueSuggestion[] = [];

    if (lowerIdea.includes('gothic') || lowerIdea.includes('dark') || lowerIdea.includes('alternative')) {
      venues.push({
        name: `The Victorian Room - ${approximateLocation}`,
        address: `123 Gothic Ave, ${approximateLocation}`,
        type: 'Event Space',
        description: 'Dark, moody event space with vintage Victorian decor, perfect for gothic-themed celebrations',
      });
      venues.push({
        name: `Underground Lounge - ${approximateLocation}`,
        address: `456 Shadow St, ${approximateLocation}`,
        type: 'Bar/Lounge',
        description: 'Alternative venue with industrial vibes and dim lighting for unique celebrations',
      });
    } else if (lowerIdea.includes('elegant') || lowerIdea.includes('formal') || lowerIdea.includes('wedding')) {
      venues.push({
        name: `The Grand Ballroom - ${approximateLocation}`,
        address: `789 Elegance Blvd, ${approximateLocation}`,
        type: 'Ballroom',
        description: 'Sophisticated venue with crystal chandeliers and elegant decor',
      });
      venues.push({
        name: `Garden Estate - ${approximateLocation}`,
        address: `321 Garden Way, ${approximateLocation}`,
        type: 'Outdoor Venue',
        description: 'Beautiful garden setting with indoor/outdoor options',
      });
    } else if (lowerIdea.includes('casual') || lowerIdea.includes('fun') || lowerIdea.includes('party')) {
      venues.push({
        name: `The Social Hub - ${approximateLocation}`,
        address: `555 Party Lane, ${approximateLocation}`,
        type: 'Event Space',
        description: 'Modern, casual venue perfect for social gatherings and parties',
      });
      venues.push({
        name: `Rooftop Terrace - ${approximateLocation}`,
        address: `888 Sky View Dr, ${approximateLocation}`,
        type: 'Rooftop Venue',
        description: 'Open-air rooftop space with city views and relaxed atmosphere',
      });
    } else {
      // Default venues
      venues.push({
        name: `The Event Space - ${approximateLocation}`,
        address: `100 Main St, ${approximateLocation}`,
        type: 'Multi-Purpose Venue',
        description: 'Versatile event space suitable for various occasions',
      });
      venues.push({
        name: `Community Center - ${approximateLocation}`,
        address: `200 Center Dr, ${approximateLocation}`,
        type: 'Community Space',
        description: 'Affordable, flexible space perfect for community gatherings',
      });
    }

    return venues.slice(0, 2);
  }
}
