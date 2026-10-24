import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { env } from './env';

// Sesión del equipo de control (puerta y panel): cookie firmada, dura 3 días.
export const CONTROL_COOKIE = 'cac_control';
const MAX_AGE = 60 * 60 * 24 * 3;

const sign = (v: string) => createHmac('sha256', env.authSecret()).update(v).digest('hex');

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function pinMatches(pin: string) {
  return safeEqual(sign(`pin:${pin}`), sign(`pin:${env.controlPin()}`));
}

export function newSession() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return { value: `${exp}.${sign(`control:${exp}`)}`, maxAge: MAX_AGE };
}

export async function isControl(): Promise<boolean> {
  const v = (await cookies()).get(CONTROL_COOKIE)?.value;
  if (!v) return false;
  const [exp, mac] = v.split('.');
  if (!exp || !mac || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(mac, sign(`control:${exp}`));
}
