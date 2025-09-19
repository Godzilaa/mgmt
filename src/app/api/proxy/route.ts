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

    // Determine HTTP method from body or default to POST
    const method = body.method || 'POST';
    const requestBody = method === 'GET' ? undefined : JSON.stringify(body);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'NextJS-Proxy/1.0',
    };

    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    // Add authentication header if session token is provided
    if (body.sessionToken) {
      headers['Authorization'] = `Bearer ${body.sessionToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: headers,
      body: requestBody,
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