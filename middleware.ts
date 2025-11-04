import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;

  console.log("[MIDDLEWARE] Processing request", {
    pathname,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.log("[MIDDLEWARE] Auth check error", {
      pathname,
      error: authError.message,
      duration: `${Date.now() - startTime}ms`,
    });
  }

  if (!user && pathname.startsWith("/dashboard")) {
    console.log("[MIDDLEWARE] Redirecting unauthenticated user", {
      pathname,
      redirectTo: "/login",
      duration: `${Date.now() - startTime}ms`,
    });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    console.log("[MIDDLEWARE] Redirecting authenticated user", {
      pathname,
      userId: user.id,
      redirectTo: "/dashboard",
      duration: `${Date.now() - startTime}ms`,
    });
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user) {
    console.log("[MIDDLEWARE] Request allowed", {
      pathname,
      userId: user.id,
      email: user.email,
      duration: `${Date.now() - startTime}ms`,
    });
  } else {
    console.log("[MIDDLEWARE] Request allowed (public)", {
      pathname,
      duration: `${Date.now() - startTime}ms`,
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
