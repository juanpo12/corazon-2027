'use client';

import { useState } from 'react';
import { formatARS } from '@/lib/event';

export default function BuyForm({ price, max }: { price: number; max: number }) {
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.get('name'), email: f.get('email'), quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'No pudimos iniciar el pago.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar el pago.');
      setBusy(false);
    }
  }

  return (
    <form className="tk-form" onSubmit={submit}>
      <div className="tk-field">
        <label htmlFor="name">Nombre y apellido</label>
        <input className="tk-input" id="name" name="name" autoComplete="name" required minLength={3} maxLength={80} />
      </div>
      <div className="tk-field">
        <label htmlFor="email">Email (ahí te llegan las entradas)</label>
        <input className="tk-input" id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={120} />
      </div>
      <div className="tk-field">
        <span className="tk-lbl" id="qty-l">Cantidad de entradas</span>
        <div className="tk-qty" role="group" aria-labelledby="qty-l">
          <button type="button" className="tk-qty__btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Una menos">−</button>
          <span className="tk-qty__n" aria-live="polite">{qty}</span>
          <button type="button" className="tk-qty__btn" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="Una más">+</button>
        </div>
      </div>
      <div className="tk-total">
        <span className="tk-lbl">Total</span>
        <span className="tk-total__n">{formatARS(price * qty)}</span>
      </div>
      {error && <div className="tk-err" role="alert">{error}</div>}
      <button className="cta tk-btn" type="submit" disabled={busy}>
        {busy ? 'Abriendo Mercado Pago…' : <>Pagar con Mercado Pago <span aria-hidden="true">→</span></>}
      </button>
      <p className="tk__muted">Podés pagar con tarjeta, dinero en cuenta de Mercado Pago o en efectivo (Rapipago / Pago Fácil). Si pagás en efectivo, las entradas te llegan cuando se acredita el pago.</p>
    </form>
  );
}
