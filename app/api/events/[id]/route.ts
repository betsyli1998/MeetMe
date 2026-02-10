import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import { getSessionId } from '@/lib/session';
import { ApiResponse, Event } from '@/types';
import { validateOrigin } from '@/lib/csrf-protection';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const storage = getStorage();
    const event = storage.getEvent(id);

    if (!event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found',
      } as ApiResponse, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: event,
    } as ApiResponse<Event>);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch event',
    } as ApiResponse, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const sessionId = await getSessionId();
    const storage = getStorage();
    const event = storage.getEvent(id);

    if (!event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found',
      } as ApiResponse, { status: 404 });
    }

    // Check if user owns this event
    if (event.sessionId !== sessionId) {
      logger.security('AUTH', 'Unauthorized event edit attempt', {
        eventId: id,
        requestSessionId: sessionId,
        eventSessionId: event.sessionId,
      });
      return NextResponse.json({
        success: false,
        error: 'You can only edit events you created',
      } as ApiResponse, { status: 403 });
    }

    const body = await request.json();
    const { title, description, date, time, location, itinerary } = body;

    // Validate required fields
    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse, { status: 400 });
    }

    // Update event
    const updatedEvent: Event = {
      ...event,
      title,
      description,
      date,
      time,
      location,
      itinerary: itinerary || '',
      updatedAt: new Date().toISOString(),
    };

    const result = storage.updateEvent(id, updatedEvent);

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update event',
      } as ApiResponse, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result,
    } as ApiResponse<Event>);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update event',
    } as ApiResponse, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const sessionId = await getSessionId();
    const storage = getStorage();
    const event = storage.getEvent(id);

    if (!event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found',
      } as ApiResponse, { status: 404 });
    }

    // Check if user owns this event
    if (event.sessionId !== sessionId) {
      return NextResponse.json({
        success: false,
        error: 'You can only delete events you created',
      } as ApiResponse, { status: 403 });
    }

    // Delete event and associated RSVPs
    const deleted = storage.deleteEvent(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete event',
      } as ApiResponse, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Event deleted successfully' },
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete event',
    } as ApiResponse, { status: 500 });
  }
}
