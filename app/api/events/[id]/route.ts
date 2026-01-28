import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import { ApiResponse, Event } from '@/types';

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
