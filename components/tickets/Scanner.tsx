'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type QrScannerType from 'qr-scanner';
import ResendButton from './ResendButton';

type Res =
  | { result: 'ok' | 'already'; name: string; seq: number; of: number; at: string }
  | { result: 'revoked'; name: string; seq: number; of: number }
  | { result: 'invalid' }
  | { result: 'error'; message: string };

type Found = { id: string; name: string; email: string; quantity: number; tickets: { seq: number; code: string; inToday: string | null }[] };

const hour = (iso: string) => new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' });

export default function Scanner() {
  const [tab, setTab] = useState<'scan' | 'search'>('scan');
  const [res, setRes] = useState<Res | null>(null);
  const [camError, setCamError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanner = useRef<QrScannerType | null>(null);
  const busy = useRef(false);
  const last = useRef({ text: '', at: 0 });
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setRes(null);
    busy.current = false;
  }, []);

  const check = useCallback(
    async (qr: string) => {
      busy.current = true;
      let r: Res;
      try {
        const http = await fetch('/api/control/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qr }) });
        if (http.status === 401) return window.location.reload();
        const data = await http.json();
        r = http.ok ? data : { result: 'error', message: data.error ?? 'Error' };
      } catch {
        r = { result: 'error', message: 'Sin conexión. Probá de nuevo.' };
      }
      setRes(r);
      navigator.vibrate?.(r.result === 'ok' ? 120 : [200, 80, 200]);
      hideTimer.current = setTimeout(dismiss, r.result === 'ok' ? 2500 : 5000);
      return r;
    },
    [dismiss],
  );

  useEffect(() => {
    if (tab !== 'scan') return;
    let cancelled = false;
    (async () => {
      const QrScanner = (await import('qr-scanner')).default;
      if (cancelled || !videoRef.current) return;
      const s = new QrScanner(
        videoRef.current,
        ({ data }) => {
          const now = Date.now();
          // ignora lecturas mientras se muestra un resultado y el mismo QR repetido enseguida
          if (busy.current || (data === last.current.text && now - last.current.at < 4000)) return;
          last.current = { text: data, at: now };
          check(data);
        },
        {
          preferredCamera: 'environment',
          maxScansPerSecond: 6,
          highlightScanRegion: true,
          returnDetailedScanResult: true,
          // zona de lectura amplia (90% del cuadro) para que lea aunque acerquen mucho el celular
          calculateScanRegion: (v) => {
            const size = Math.round(Math.min(v.videoWidth, v.videoHeight) * 0.9);
            return { x: Math.round((v.videoWidth - size) / 2), y: Math.round((v.videoHeight - size) / 2), width: size, height: size, downScaledWidth: 480, downScaledHeight: 480 };
          },
        },
      );
      scanner.current = s;
      try {
        await s.start();
        setCamError('');
      } catch {
        setCamError('No se pudo abrir la cámara. Dale permiso a la cámara en el navegador o usá la búsqueda por nombre.');
      }
    })();
    return () => {
      cancelled = true;
      scanner.current?.destroy();
      scanner.current = null;
    };
  }, [tab, check]);

  async function logout() {
    await fetch('/api/control/logout', { method: 'POST' });
    window.location.reload();
  }

  return (
    <>
      <div className="ct__top">
        <div className="ct__tabs">
          <button className={`ct__tab${tab === 'scan' ? ' is-on' : ''}`} onClick={() => setTab('scan')}>Escanear</button>
          <button className={`ct__tab${tab === 'search' ? ' is-on' : ''}`} onClick={() => setTab('search')}>Buscar</button>
        </div>
        <div className="ct__tabs">
          <a className="ct__tab" href="/control/panel">Panel</a>
          <button className="ct__tab" onClick={logout} aria-label="Cerrar sesión">Salir</button>
        </div>
      </div>

      <div className="ct__body">
        {tab === 'scan' ? (
          <>
            <div className="ct-video"><video ref={videoRef} muted playsInline /></div>
            <p className="ct-hint">{camError || 'Apuntá la cámara al QR de la entrada'}</p>
          </>
        ) : (
          <Search onCheck={check} />
        )}
      </div>

      {res && <Overlay res={res} onClose={dismiss} />}
    </>
  );
}

function Overlay({ res, onClose }: { res: Res; onClose: () => void }) {
  const kind = res.result === 'ok' ? 'ok' : res.result === 'already' ? 'already' : 'bad';
  return (
    <div className={`ct-res ct-res--${kind}`} onClick={onClose} role="alert">
      <div>
        <div className="ct-res__icon" aria-hidden="true">{kind === 'ok' ? '✓' : kind === 'already' ? '!' : '✕'}</div>
        <div className="ct-res__big">
          {res.result === 'ok' && 'Puede pasar'}
          {res.result === 'already' && 'Ya ingresó hoy'}
          {res.result === 'revoked' && 'Entrada anulada'}
          {res.result === 'invalid' && 'QR no válido'}
          {res.result === 'error' && 'Error'}
        </div>
        {'name' in res && <div className="ct-res__name">{res.name}</div>}
        {'seq' in res && <div className="ct-res__sub">Entrada {res.seq} de {res.of}</div>}
        {res.result === 'already' && <div className="ct-res__sub">Ingresó a las {hour(res.at)}</div>}
        {res.result === 'revoked' && <div className="ct-res__sub">La compra fue devuelta</div>}
        {res.result === 'invalid' && <div className="ct-res__sub">No es una entrada de Corazón a Corazón</div>}
        {res.result === 'error' && <div className="ct-res__sub">{res.message}</div>}
        <div className="ct-res__tap">Tocá para seguir</div>
      </div>
    </div>
  );
}

function Search({ onCheck }: { onCheck: (qr: string) => Promise<Res | void> }) {
  const [q, setQ] = useState('');
  const [found, setFound] = useState<Found[] | null>(null);
  const [error, setError] = useState('');

  async function run(query = q) {
    setError('');
    const r = await fetch(`/api/control/search?q=${encodeURIComponent(query)}`);
    if (r.status === 401) return window.location.reload();
    const data = await r.json();
    if (!r.ok) return setError(data.error ?? 'Error');
    setFound(data.orders);
  }

  async function enter(code: string) {
    const r = await onCheck(code);
    if (r && (r.result === 'ok' || r.result === 'already')) run();
  }

  return (
    <div className="ct-search">
      <form onSubmit={(e) => { e.preventDefault(); run(); }} style={{ display: 'flex', gap: 8 }}>
        <input className="tk-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre o email (mín. 3 letras)" aria-label="Buscar por nombre o email" />
        <button className="cta" type="submit" style={{ flex: '0 0 auto' }}>Buscar</button>
      </form>
      {error && <div className="tk-err">{error}</div>}
      {found?.length === 0 && <p className="ct-hint">No hay compras pagadas con ese nombre o email.</p>}
      {found?.map((o) => (
        <div key={o.id} className="ct-order">
          <div className="ct-order__name">{o.name}</div>
          <div className="ct-order__mail">{o.email}</div>
          <div className="ct-order__tks">
            {o.tickets.map((t) => (
              <button key={t.code} className="ct-pill" disabled={!!t.inToday} onClick={() => enter(t.code)}>
                {t.inToday ? `${t.seq}/${o.quantity} ingresó ${hour(t.inToday)}` : `Ingresar ${t.seq}/${o.quantity}`}
              </button>
            ))}
          </div>
          <div className="ct-order__more">
            <ResendButton orderId={o.id} label="Reenviar mail" />
          </div>
        </div>
      ))}
    </div>
  );
}
