import { NextRequest, NextResponse } from 'next/server';
import captchaService from '@/lib/captchaService';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const result = await captchaService.verifyToken(token);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('CAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'CAPTCHA verification endpoint. Use POST method with token.',
    providers: ['recaptcha', 'hcaptcha'],
  });
}