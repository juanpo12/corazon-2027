'use client';

import { useState } from 'react';

export default function ControlLogin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const pin = new FormData(e.currentTarget).get('pin');
    const res = await fetch('/api/control/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) });
    if (res.ok) return window.location.reload();
    setError('Clave incorrecta');
    setBusy(false);
  }

  return (
    <div className="ct__body" style={{ paddingTop: '18vh', maxWidth: 380 }}>
      <div className="lbl tk__k">Corazón a Corazón 2027</div>
      <h1 className="dsp tk__title" style={{ color: 'var(--cream)' }}>Control de entradas</h1>
      <form className="tk-form" onSubmit={submit}>
        <input className="tk-input" name="pin" type="password" autoComplete="current-password" placeholder="Clave del equipo" required aria-label="Clave del equipo" />
        {error && <div className="tk-err" role="alert">{error}</div>}
        <button className="cta tk-btn" type="submit" disabled={busy}>Entrar</button>
      </form>
    </div>
  );
}
