import { isControl } from '@/lib/server/auth';
import { db } from '@/lib/server/db';

export const runtime = 'nodejs';

// Planilla (CSV, se abre con Excel) con una fila por entrada.
export async function GET() {
  if (!(await isControl())) return new Response('No autorizado', { status: 401 });
  const { data, error } = await db()
    .from('orders')
    .select('buyer_name, email, quantity, total, status, paid_at, mp_payment_id, tickets(seq, checkins(day, at))')
    .in('status', ['paid', 'refunded'])
    .order('paid_at');
  if (error) return new Response('Error', { status: 500 });

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('es-AR', { timeZone: 'America/Argentina/San_Juan' }) : '';
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['Nombre', 'Email', 'Entrada', 'Estado', 'Pagado', 'Total compra', 'Pago MP', 'Ingresos']];
  for (const o of data ?? []) {
    for (const t of (o.tickets ?? []).sort((a, b) => a.seq - b.seq)) {
      rows.push([
        o.buyer_name,
        o.email,
        `${t.seq} de ${o.quantity}`,
        o.status === 'paid' ? 'Pagada' : 'Devuelta',
        fmt(o.paid_at),
        String(o.total),
        o.mp_payment_id ?? '',
        (t.checkins ?? []).map((c) => fmt(c.at)).join(' / '),
      ]);
    }
  }
  // BOM + ";" para que Excel en español lo abra bien
  const csv = '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="entradas-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
