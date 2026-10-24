import { NextResponse } from 'next/server';
import { CONTROL_COOKIE } from '@/lib/server/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(CONTROL_COOKIE);
  return res;
}
