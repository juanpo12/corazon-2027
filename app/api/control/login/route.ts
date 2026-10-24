import { NextResponse } from 'next/server';
import { CONTROL_COOKIE, newSession, pinMatches } from '@/lib/server/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { pin } = (await req.json().catch(() => ({}))) as { pin?: string };
  if (!pin || !pinMatches(String(pin))) {
    await new Promise((r) => setTimeout(r, 800)); // frena intentos a lo loco
    return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 });
  }
  const s = newSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CONTROL_COOKIE, s.value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: s.maxAge });
  return res;
}
