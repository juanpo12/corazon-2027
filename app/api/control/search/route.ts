import { NextResponse } from 'next/server';
import { isControl } from '@/lib/server/auth';
import { db } from '@/lib/server/db';
import { today } from '@/lib/server/checkin';

export const runtime = 'nodejs';

// Búsqueda por nombre o email, para cuando a alguien no le carga el QR.
export async function GET(req: Request) {
  if (!(await isControl())) return NextResponse.json({ error: 'Sesión vencida' }, { status: 401 });
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim().replace(/[%_,()]/g, ' ');
  if (q.length < 3) return NextResponse.json({ orders: [] });

  const { data, error } = await db()
    .from('cac_orders')
    .select('id, buyer_name, email, quantity, status, tickets:cac_tickets(id, seq, code, checkins:cac_checkins(day, at))')
    .eq('status', 'paid')
    .or(`buyer_name.ilike.%${q}%,email.ilike.%${q}%`)
    .order('buyer_name')
    .limit(20);
  if (error) {
    console.error('search', error);
    return NextResponse.json({ error: 'Error de conexión' }, { status: 500 });
  }

  const day = today();
  const orders = (data ?? []).map((o) => ({
    id: o.id,
    name: o.buyer_name,
    email: o.email,
    quantity: o.quantity,
    tickets: (o.tickets ?? [])
      .sort((a, b) => a.seq - b.seq)
      .map((t) => ({ seq: t.seq, code: t.code, inToday: t.checkins?.find((c) => c.day === day)?.at ?? null })),
  }));
  return NextResponse.json({ orders });
}
