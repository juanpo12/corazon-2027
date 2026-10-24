import 'server-only';
import { EVENT } from '@/lib/event';
import { env } from './env';
import type { Order, Ticket } from './db';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// resend=true: reenvío manual desde el panel (sin clave de idempotencia, para que Resend no lo descarte)
export async function sendTicketsEmail(order: Order, tickets: Ticket[], resend = false) {
  const site = env.siteUrl();
  const link = `${site}/mis-entradas/${order.access_token}`;
  const n = tickets.length;

  const qrs = tickets
    .map(
      (t) => `
      <tr><td align="center" style="padding:18px 0 6px">
        <img src="${site}/api/qr/${t.code}" width="220" height="220" alt="QR entrada ${t.seq}" style="display:block;border:0;background:#fff;border-radius:12px" />
      </td></tr>
      <tr><td align="center" style="font:700 13px Arial,sans-serif;letter-spacing:2px;color:#6D6D6F;padding-bottom:10px">
        ENTRADA ${t.seq} DE ${n}
      </td></tr>`,
    )
    .join('');

  const html = `<!doctype html><html><body style="margin:0;background:#FEF7EC">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF7EC"><tr><td align="center" style="padding:24px 12px">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden">
      <tr><td style="background:#95B8F6;padding:28px 24px;text-align:center;font:900 28px Arial,sans-serif;color:#FEF7EC;letter-spacing:1px">
        CORAZÓN A CORAZÓN ${EVENT.year}
        <div style="font:700 13px Arial,sans-serif;letter-spacing:3px;margin-top:8px">${esc(EVENT.dates.toUpperCase())} · ${esc(EVENT.city.toUpperCase())}</div>
      </td></tr>
      <tr><td style="padding:24px;font:15px/1.6 Arial,sans-serif;color:#6D6D6F">
        ¡Hola ${esc(order.buyer_name)}! Tu compra está confirmada.<br />
        ${n === 1 ? 'Esta es tu entrada' : `Estas son tus ${n} entradas`}: ${n === 1 ? 'mostrá el QR' : 'cada persona muestra su QR'} en la puerta.
        La entrada vale para todos los días del evento.
      </td></tr>
      ${qrs}
      <tr><td align="center" style="padding:20px 24px 8px">
        <a href="${link}" style="display:inline-block;background:#FA5F49;color:#ffffff;text-decoration:none;font:700 14px Arial,sans-serif;letter-spacing:2px;padding:14px 26px;border-radius:999px">VER MIS ENTRADAS</a>
      </td></tr>
      <tr><td style="padding:16px 24px 28px;font:13px/1.6 Arial,sans-serif;color:#6D6D6F;text-align:center">
        ${esc(EVENT.address)}, ${esc(EVENT.city)}<br />
        No compartas estos QR: cada uno permite un ingreso por día.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  const res = await fetch(`${process.env.RESEND_API_URL || 'https://api.resend.com'}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.resendKey()}`, 'Content-Type': 'application/json', ...(resend ? {} : { 'Idempotency-Key': `order-${order.id}` }) },
    body: JSON.stringify({
      from: env.emailFrom(),
      to: [order.email],
      ...(env.emailReplyTo() ? { reply_to: env.emailReplyTo() } : {}),
      subject: n === 1 ? `Tu entrada · Corazón a Corazón ${EVENT.year}` : `Tus ${n} entradas · Corazón a Corazón ${EVENT.year}`,
      html,
      text: `¡Hola ${order.buyer_name}! Tu compra está confirmada. Mirá tus entradas con QR acá: ${link}`,
    }),
  });
  if (!res.ok) throw new Error(`Resend: ${res.status} ${await res.text()}`);
}
