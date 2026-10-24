import { NextResponse } from 'next/server';
import { EVENT, TICKET } from '@/lib/event';
import { db } from '@/lib/server/db';
import { env } from '@/lib/server/env';
import { createPreference } from '@/lib/server/mp';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: unknown; email?: unknown; quantity?: unknown } | null;
  const name = String(body?.name ?? '').trim().replace(/\s+/g, ' ');
  const email = String(body?.email ?? '').trim().toLowerCase();
  const quantity = Number(body?.quantity);

  if (name.length < 3 || name.length > 80) return bad('Escribí tu nombre y apellido.');
  if (!EMAIL_RE.test(email) || email.length > 120) return bad('Revisá el email: ahí te mandamos las entradas.');
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > TICKET.maxPerOrder)
    return bad(`Podés comprar entre 1 y ${TICKET.maxPerOrder} entradas por vez.`);

  try {
    const { data: order, error } = await db()
      .from('orders')
      .insert({ buyer_name: name, email, quantity, unit_price: TICKET.price, total: TICKET.price * quantity })
      .select('id, access_token')
      .single();
    if (error) throw error;

    const site = env.siteUrl();
    const back = `${site}/entradas/gracias?o=${order.access_token}`;
    const [first, ...rest] = name.split(' ');
    const pref = await createPreference(
      {
        items: [
          {
            id: 'entrada-2027',
            title: TICKET.title,
            description: `Válida para todos los días · ${EVENT.dates} · ${EVENT.city}`,
            category_id: 'tickets',
            quantity,
            unit_price: TICKET.price,
            currency_id: 'ARS',
          },
        ],
        payer: { name: first, surname: rest.join(' ') || undefined, email },
        external_reference: order.id,
        back_urls: { success: back, pending: back, failure: back },
        ...(site.startsWith('https://') ? { auto_return: 'approved', notification_url: `${site}/api/mp/webhook` } : {}),
        statement_descriptor: 'CORAZON A CORAZON',
      },
      order.id,
    );

    await db().from('orders').update({ mp_preference_id: pref.id }).eq('id', order.id);
    return NextResponse.json({ url: pref.init_point });
  } catch (e) {
    console.error('checkout', e);
    return NextResponse.json({ error: 'No pudimos iniciar el pago. Probá de nuevo en un rato.' }, { status: 500 });
  }
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
