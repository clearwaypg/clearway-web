import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const MAINTENANCE = false;

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (MAINTENANCE && !request.nextUrl.pathname.endsWith('/maintenance')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}/maintenance`;
    return NextResponse.rewrite(url);
  }
  return intl(request);
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
