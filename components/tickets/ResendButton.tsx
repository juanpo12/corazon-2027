'use client';

import { useState } from 'react';

export default function ResendButton({ orderId }: { orderId: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  async function send() {
    if (!confirm('¿Reenviar el mail con las entradas?')) return;
    setState('busy');
    const r = await fetch('/api/control/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
    setState(r.ok ? 'ok' : 'err');
  }
  return (
    <button className="ct-pill" onClick={send} disabled={state === 'busy' || state === 'ok'}>
      {state === 'ok' ? 'Enviado' : state === 'err' ? 'Reintentar' : state === 'busy' ? '…' : 'Reenviar'}
    </button>
  );
}
