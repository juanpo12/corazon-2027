'use client';

import { useState } from 'react';

export default function ResendButton({ orderId, label = 'Reenviar' }: { orderId: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  async function send() {
    if (!confirm('¿Reenviar el mail con las entradas?')) return;
    setState('busy');
    const r = await fetch('/api/control/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
    if (r.status === 401) return window.location.reload(); // sesión vencida: vuelve a pedir la clave
    setState(r.ok ? 'ok' : 'err');
  }
  return (
    <button className="ct-pill ct-pill--ghost" onClick={send} disabled={state === 'busy' || state === 'ok'}>
      {state === 'ok' ? 'Enviado' : state === 'err' ? 'Reintentar' : state === 'busy' ? '…' : label}
    </button>
  );
}
