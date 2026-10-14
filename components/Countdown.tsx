'use client';

import { useEffect, useState } from 'react';
import { EVENT } from '@/lib/event';

const pad = (n: number) => String(n).padStart(2, '0');

function split(ms: number) {
  let diff = Math.max(0, ms);
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d: String(d), h: pad(h), m: pad(m), s: pad(s) };
}

export default function Countdown() {
  const target = Date.parse(EVENT.startsAt);
  // null en el servidor para evitar diferencias de hidratación
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = now === null ? { d: '––', h: '––', m: '––', s: '––' } : split(target - now);

  return (
    <div className="cd" role="timer" aria-label="Tiempo restante hasta la conferencia">
      <div><div className="cd-n">{t.d}</div><div className="cd-l">Días</div></div>
      <div className="cd-n cd-sep" aria-hidden="true">:</div>
      <div><div className="cd-n">{t.h}</div><div className="cd-l">Horas</div></div>
      <div className="cd-n cd-sep" aria-hidden="true">:</div>
      <div><div className="cd-n">{t.m}</div><div className="cd-l">Min</div></div>
      <div className="cd-n cd-sep hide-m" aria-hidden="true">:</div>
      <div className="hide-m"><div className="cd-n">{t.s}</div><div className="cd-l">Seg</div></div>
    </div>
  );
}
