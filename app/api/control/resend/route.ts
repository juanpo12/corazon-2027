import { NextResponse } from 'next/server';
import { isControl } from '@/lib/server/auth';
import { emailTickets, getOrderById } from '@/lib/server/orders';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!(await isControl())) return NextResponse.json({ error: 'Sesión vencida' }, { status: 401 });
  const { orderId } = (await req.json().catch(() => ({}))) as { orderId?: string };
  const order = orderId && /^[0-9a-f-]{36}$/.test(orderId) ? await getOrderById(orderId) : null;
  if (!order || order.status !== 'paid') return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
  try {
    await emailTickets(order, true);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('resend', e);
    return NextResponse.json({ error: 'No se pudo enviar el mail' }, { status: 500 });
  }
}
