import { User, Event, RSVP } from '@/types';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// In-memory storage with optional file persistence
class Storage {
  private users: Map<string, User> = new Map();
  private events: Map<string, Event> = new Map();
  private rsvps: Map<string, RSVP[]> = new Map(); // eventId -> RSVP[]
  private storageFile = join(process.cwd(), 'storage.json');

  constructor() {
    this.initializeMockData();
    // TEMPORARILY DISABLED: File I/O causing blocking issues
    // this.loadFromFile();
  }

  private initializeMockData() {
    // Add mock user
    const mockUser: User = {
      id: '1',
      email: 'demo@meetme.com',
      password: 'password123',
      name: 'Demo User',
    };
    this.users.set(mockUser.id, mockUser);
  }

  private loadFromFile() {
    try {
      if (existsSync(this.storageFile)) {
        const data = JSON.parse(readFileSync(this.storageFile, 'utf-8'));
        if (data.events) {
          Object.entries(data.events).forEach(([id, event]) => {
            this.events.set(id, event as Event);
          });
        }
        if (data.rsvps) {
          Object.entries(data.rsvps).forEach(([eventId, rsvps]) => {
            this.rsvps.set(eventId, rsvps as RSVP[]);
          });
        }
      }
    } catch (error) {
      console.error('Error loading storage from file:', error);
    }
  }

  private saveToFile() {
    try {
      const data = {
        events: Object.fromEntries(this.events),
        rsvps: Object.fromEntries(this.rsvps),
      };
      writeFileSync(this.storageFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving storage to file:', error);
    }
  }

  // User methods
  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Event methods
  createEvent(event: Event): Event {
    this.events.set(event.id, event);
    // TEMPORARILY DISABLED: File I/O causing blocking issues
    // this.saveToFile();
    return event;
  }

  getEvent(id: string): Event | undefined {
    return this.events.get(id);
  }

  getEventsByUserId(userId: string): Event[] {
    return Array.from(this.events.values()).filter(e => e.userId === userId);
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  updateEvent(id: string, updates: Partial<Event>): Event | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.events.set(id, updatedEvent);
    // TEMPORARILY DISABLED: File I/O causing blocking issues
    // this.saveToFile();
    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    const deleted = this.events.delete(id);
    if (deleted) {
      this.rsvps.delete(id);
      // TEMPORARILY DISABLED: File I/O causing blocking issues
      // this.saveToFile();
    }
    return deleted;
  }

  // RSVP methods
  createRSVP(rsvp: RSVP): RSVP {
    const eventRSVPs = this.rsvps.get(rsvp.eventId) || [];
    eventRSVPs.push(rsvp);
    this.rsvps.set(rsvp.eventId, eventRSVPs);

    // Update event guest count
    const event = this.getEvent(rsvp.eventId);
    if (event) {
      const totalGuests = this.getTotalGuestCount(rsvp.eventId);
      this.updateEvent(rsvp.eventId, { guestCount: totalGuests });
    }

    // TEMPORARILY DISABLED: File I/O causing blocking issues
    // this.saveToFile();
    return rsvp;
  }

  getRSVPsByEventId(eventId: string): RSVP[] {
    return this.rsvps.get(eventId) || [];
  }

  getTotalGuestCount(eventId: string): number {
    const rsvps = this.getRSVPsByEventId(eventId);
    return rsvps
      .filter(r => r.attending)
      .reduce((sum, r) => sum + 1 + r.plusOne, 0);
  }
}

// Singleton instance - using globalThis to persist across hot reloads
declare global {
  var __meetme_storage: Storage | undefined;
}

export function getStorage(): Storage {
  if (!globalThis.__meetme_storage) {
    globalThis.__meetme_storage = new Storage();
  }
  return globalThis.__meetme_storage;
}
