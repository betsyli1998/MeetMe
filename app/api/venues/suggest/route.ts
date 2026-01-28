import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
import { ApiResponse, VenueSuggestion } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { idea, approximateLocation } = await request.json();

    if (!idea || !approximateLocation) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    const suggestions = AIService.generateVenueSuggestions(idea, approximateLocation);

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
