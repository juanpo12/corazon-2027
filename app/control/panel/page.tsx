import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import '@/app/tickets.css';
import { isControl } from '@/lib/server/auth';
import { db } from '@/lib/server/db';
import { today } from '@/lib/server/checkin';
import { formatARS } from '@/lib/event';
import ResendButton from '@/components/tickets/ResendButton';

export const metadata: Metadata = { title: 'Panel de entradas', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function PanelPage() {
  if (!(await isControl())) redirect('/control');

  const [paid, todayIn, recent] = await Promise.all([
    db().from('cac_orders').select('quantity, total').eq('status', 'paid'),
    db().from('cac_checkins').select('id', { count: 'exact', head: true }).eq('day', today()),
    db()
      .from('cac_orders')
      .select('id, buyer_name, email, quantity, total, status, mp_status, created_at, paid_at, email_sent_at')
      .order('created_at', { ascending: false })
      .limit(300),
  ]);

  const rows = paid.data ?? [];
  const sold = rows.reduce((a, o) => a + o.quantity, 0);
  const money = rows.reduce((a, o) => a + Number(o.total), 0);
  const fmt = (iso: string) => new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/San_Juan' });
  const label = (o: { status: string; mp_status: string | null }) =>
    o.status === 'paid' ? 'Pagada' : o.status === 'refunded' ? 'Devuelta' : o.mp_status === 'pending' || o.mp_status === 'in_process' ? 'Pago pendiente' : 'Sin pagar';

  return (
    <main className="ct">
      <div className="ct__top">
        <div className="ct__tabs"><a className="ct__tab" href="/control">← Escanear</a></div>
      </div>
      <div className="ct__body">
        <h1 className="dsp tk__title" style={{ color: 'var(--cream)', fontSize: 56 }}>Panel</h1>
        <div className="pn-stats">
          <Stat n={String(sold)} k="Entradas vendidas" />
          <Stat n={String(rows.length)} k="Compras" />
          <Stat n={formatARS(money)} k="Recaudado (bruto)" />
          <Stat n={String(todayIn.count ?? 0)} k="Ingresos hoy" />
        </div>
        <div className="pn-actions">
          <a className="cta" href="/api/control/export">Descargar Excel</a>
        </div>
        <div className="pn-list">
          {(recent.data ?? []).map((o) => (
            <div key={o.id} className="pn-row">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800 }}>{o.buyer_name} · {o.quantity} {o.quantity === 1 ? 'entrada' : 'entradas'}</div>
                <div className="pn-row__meta">{o.email} · {fmt(o.paid_at ?? o.created_at)}{o.status === 'paid' && !o.email_sent_at ? ' · ⚠️ mail no enviado' : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`pn-tag pn-tag--${o.status}`}>{label(o)}</span>
                {o.status === 'paid' && <ResendButton orderId={o.id} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Stat({ n, k }: { n: string; k: string }) {
  return (
    <div className="pn-stat">
      <div className="pn-stat__n">{n}</div>
      <div className="pn-stat__k">{k}</div>
    </div>
  );
}
