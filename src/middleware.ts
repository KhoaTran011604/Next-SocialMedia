
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// Mảng các path cần áp dụng middleware
const protectedRoutes = ['/', '/admin', '/admin/products', '/admin/orders', '/admin/reviews', '/admin/categories', '/admin/users', '/social']

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const token = request.cookies.get('token_info')?.value;
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/social', request.url));
    }
    if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/admin',
        '/admin/products',
        '/admin/products/:path*',
        '/admin/orders',
        '/admin/orders/:path*',
        '/admin/reviews',
        '/admin/reviews/:path*',
        '/admin/categories',
        '/admin/categories/:path*',
        '/admin/users',
        '/admin/users/:path*',
        '/social',
        '/social/:path*'
    ],
}
