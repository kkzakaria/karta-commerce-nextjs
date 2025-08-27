import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from './auth';

export async function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return payload;
}

export function withAuth(handler: (request: NextRequest, user: unknown) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return the error response
    }
    
    return handler(request, authResult);
  };
}