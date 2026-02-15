import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Method 1: Try getToken (more reliable in API routes)
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    console.log('Token from getToken:', token);
    
    if (!token?.sub) {
      return NextResponse.json({ 
        error: 'No valid token found',
        debug: 'User not authenticated or token expired'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      authenticated: true,
      userId: token.sub,
      userEmail: token.email,
      userRole: token.role || token.userType,
      tokenExists: !!token
    });
    
  } catch (error) {
    console.error('Session test error:', error);
    return NextResponse.json({ 
      error: 'Authentication test failed',
      details: error.message 
    }, { status: 500 });
  }
}