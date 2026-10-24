import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import Shell from '@/components/tickets/Shell';
import { getOrderByToken, getTickets } from '@/lib/server/orders';
import { EVENT } from '@/lib/event';
import { qrPayload } from '@/lib/qr';

export const metadata: Metadata = { title: `Mis entradas · Corazón a Corazón ${EVENT.year}`, robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function MisEntradas({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ nueva?: string }>;
}) {
  const { token } = await params;
  const { nueva } = await searchParams;
  const order = await getOrderByToken(token);
  if (!order || order.status === 'pending') notFound();

  const tickets = await getTickets(order.id);
  const voided = order.status === 'refunded';
  const qrs = await Promise.all(
    tickets.map((t) =>
      QRCode.toString(qrPayload(t.code), { type: 'svg', margin: 2, errorCorrectionLevel: 'M', color: { dark: '#2B2B2D', light: '#FFFFFF' } }),
    ),
  );
  const n = tickets.length;

  return (
    <Shell>
      <section className="tk__card">
        <div className="lbl tk__k">{nueva ? '¡Compra confirmada!' : 'Mis entradas'}</div>
        <h1 className="dsp tk__title">{n === 1 ? 'Tu entrada' : `Tus ${n} entradas`}</h1>
        <div className="scr tk__script">de gloria en gloria</div>
        <p className="tk__p">
          {order.buyer_name}, {n === 1 ? 'mostrá este QR' : 'cada persona muestra su QR'} en la puerta. Vale para todos los días:{' '}
          <strong>{EVENT.dates}</strong> en {EVENT.address}, {EVENT.city}.
        </p>
        {nueva && <p className="tk__muted">También te lo mandamos a {order.email}. Guardá esta página o sacale captura a los QR.</p>}
        {voided && <div className="tk-err" style={{ marginTop: 18 }}>Esta compra fue devuelta: las entradas ya no son válidas.</div>}

        <div className="tk-tickets">
          {tickets.map((t, i) => (
            <div key={t.id} className={`tk-ticket${voided ? ' tk-ticket--void' : ''}`}>
              <div dangerouslySetInnerHTML={{ __html: qrs[i] }} />
              <div className="tk-ticket__n">Entrada {t.seq} de {n}</div>
              {voided && <div className="tk-ticket__void" aria-hidden="true">Anulada</div>}
            </div>
          ))}
        </div>
        <p className="tk__muted">Cada QR permite un ingreso por día. No lo compartas en redes.</p>
      </section>
    </Shell>
  );
}
