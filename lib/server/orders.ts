import 'server-only';
import { db, type Order, type Ticket } from './db';
import { getPayment } from './mp';
import { sendTicketsEmail } from './email';

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await db().from('orders').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  if (!/^[a-f0-9]{32}$/.test(token)) return null;
  const { data, error } = await db().from('orders').select('*').eq('access_token', token).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTickets(orderId: string): Promise<Ticket[]> {
  const { data, error } = await db().from('tickets').select('*').eq('order_id', orderId).order('seq');
  if (error) throw error;
  return data ?? [];
}

export async function emailTickets(order: Order, resend = false) {
  const tickets = await getTickets(order.id);
  await sendTicketsEmail(order, tickets, resend);
  await db().from('orders').update({ email_sent_at: new Date().toISOString() }).eq('id', order.id);
}

const REVERSED = new Set(['refunded', 'charged_back', 'cancelled']);

/**
 * Consulta el pago en Mercado Pago (la única fuente confiable) y actualiza la compra.
 * Se llama desde el webhook y desde la página de regreso; es seguro llamarla varias veces.
 */
export async function syncPayment(paymentId: string): Promise<Order | null> {
  const p = await getPayment(paymentId);
  if (!p.external_reference) return null;
  const order = await getOrderById(p.external_reference);
  if (!order) return null;

  if (p.status === 'approved') {
    const amountOk = p.currency_id === 'ARS' && Math.abs(Number(p.transaction_amount) - Number(order.total)) < 0.01;
    if (!amountOk) {
      console.error(`Pago ${p.id} aprobado con monto distinto a la compra ${order.id}`, p.transaction_amount, order.total);
      await db().from('orders').update({ mp_payment_id: String(p.id), mp_status: 'amount_mismatch' }).eq('id', order.id);
      return order;
    }
    const { data: first, error } = await db().rpc('mark_order_paid', {
      p_order: order.id,
      p_payment: String(p.id),
      p_mp_status: p.status,
    });
    if (error) throw error;
    const fresh = (await getOrderById(order.id))!;
    if (first) {
      try {
        await emailTickets(fresh);
      } catch (e) {
        // Las entradas igual quedan en "Mis entradas" y se pueden reenviar desde el panel
        console.error('No se pudo enviar el mail de la compra', order.id, e);
      }
    }
    return fresh;
  }

  if (REVERSED.has(p.status) && order.status === 'paid' && order.mp_payment_id === String(p.id)) {
    // Devolución o contracargo: las entradas dejan de ser válidas
    await db().from('orders').update({ status: 'refunded', mp_status: p.status }).eq('id', order.id);
    return getOrderById(order.id);
  }

  if (order.status === 'pending') {
    await db().from('orders').update({ mp_payment_id: String(p.id), mp_status: p.status }).eq('id', order.id);
    return getOrderById(order.id);
  }
  return order;
}
