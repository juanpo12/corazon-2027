import Countdown from './Countdown';
import { EVENT, MAPS_URL } from '@/lib/event';

export default function Info() {
  const tickets = EVENT.registrationUrl || '#info';
  return (
    <section id="info" className="info">
      <div className="wrap">
        <div className="dsp info__ghost slide" aria-hidden="true">Te esperamos<span className="hide-m"> · Te esperamos</span></div>
        <h2 className="dsp info__title rvL">Agendá la fecha</h2>

        <div className="tiles-grid">
          <div className="tl rv" style={{ background: '#FA5F49' }}>
            <div className="lbl tl__k">Cuándo</div>
            <div className="dsp tl__big">8 y 9</div>
            <div className="lbl tl__sub">de febrero · {EVENT.year}</div>
          </div>

          <div className="tl tl--col rv" style={{ background: '#F9D99A' }}>
            <div className="lbl tl__k">Dónde</div>
            <div className="dsp tl__mid tl__addr">J. M. Rosas<br />4357</div>
            <div className="lbl tl__sub">{EVENT.city} · {EVENT.country}</div>
            <div className="tl__foot">
              <a className="cta" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                Cómo llegar <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="tl tl--col rv" style={{ background: '#F9A59A' }}>
            <div className="lbl tl__k">Entradas</div>
            <div className="tl__share">
              <div className="dsp tl__mid tl__buy">Comprá tu<br />entrada</div>
              <div className="scr tl__scr">de corazón</div>
            </div>
            <div className="tl__foot">
              <a className="cta" href={tickets} {...(EVENT.registrationUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                Comprar entrada <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="tl tl--cd rv">
          <div className="cd-row">
            <div>
              <div className="lbl tl__k">Cuenta regresiva</div>
              <div className="dsp cd-title">Faltan</div>
            </div>
            <Countdown />
          </div>
        </div>
      </div>
    </section>
  );
}
