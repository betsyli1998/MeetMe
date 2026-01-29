import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, GiphyImage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 12, offset = 0 } = body;

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required',
      } as ApiResponse);
    }

    const apiKey = process.env.GIPHY_API_KEY;

    if (!apiKey) {
      // Return mock data if no API key
      console.log('No GIPHY API key found, using mock data');
      const mockImages: GiphyImage[] = [
        {
          id: 'mock1',
          url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
          title: 'Party celebration',
          images: {
            original: {
              url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            },
            downsized: {
              url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            },
          },
        },
      ];

      return NextResponse.json({
        success: true,
        data: mockImages,
      } as ApiResponse<GiphyImage[]>);
    }

    // Call GIPHY API with pagination support
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
      query
    )}&limit=${limit}&offset=${offset}&rating=g`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      } as ApiResponse<GiphyImage[]>);
    }

    const images: GiphyImage[] = data.data.map((gif: any) => ({
      id: gif.id,
      url: gif.url,
      title: gif.title,
      images: {
        original: {
          url: gif.images.original.url,
        },
        downsized: {
          url: gif.images.downsized.url,
        },
      },
    }));

    return NextResponse.json({
      success: true,
      data: images,
    } as ApiResponse<GiphyImage[]>);
  } catch (error) {
    console.error('Error fetching from GIPHY:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch images',
    } as ApiResponse);
  }
}
