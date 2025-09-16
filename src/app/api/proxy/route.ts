import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const { BASE_URL } = API_CONFIG;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    console.log('Proxying request to:', `${BASE_URL}${endpoint}`);
    console.log('Request body:', body);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
      body: JSON.stringify(body),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API Proxy is running. Use POST method.' });
}