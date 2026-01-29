import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getRateLimiter, RATE_LIMITS } from '@/lib/rate-limiter';
import { ApiResponse, VenueSuggestion } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { query, location } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    // Check rate limit BEFORE calling Google API
    const rateLimiter = getRateLimiter();
    const limitCheck = await rateLimiter.checkLimit(
      session.userId,
      'google-places',
      RATE_LIMITS.GOOGLE_PLACES
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: RATE_LIMITS.GOOGLE_PLACES.message,
          remaining: 0,
          resetAt: limitCheck.resetAt,
        },
        { status: 429 }
      );
    }

    // Get API key
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key not configured');
      return NextResponse.json(
        { success: false, error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Build search query
    let searchQuery = query;
    if (location) {
      searchQuery = `${query} in ${location}`;
    }

    // Call Google Places API (New) - Text Search endpoint
    const url = `https://places.googleapis.com/v1/places:searchText`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.rating,places.photos,places.id',
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places API error:', response.status, data);
      return NextResponse.json(
        { success: false, error: 'Failed to search venues' },
        { status: 500 }
      );
    }

    // Record usage AFTER successful call
    await rateLimiter.recordUsage(session.userId, 'google-places');

    // Transform results to VenueSuggestion format
    const venues: VenueSuggestion[] = (data.places || []).map((place: any) => {
      // Get photo URL if available
      let photoUrl: string | undefined;
      if (place.photos && place.photos.length > 0) {
        // New API format: use photo name to construct URL
        const photoName = place.photos[0].name;
        photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=400`;
      }

      return {
        name: place.displayName?.text || 'Unknown venue',
        address: place.formattedAddress || 'Address not available',
        type: place.types?.[0]?.replace(/_/g, ' ') || 'venue',
        description: `${place.displayName?.text || 'Unknown venue'} - ${place.formattedAddress || 'Address not available'}`,
        placeId: place.id,
        rating: place.rating,
        photoUrl,
      };
    });

    // Calculate remaining searches
    const newLimitCheck = await rateLimiter.checkLimit(
      session.userId,
      'google-places',
      RATE_LIMITS.GOOGLE_PLACES
    );

    const response_data: ApiResponse<{
      venues: VenueSuggestion[];
      remaining: number;
      resetAt: number;
    }> = {
      success: true,
      data: {
        venues,
        remaining: newLimitCheck.remaining,
        resetAt: newLimitCheck.resetAt,
      },
    };

    return NextResponse.json(response_data);
  } catch (error) {
    console.error('Error searching venues:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
