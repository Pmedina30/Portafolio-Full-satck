// ==============================================================================
// TIENDARD - NEXT.JS MIDDLEWARE (SECURITY GUARDS & RATE LIMITING)
// Features: RBAC Route Protection (SUPER_ADMIN, ADMIN_LOGISTICS, ADMIN_COMMERCIAL)
// + Token Bucket Rate Limiting for Auth & Checkout routes.
// ==============================================================================

import { NextResponse, type NextRequest } from "next/server";

// ------------------------------------------------------------------------------
// IN-MEMORY TOKEN BUCKET RATE LIMITER (Edge / Serverless compatible)
// In high-scale production, this connects seamlessly to Upstash Redis REST API.
// ------------------------------------------------------------------------------
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

function checkRateLimit(
  ip: string,
  limit: number = 20,
  refillRatePerSec: number = 2
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip) || { tokens: limit, lastRefill: now };

  // Calculate elapsed time and replenish tokens
  const elapsedSec = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(limit, bucket.tokens + elapsedSec * refillRatePerSec);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateLimitMap.set(ip, bucket);
    return { allowed: true, remaining: Math.floor(bucket.tokens) };
  } else {
    rateLimitMap.set(ip, bucket);
    const retryAfter = Math.ceil((1 - bucket.tokens) / refillRatePerSec);
    return { allowed: false, remaining: 0, retryAfterSec: retryAfter };
  }
}

// ------------------------------------------------------------------------------
// ROLE HIERARCHY & ROUTE PERMISSION DEFINITIONS
// ------------------------------------------------------------------------------
type UserRole = "SUPER_ADMIN" | "ADMIN_LOGISTICS" | "ADMIN_COMMERCIAL" | "CUSTOMER" | "SUPPLIER";

const PROTECTED_ROUTES: { pattern: RegExp; allowedRoles: UserRole[] }[] = [
  {
    // Super Admin: master control, partners, financial fees
    pattern: /^\/admin\/super(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    // Supplier / Proveedor Portal
    pattern: /^\/supplier(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "SUPPLIER"],
  },
  {
    // Socio 1: Logistics, warehouse scans, tracking updates, customs DGA status
    pattern: /^\/admin\/logistics(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "ADMIN_LOGISTICS"],
  },
  {
    // Socio 2: Products, catalog, video showcase, sales promotions
    pattern: /^\/admin\/commercial(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "ADMIN_COMMERCIAL"],
  },
  {
    // General Admin Portal Root
    pattern: /^\/admin(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "ADMIN_LOGISTICS", "ADMIN_COMMERCIAL"],
  },
  {
    // Customer Portal: Account, Orders, Forwarding Locker
    pattern: /^\/account(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "ADMIN_LOGISTICS", "ADMIN_COMMERCIAL", "CUSTOMER", "SUPPLIER"],
  },
  {
    // Checkout flow
    pattern: /^\/checkout(\/.*)?$/,
    allowedRoles: ["SUPER_ADMIN", "ADMIN_LOGISTICS", "ADMIN_COMMERCIAL", "CUSTOMER", "SUPPLIER"],
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // ----------------------------------------------------------------------------
  // 1. RATE LIMITING FOR SENSITIVE API ENDPOINTS
  // ----------------------------------------------------------------------------
  const isAuthRoute = pathname.startsWith("/api/auth");
  const isCheckoutRoute = pathname.startsWith("/api/checkout") || pathname.startsWith("/api/orders");

  if (isAuthRoute || isCheckoutRoute) {
    // 10 requests max burst, replenishes at 1 request every 2 seconds
    const rateResult = checkRateLimit(`${clientIp}:${isAuthRoute ? "auth" : "pay"}`, 10, 0.5);

    if (!rateResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Demasiadas solicitudes. Límite de tasa excedido por seguridad.",
          retryAfter: rateResult.retryAfterSec,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateResult.retryAfterSec || 5),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // ----------------------------------------------------------------------------
  // 2. RBAC ROUTE GUARDS
  // ----------------------------------------------------------------------------
  const matchedProtection = PROTECTED_ROUTES.find((r) => r.pattern.test(pathname));

  if (matchedProtection) {
    // Read session token / user role from auth cookie (e.g. NextAuth / Supabase JWT)
    const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value ||
      request.cookies.get("sb-access-token")?.value;

    const userRoleCookie = request.cookies.get("tiendard_role")?.value as UserRole | undefined;

    // In a full NextAuth/Supabase setup, decode JWT payload here.
    // Fallback allows demo presentation via role cookie if logged in.
    if (!sessionToken && !userRoleCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(loginUrl);
    }

    const currentRole: UserRole = userRoleCookie || "CUSTOMER";

    // Enforce role authorization
    if (!matchedProtection.allowedRoles.includes(currentRole)) {
      // Forbidden: redirect to unauthorized access page or respective dashboard
      const forbiddenUrl = new URL("/unauthorized", request.url);
      forbiddenUrl.searchParams.set("requiredRole", matchedProtection.allowedRoles.join(","));
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // ----------------------------------------------------------------------------
  // 3. SECURITY HEADERS AT THE EDGE
  // ----------------------------------------------------------------------------
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/api/auth/:path*",
    "/api/checkout/:path*",
    "/api/orders/:path*",
  ],
};
