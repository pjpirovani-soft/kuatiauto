import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

async function getUserRole(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data } = await supabase.from('usuario').select('rol').eq('id', userId).single();
  return data?.rol as string | undefined;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // KU-SEC-01: rutas privadas requieren sesión.
  if (!user && (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/mi-garage'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // KU-SEC-01: rutas admin requieren rol admin_general.
  if (user && path.startsWith('/admin')) {
    const rol = await getUserRole(supabase, user.id);
    if (rol !== 'admin_general') {
      const url = request.nextUrl.clone();
      url.pathname = rol === 'conductor' ? '/mi-garage' : '/clientes';
      return NextResponse.redirect(url);
    }
  }

  // KU-SEC-01: rutas del portal requieren rol conductor.
  if (user && path.startsWith('/mi-garage')) {
    const rol = await getUserRole(supabase, user.id);
    if (rol !== 'conductor') {
      const url = request.nextUrl.clone();
      url.pathname = rol === 'admin_general' ? '/admin' : '/clientes';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};