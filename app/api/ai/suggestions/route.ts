import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
import { ApiResponse, AIEventSuggestion } from '@/types';
import { checkIPRateLimit, getClientIP } from '@/lib/rate-limiter';
import { extractGiphyKeywords } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  try {
    // IP-based rate limiting: 10 requests per minute
    const clientIP = getClientIP(request);
    const rateLimit = checkIPRateLimit(clientIP, 10, 60000);

    if (!rateLimit.allowed) {
      console.warn(`[SECURITY] AI API rate limit exceeded for IP: ${clientIP}`);
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

    const { idea, date, time, location } = await request.json();

    if (!idea || !date || !time || !location) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    const suggestions = await AIService.generateEventSuggestion(idea, location, date, time);

    // Extract better keywords for GIPHY in parallel
    let giphyKeywords = idea;
    try {
      giphyKeywords = await extractGiphyKeywords(idea, suggestions.title);
    } catch (error) {
      console.warn('Failed to extract GIPHY keywords, using original idea:', error);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...suggestions,
        giphyKeywords, // Add extracted keywords to response
      },
    } as ApiResponse<AIEventSuggestion & { giphyKeywords: string }>);
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate AI suggestions',
    } as ApiResponse);
  }
}
