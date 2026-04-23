import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === '/verbindingswiel') {
    response.headers.delete('X-Frame-Options');
    response.headers.set('Content-Security-Policy', "frame-ancestors *;");
  }

  return response;
}

export const config = {
  matcher: '/verbindingswiel',
};
