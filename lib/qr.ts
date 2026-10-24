// Contenido del QR de cada entrada. Prefijo propio para que el escáner ignore cualquier otro QR.
const PREFIX = 'CAC27:';

export const qrPayload = (code: string) => PREFIX + code;

export function codeFromQr(text: string): string | null {
  const t = text.trim();
  const raw = t.startsWith(PREFIX) ? t.slice(PREFIX.length) : t;
  return /^[a-f0-9]{64}$/i.test(raw) ? raw.toLowerCase() : null;
}
