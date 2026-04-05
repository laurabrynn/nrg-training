import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type Role = "trainee" | "manager" | "do" | "corporate";

function defaultRedirect(role: Role): string {
  if (role === "corporate" || role === "do") return "/admin";
  if (role === "manager") return "/manager";
  return "/trainee";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Unauthenticated → login only
  if (!user && pathname !== "/" && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = (user?.user_metadata?.role ?? "trainee") as Role;

  // Authenticated users on login page → redirect to their home
  if (user && pathname === "/") {
    return NextResponse.redirect(new URL(defaultRedirect(role), request.url));
  }

  // /admin routes — corporate and DO only
  if (pathname.startsWith("/admin")) {
    if (role !== "corporate" && role !== "do") {
      return NextResponse.redirect(new URL(defaultRedirect(role), request.url));
    }
  }

  // /manager routes — managers, DOs, and corporate
  if (pathname.startsWith("/manager")) {
    if (role === "trainee") {
      return NextResponse.redirect(new URL("/trainee", request.url));
    }
  }

  // /trainee routes — trainees only (managers have their own portal)
  if (pathname.startsWith("/trainee")) {
    if (role !== "trainee") {
      return NextResponse.redirect(new URL(defaultRedirect(role), request.url));
    }
  }

  return supabaseResponse;
}
