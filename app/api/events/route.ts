import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSessionId } from '@/lib/session';
import { getStorage } from '@/lib/storage';
import { Event, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';
import { validateOrigin } from '@/lib/csrf-protection';
import {
  validateEmail,
  validateDate,
  validateTime,
  validateLength,
} from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const originCheck = validateOrigin(request);
    if (!originCheck.valid) {
      logger.security('CSRF', 'Invalid origin blocked', {
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        method: request.method,
        url: request.url,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid request origin' } as ApiResponse,
        { status: 403 }
      );
    }

    const sessionId = await getOrCreateSessionId();
    const body = await request.json();

    const {
      creatorName,
      creatorEmail,
      idea,
      title,
      description,
      date,
      time,
      location,
      venue,
      imageUrl,
      itinerary,
    } = body;

    // Validate required fields
    if (!creatorName || !creatorEmail || !title || !description || !date || !time || !location) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse, { status: 400 });
    }

    // Validate creator name
    const nameValidation = validateLength(creatorName, 'Creator name', 1, 100);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false, error: nameValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate email
    const emailValidation = validateEmail(creatorEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate title
    const titleValidation = validateLength(title, 'Title', 1, 200);
    if (!titleValidation.valid) {
      return NextResponse.json(
        { success: false, error: titleValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate description
    const descValidation = validateLength(description, 'Description', 1, 5000);
    if (!descValidation.valid) {
      return NextResponse.json(
        { success: false, error: descValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate date
    const dateValidation = validateDate(date);
    if (!dateValidation.valid) {
      return NextResponse.json(
        { success: false, error: dateValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate time
    const timeValidation = validateTime(time);
    if (!timeValidation.valid) {
      return NextResponse.json(
        { success: false, error: timeValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate location
    const locationValidation = validateLength(location, 'Location', 1, 500);
    if (!locationValidation.valid) {
      return NextResponse.json(
        { success: false, error: locationValidation.error } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate itinerary (if provided)
    if (itinerary && Array.isArray(itinerary) && itinerary.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Itinerary cannot exceed 20 items' } as ApiResponse,
        { status: 400 }
      );
    }

    const storage = getStorage();
    const now = new Date().toISOString();

    const event: Event = {
      id: randomUUID(),
      sessionId,
      creatorName,
      creatorEmail,
      idea: idea || title,
      title,
      description,
      date,
      time,
      location,
      venue,
      imageUrl,
      itinerary,
      createdAt: now,
      updatedAt: now,
      guestCount: 0,
    };

    const createdEvent = storage.createEvent(event);

    logger.info('EVENT', `Event created: ${createdEvent.id}`, {
      eventId: createdEvent.id,
      sessionId,
      title: createdEvent.title,
    });

    return NextResponse.json({
      success: true,
      data: createdEvent,
    } as ApiResponse<Event>);
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create event',
    } as ApiResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const storage = getStorage();
    const { searchParams } = new URL(request.url);
    const sessionFilter = searchParams.get('session');

    let events: Event[];

    if (sessionFilter === 'mine') {
      // Get events for current session only
      const sessionId = await getOrCreateSessionId();
      events = storage.getEventsBySessionId(sessionId);
    } else {
      // Get all events (for discovery page)
      events = storage.getAllEvents()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50); // Limit to 50 most recent
    }

    return NextResponse.json({
      success: true,
      data: events,
    } as ApiResponse<Event[]>);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch events',
    } as ApiResponse, { status: 500 });
  }
}
