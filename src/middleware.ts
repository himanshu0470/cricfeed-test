import { CONFIG } from '@/config/config';
import { log } from 'console';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = [
    CONFIG.FRONTEND_URL,
    CONFIG.FRONTEND_WWW_URL,
    // 'http://localhost:3000'
];

// Middleware function
export function middleware(request: NextRequest) {
    const { pathname, hostname } = request.nextUrl;

    // Normalize domains: redirect www.cricfeed.online -> cricfeed.onsline
    if (hostname === CONFIG.WWW_DOMAIN) {
        const normalizedUrl = request.nextUrl.clone();
        normalizedUrl.hostname = CONFIG.MAIN_DOMAIN;
        return NextResponse.redirect(normalizedUrl);
    }

    // Only process API requests
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    const origin = request.headers.get('origin');

    // Handle preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
        const headers = {
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin || '' : '',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
            'Access-Control-Max-Age': '86400',
        };
        return new NextResponse(null, { status: 200, headers });
    }

    // Handle actual API requests
    const response = NextResponse.next();
    if (allowedOrigins.includes(origin || '')) {
        response.headers.set('Access-Control-Allow-Origin', origin || '');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    }

    return response;
}

export const config = {
    matcher: ['/api/:path*'], // Apply to API routes only
};