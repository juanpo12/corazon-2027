import Image from 'next/image';
import Rings from './Rings';
import { EVENT } from '@/lib/event';

const BARS = ['#FA5F49', '#F9A59A', '#F9D99A', '#ADD5FA'];

export default function Hero() {
  const cta = EVENT.registrationUrl || '#info';
  return (
    <header className="hero">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className={`pt p${i + 1}`} aria-hidden="true" />
      ))}

      <div className="hero-bars par-bars" aria-hidden="true">
        <div className="hero-bars__grid">
          {BARS.map((c) => (
            <div className="bar" key={c}>
              <div className="bar-in" style={{ background: c }} />
            </div>
          ))}
        </div>
      </div>

      <nav className="nav">
        <div className="nav__left">
          <div className="lbl nav__label">
            Conferencia<br />2027<br />CLS SJ
          </div>
          <div className="hide-m">
            <Rings />
          </div>
        </div>
        <div className="nav__right">
          <a className="nl hide-m" href="#oradores">Oradores</a>
          <a className="nl hide-m" href="#info">Info</a>
          <a className="nl nl--btn" href="/entradas">Entrada</a>
          <Image src="/img/logo.png" alt={EVENT.ministry} width={314} height={212} className="nav__logo" priority />
        </div>
      </nav>

      <div className="lockup-wrap">
        <div className="lockup par-lk">
          <Image className="lk-cor" src="/img/hero-corazon.webp" alt="De corazón a corazón ’27" fill priority sizes="(max-width: 1100px) 100vw, 1060px" />
          <div className="lk-ico">
            <Image className="lk-ico-in" src="/img/hero-icon.webp" alt="" width={240} height={288} priority />
          </div>
          <Image className="lk-scr" src="/img/hero-script.webp" alt="" fill priority sizes="(max-width: 1100px) 100vw, 1060px" />
        </div>
      </div>

      <div className="hero-cta hero-fade">
        <a className="cta" href={cta}>
          Quiero ir <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="band-wrap">
        <div className="band">
          <div className="lbl band__side">8 y 9<br />de febrero</div>
          <div className="lbl band__mid">{EVENT.tagline}</div>
          <div className="lbl band__side band__side--r">J. M. Rosas<br />4357, SJ</div>
        </div>
        <div className="tiles" aria-hidden="true">
          {BARS.map((c) => (
            <div key={c} className="tile" style={{ background: c }} />
          ))}
        </div>
      </div>
    </header>
  );
}
