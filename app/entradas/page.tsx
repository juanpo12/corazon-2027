import type { Metadata } from 'next';
import Shell from '@/components/tickets/Shell';
import BuyForm from '@/components/tickets/BuyForm';
import { EVENT, TICKET, formatARS } from '@/lib/event';

export const metadata: Metadata = { title: `Entradas · Corazón a Corazón ${EVENT.year}` };

export default function EntradasPage() {
  return (
    <Shell>
      <section className="tk__card">
        <div className="lbl tk__k">Entradas · {EVENT.dates}</div>
        <h1 className="dsp tk__title">Comprá tu entrada</h1>
        <p className="tk__p">
          Una sola entrada para <strong>todos los días</strong> de la conferencia: <strong>{formatARS(TICKET.price)}</strong>.
          Pagás con Mercado Pago y te llega al mail un QR por persona para mostrar en la puerta.
        </p>
        <BuyForm price={TICKET.price} max={TICKET.maxPerOrder} />
      </section>
    </Shell>
  );
}
