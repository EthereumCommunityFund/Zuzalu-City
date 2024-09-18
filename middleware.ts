import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (pathname.startsWith('/s/') || pathname.startsWith('/e/')) {
    let parts = pathname.split('/').filter(Boolean);

    let name = '';
    let hash = '0';

    if (parts.length >= 2) {
      name = parts[1];
      const hasHash = parts[2]?.length === 1;
      hash = !hasHash ? '0' : parts[2];
      parts = parts.slice(hasHash ? 3 : 2);
    } else {
      return NextResponse.redirect(origin);
    }

    const { data, error } = await supabase
      .from('url')
      .select('*')
      .eq('name', name)
      .eq('hash', hash)
      .single();

    if (error) {
      return NextResponse.redirect(origin);
    }

    const { ceramicId, type } = data;

    return NextResponse.redirect(
      `${origin}/${type}/${ceramicId}${parts.length ? `/${parts.join('/')}` : ''}`,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/s/:path*', '/e/:path'],
};
