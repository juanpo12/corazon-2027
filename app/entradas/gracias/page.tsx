import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Shell from '@/components/tickets/Shell';
import { getOrderByToken, syncPayment } from '@/lib/server/orders';
import { EVENT } from '@/lib/event';

export const metadata: Metadata = { title: `Tu compra · Corazón a Corazón ${EVENT.year}`, robots: { index: false } };
export const dynamic = 'force-dynamic';

type SP = Promise<Record<string, string | string[] | undefined>>;

// Mercado Pago vuelve acá después del pago con ?payment_id=…&status=…
export default async function GraciasPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) ?? '';
  let order = await getOrderByToken(one('o'));

  if (!order) {
    return (
      <Shell>
        <Msg k="Entradas" title="No encontramos tu compra">
          Si ya pagaste, revisá tu mail. Si no te llegó nada, escribinos y lo resolvemos.
        </Msg>
      </Shell>
    );
  }

  const paymentId = one('payment_id') || one('collection_id');
  if (order.status === 'pending' && /^\d+$/.test(paymentId)) {
    // No esperamos al webhook: confirmamos el pago directamente con Mercado Pago
    try {
      const synced = await syncPayment(paymentId);
      if (synced?.id === order.id) order = synced;
    } catch (e) {
      console.error('gracias sync', e);
    }
  }

  if (order.status === 'paid') redirect(`/mis-entradas/${order.access_token}?nueva=1`);

  const mp = order.mp_status ?? one('status');
  if (mp === 'pending' || mp === 'in_process') {
    return (
      <Shell>
        <Msg k="Pago en proceso" title="Ya casi">
          Tu pago está pendiente de acreditación (por ejemplo, si elegiste pagar en efectivo). Cuando Mercado Pago lo apruebe,
          te mandamos las entradas a <strong>{order.email}</strong>. No hace falta que hagas nada más.
        </Msg>
      </Shell>
    );
  }

  return (
    <Shell>
      <Msg k="Pago no completado" title="No se pudo pagar">
        El pago no se completó o fue rechazado, así que no se te cobró. Podés intentarlo de nuevo con otro medio de pago.
        <div style={{ marginTop: 24 }}>
          <Link className="cta tk-btn" href="/entradas">Intentar de nuevo <span aria-hidden="true">→</span></Link>
        </div>
      </Msg>
    </Shell>
  );
}

function Msg({ k, title, children }: { k: string; title: string; children: React.ReactNode }) {
  return (
    <section className="tk__card">
      <div className="lbl tk__k">{k}</div>
      <h1 className="dsp tk__title">{title}</h1>
      <div className="tk__p">{children}</div>
    </section>
  );
}
