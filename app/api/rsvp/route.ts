import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import { RSVP, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      data: createdRSVP,
    } as ApiResponse<RSVP>);
  } catch (error) {
    console.error('Error creating RSVP:', error);
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
