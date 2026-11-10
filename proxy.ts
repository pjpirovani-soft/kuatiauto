import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

async function getUserData(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data, error } = await supabase
    .from('usuario')
    .select('rol, activo')
    .eq('id', userId)
    .maybeSingle();
    
  if (error || !data) return { rol: undefined, activo: false };
  return { rol: data.rol as string, activo: data.activo as boolean };
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

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const privateRoutes = [
    '/dashboard', '/admin', '/mi-garage', '/clientes', '/vehiculos', 
    '/ordenes', '/catalogo', '/establecimientos', '/recepcion', '/perfil'
  ];
  
  const isPrivateRoute = privateRoutes.some(route => path.startsWith(route));

  if (!user && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && (path.startsWith('/admin') || path.startsWith('/mi-garage') || isPrivateRoute)) {
    const { rol, activo } = await getUserData(supabase, user.id);

    if (activo === false) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (path.startsWith('/admin') && rol !== 'admin_general') {
      const url = request.nextUrl.clone();
      url.pathname = rol === 'conductor' ? '/mi-garage' : '/clientes';
      return NextResponse.redirect(url);
    }

    if (path.startsWith('/mi-garage') && rol !== 'conductor') {
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