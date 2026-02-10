import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get('photoName');
  const maxWidth = searchParams.get('maxWidth') || '400';

  if (!photoName) {
    return NextResponse.json(
      { success: false, error: 'Photo name required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch image from Google Places API (server-side only)
    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;

    const response = await fetch(photoUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch photo: ${response.statusText}`);
    }

    // Get image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return image to client (API key never exposed)
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error proxying Google Places photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load photo' },
      { status: 500 }
    );
  }
}
