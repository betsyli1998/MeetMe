import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
import { ApiResponse, AIEventSuggestion } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { idea, date, time, location } = await request.json();

    if (!idea || !date || !time || !location) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    const suggestions = AIService.generateEventSuggestion(idea, location, date, time);

    return NextResponse.json({
      success: true,
      data: suggestions,
    } as ApiResponse<AIEventSuggestion>);
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate AI suggestions',
    } as ApiResponse);
  }
}
