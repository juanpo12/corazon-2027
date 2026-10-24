import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

const API = process.env.MP_API_URL || 'https://api.mercadopago.com'; // MP_API_URL solo para pruebas locales

async function mp<T>(path: string, init?: RequestInit & { idempotencyKey?: string }): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.mpAccessToken()}`,
      'Content-Type': 'application/json',
      ...(init?.idempotencyKey ? { 'X-Idempotency-Key': init.idempotencyKey } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Mercado Pago ${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type Preference = { id: string; init_point: string };

export function createPreference(body: Record<string, unknown>, idempotencyKey: string) {
  return mp<Preference>('/checkout/preferences', { method: 'POST', body: JSON.stringify(body), idempotencyKey });
}

export type Payment = {
  id: number;
  status: string; // approved, pending, in_process, rejected, cancelled, refunded, charged_back
  status_detail: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
};

export function getPayment(id: string) {
  return mp<Payment>(`/v1/payments/${encodeURIComponent(id)}`);
}

// Valida el header x-signature de los webhooks (doc: "Validar origen de la notificación").
export function validWebhookSignature(req: Request, dataId: string): boolean {
  const secret = env.mpWebhookSecret();
  if (!secret) return true; // sin clave configurada no se valida (igual se consulta el pago a Mercado Pago)
  const sig = req.headers.get('x-signature') ?? '';
  const requestId = req.headers.get('x-request-id') ?? '';
  const parts = Object.fromEntries(
    sig.split(',').map((p) => {
      const [k, ...v] = p.split('=');
      return [k.trim(), v.join('=').trim()];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;
  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  let manifest = '';
  if (id) manifest += `id:${id};`;
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}
