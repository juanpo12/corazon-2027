import 'server-only';
import { db } from './db';

export type CheckinResult =
  | { result: 'ok'; name: string; seq: number; of: number; at: string }
  | { result: 'already'; name: string; seq: number; of: number; at: string }
  | { result: 'revoked'; name: string; seq: number; of: number }
  | { result: 'invalid' };

// Día del evento según la hora de San Juan (cada entrada tiene un ingreso por día)
export const today = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/San_Juan' }).format(new Date());

export async function checkIn(code: string): Promise<CheckinResult> {
  const { data: t, error } = await db()
    .from('cac_tickets')
    .select('id, seq, orders:cac_orders!inner(buyer_name, quantity, status)')
    .eq('code', code)
    .maybeSingle();
  if (error) throw error;
  if (!t) return { result: 'invalid' };

  const o = t.orders as unknown as { buyer_name: string; quantity: number; status: string };
  const who = { name: o.buyer_name, seq: t.seq, of: o.quantity };
  if (o.status !== 'paid') return { result: 'revoked', ...who };

  const day = today();
  const ins = await db().from('cac_checkins').insert({ ticket_id: t.id, day }).select('at').single();
  if (!ins.error) return { result: 'ok', ...who, at: ins.data.at };
  if (ins.error.code !== '23505') throw ins.error; // 23505 = ya existe ingreso para hoy

  const { data: prev } = await db().from('cac_checkins').select('at').eq('ticket_id', t.id).eq('day', day).single();
  return { result: 'already', ...who, at: prev?.at ?? '' };
}
