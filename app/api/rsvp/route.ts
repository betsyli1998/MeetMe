import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import { RSVP, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';
import { checkIPRateLimit, getClientIP } from '@/lib/rate-limiter';
import { validateOrigin } from '@/lib/csrf-protection';
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

    // Rate limiting: 5 RSVPs per IP per minute
    const clientIP = getClientIP(request);
    const rateLimit = checkIPRateLimit(clientIP, 5, 60000);

    if (!rateLimit.allowed) {
      logger.security('RSVP', 'Rate limit exceeded', {
        ip: clientIP,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Too many RSVP attempts. Please try again later.',
        } as ApiResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { eventId, name, email, attending, plusOne } = body;

    if (!eventId || !name || !email || attending === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse, { status: 400 });
    }

    const storage = getStorage();
    const event = storage.getEvent(eventId);

    if (!event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found',
      } as ApiResponse, { status: 404 });
    }

    // Get existing RSVPs for this event
    const existingRSVPs = storage.getRSVPsByEventId(eventId);

    // Check for duplicate RSVP (one per email per event)
    const duplicateRSVP = existingRSVPs.find(
      (rsvp) => rsvp.email.toLowerCase() === email.toLowerCase()
    );

    if (duplicateRSVP) {
      logger.security('RSVP', 'Duplicate RSVP attempt', {
        eventId,
        email,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'You have already RSVP\'d to this event. Contact the organizer to update your response.',
        } as ApiResponse,
        { status: 409 } // Conflict
      );
    }

    const rsvp: RSVP = {
      id: randomUUID(),
      eventId,
      name,
      email,
      attending,
      plusOne: plusOne || 0,
      createdAt: new Date().toISOString(),
    };

    const createdRSVP = storage.createRSVP(rsvp);

    logger.info('RSVP', `RSVP created for event ${eventId}`, {
      eventId,
      email,
      attending,
    });

    return NextResponse.json({
      success: true,
      data: createdRSVP,
    } as ApiResponse<RSVP>);
  } catch (error) {
    logger.error('RSVP', 'RSVP creation failed', { error });
    return NextResponse.json({
      success: false,
      error: 'Failed to create RSVP',
    } as ApiResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({
        success: false,
        error: 'Event ID is required',
      } as ApiResponse, { status: 400 });
    }

    const storage = getStorage();
    const rsvps = storage.getRSVPsByEventId(eventId);

    return NextResponse.json({
      success: true,
      data: rsvps,
    } as ApiResponse<RSVP[]>);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch RSVPs',
    } as ApiResponse, { status: 500 });
  }
}
