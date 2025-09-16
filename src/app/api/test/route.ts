import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET() {
  const { BASE_URL } = API_CONFIG;
  
  try {
    // Try to make a simple request to test connectivity
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    return NextResponse.json({
      status: 'API proxy is working',
      apiBaseUrl: BASE_URL,
      testResponse: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'API proxy test failed',
      apiBaseUrl: BASE_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Test endpoint - use the /api/proxy endpoint for actual API calls'
  });
}