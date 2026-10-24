import { NextResponse } from 'next/server';
import { isControl } from '@/lib/server/auth';
import { checkIn } from '@/lib/server/checkin';
import { codeFromQr } from '@/lib/qr';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!(await isControl())) return NextResponse.json({ error: 'Sesión vencida' }, { status: 401 });
  const { qr } = (await req.json().catch(() => ({}))) as { qr?: string };
  const code = codeFromQr(String(qr ?? ''));
  if (!code) return NextResponse.json({ result: 'invalid' });
  try {
    return NextResponse.json(await checkIn(code));
  } catch (e) {
    console.error('checkin', e);
    return NextResponse.json({ error: 'Error de conexión, probá de nuevo' }, { status: 500 });
  }
}
