'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SPEAKERS } from '@/lib/event';

const ROTATE_MS = 6000;

export default function Speakers() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const n = SPEAKERS.length;

  useEffect(() => {
    if (manual) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [manual, n]);

  const pick = (i: number) => {
    setActive(i);
    setManual(true);
  };

  return (
    <section id="oradores" className="speakers">
      <div className="wrap">
        <h2 className="sp-title rv">
          <Image className="sp-title__img grow" src="/img/oradores-title.webp" alt="Oradores" width={1256} height={325} sizes="(max-width: 1100px) 92vw, 1000px" />
        </h2>

        <div className="lineup rv" role="list">
          {SPEAKERS.map((s, i) => (
            <div role="listitem" key={s.last} className="lineup__item">
              <button
                type="button"
                className={`card${i === active ? ' is-on' : ''}${manual ? '' : ' auto'}`}
                style={{ background: s.card }}
                onClick={() => pick(i)}
                aria-pressed={i === active}
                aria-label={`Ver a ${s.first} ${s.last}`}
              >
                <span className="card-nm dsp">
                  {s.first}
                  <br />
                  {s.last}
                </span>
                <Image className="card-photo" src={s.photo.src} alt="" width={s.photo.w} height={s.photo.h} sizes="(max-width: 900px) 66vw, 240px" />
                <span className="card-bar">
                  <span className="card-bar-in" key={`${active}-${manual}`} />
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="spots rv" aria-live="polite">
          {SPEAKERS.map((s, i) => (
            <article
              key={s.last}
              className={`spot${i === active ? ' is-on' : ''}`}
              style={{ background: s.spot, color: s.ink }}
              aria-hidden={i !== active}
            >
              <div className="spot-txt">
                {s.nameImg ? (
                  <Image className="spot-name" src={s.nameImg.src} alt={`${s.first} ${s.last}`} width={s.nameImg.w} height={s.nameImg.h} sizes="(max-width: 900px) 90vw, 600px" />
                ) : (
                  <div className="spot-name spot-name--txt" role="img" aria-label={`${s.first} ${s.last}`}>
                    <div className="scr spot-name__scr">{s.first}</div>
                    <div className="dsp spot-name__big">{s.last}</div>
                  </div>
                )}
                <p className="spot-meta spot-bio">{s.bio}</p>
                <div className="spot-meta spot-nav">
                  <button className="arrow" type="button" aria-label="Orador anterior" tabIndex={i === active ? 0 : -1} onClick={() => pick((active + n - 1) % n)}>←</button>
                  <button className="arrow" type="button" aria-label="Orador siguiente" tabIndex={i === active ? 0 : -1} onClick={() => pick((active + 1) % n)}>→</button>
                </div>
              </div>
              <div className="spot-ph">
                <Image className="spot-img" src={s.photo.src} alt={`${s.first} ${s.last}`} width={s.photo.w} height={s.photo.h} sizes="(max-width: 900px) 90vw, 520px" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
