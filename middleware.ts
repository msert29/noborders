import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'fr', 'ar', 'tr', 'ur', 'hi'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage =
    request.headers.get('accept-language') || 'en-GB,en-US;q=0.9,en;q=0.8';
  const headers = { 'accept-language': acceptLanguage };
  const languages = new Negotiator({ headers }).languages();

  return match(locales, languages, defaultLocale).split('-')[0];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  } else {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
