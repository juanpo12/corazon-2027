import { NextResponse } from 'next/server';
import { syncPayment } from '@/lib/server/orders';
import { validWebhookSignature } from '@/lib/server/mp';

export const runtime = 'nodejs';

// Mercado Pago avisa acá cada vez que cambia un pago (aprobado, devuelto, etc.).
export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = (await req.json().catch(() => ({}))) as { type?: string; topic?: string; data?: { id?: string | number } };
  const type = body.type ?? body.topic ?? url.searchParams.get('type') ?? url.searchParams.get('topic');
  const id = String(body.data?.id ?? url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? '');

  // Solo nos interesan los pagos; el resto se confirma para que Mercado Pago no reintente.
  if (type !== 'payment' || !id) return NextResponse.json({ ok: true });

  if (!validWebhookSignature(req, url.searchParams.get('data.id') ?? id)) {
    return NextResponse.json({ error: 'firma inválida' }, { status: 401 });
  }

  try {
    await syncPayment(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('webhook', id, e);
    // 500 → Mercado Pago vuelve a intentar más tarde
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
