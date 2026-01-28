import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getStorage } from '@/lib/storage';
import { Event, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const {
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

    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse, { status: 400 });
    }

    const storage = getStorage();
    const now = new Date().toISOString();

    const event: Event = {
      id: randomUUID(),
      userId: session.userId,
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

    return NextResponse.json({
      success: true,
      data: createdEvent,
    } as ApiResponse<Event>);
  } catch (error: any) {
    console.error('Error creating event:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      } as ApiResponse, { status: 401 });
    }
    return NextResponse.json({
      success: false,
      error: 'Failed to create event',
    } as ApiResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const storage = getStorage();

    const events = storage.getEventsByUserId(session.userId);

    return NextResponse.json({
      success: true,
      data: events,
    } as ApiResponse<Event[]>);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      } as ApiResponse, { status: 401 });
    }
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch events',
    } as ApiResponse, { status: 500 });
  }
}
