import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Placeholder for webhook handler
    // Will handle external service notifications
    const body = await request.json();
    
    return NextResponse.json({ 
      message: 'ok',
      received: true
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Webhook processing failed', error: String(error) },
      { status: 500 }
    );
  }
}
