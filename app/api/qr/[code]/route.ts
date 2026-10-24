import QRCode from 'qrcode';
import { qrPayload } from '@/lib/qr';

export const runtime = 'nodejs';

// Imagen PNG del QR para el mail (Gmail y otros no muestran imágenes incrustadas en base64).
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[a-f0-9]{64}$/.test(code)) return new Response('Not found', { status: 404 });
  const png = await QRCode.toBuffer(qrPayload(code), { width: 440, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#2B2B2D', light: '#FFFFFF' } });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
