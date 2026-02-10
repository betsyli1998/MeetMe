import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
import { ApiResponse, VenueSuggestion } from '@/types';
import { checkIPRateLimit, getClientIP } from '@/lib/rate-limiter';
import { parseVenueContext } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  try {
    // IP-based rate limiting: 10 requests per minute
    const clientIP = getClientIP(request);
    const rateLimit = checkIPRateLimit(clientIP, 10, 60000);

    if (!rateLimit.allowed) {
      console.warn(`[SECURITY] Venue API rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again in a moment.',
        } as ApiResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      );
    }

    const { idea, approximateLocation } = await request.json();

    if (!idea || !approximateLocation) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    // Try to parse venue context from approximate location
    // e.g., "speakeasy west LA" → venueType: "speakeasy", location: "West LA"
    let venueType = idea;
    let location = approximateLocation;

    try {
      const parsed = await parseVenueContext(approximateLocation);
      if (parsed.venueType) {
        // Use parsed venue type if available, otherwise keep original idea
        venueType = parsed.venueType;
      }
      if (parsed.location) {
        // Use parsed location if available
        location = parsed.location;
      }
    } catch (error) {
      console.warn('Failed to parse venue context, using original values:', error);
    }

    const suggestions = await AIService.generateVenueSuggestions(venueType, location);

    return NextResponse.json({
      success: true,
      data: suggestions,
    } as ApiResponse<VenueSuggestion[]>);
  } catch (error) {
    console.error('Error generating venue suggestions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate venue suggestions',
    } as ApiResponse);
  }
}
