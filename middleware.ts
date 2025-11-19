
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The middleware runs in the Edge runtime and must not import Node-only
// modules such as Prisma. Instead, we call our Node API endpoints to
// lookup links and increment clicks.
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.substring(1); // remove '/'

  // Ignore paths for API routes, pages, and static files
  if (path.startsWith('api/') || path.startsWith('code/') || path === 'healthz' || path === '' || path.includes('.')) {
    return NextResponse.next();
  }

  try {
    const origin = request.nextUrl.origin;
    // Fetch link details from our server-side API (Node runtime)
    const res = await fetch(`${origin}/api/links/${encodeURIComponent(path)}`);
    if (res.ok) {
      const link = await res.json();
      // Tell server to increment click (Node runtime endpoint)
      await fetch(`${origin}/api/links/${encodeURIComponent(path)}/click`, {
        method: 'POST',
        // no need to await body, but we wait for completion here
      });
      return NextResponse.redirect(link.url, 302);
    }
  } catch (e) {
    // If any error occurs, fallthrough to Next's handler (404)
    console.error('middleware redirect error', e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
