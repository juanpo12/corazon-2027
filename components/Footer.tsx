import Image from 'next/image';
import Rings from './Rings';
import { EVENT } from '@/lib/event';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="badge" aria-hidden="true" />
        <div className="footer__lock">
          <Image className="footer__lockimg grow" src="/img/footer-lockup.webp" alt="De corazón a corazón · De gloria en gloria" width={1096} height={456} sizes="(max-width: 1100px) 92vw, 1000px" />
        </div>
        <div className="footer__cta">
          <a className="cta" href="#oradores">
            Ver oradores <span aria-hidden="true">↑</span>
          </a>
        </div>
        <div className="footer__bottom">
          <Image src="/img/logo.png" alt={EVENT.ministry} width={314} height={212} className="footer__logo" />
          <div className="lbl footer__meta">
            Conferencia {EVENT.year} · CLS {EVENT.city}
            <br />
            {EVENT.dates} · {EVENT.address}
          </div>
          <Rings size={22} row />
        </div>
      </div>
    </footer>
  );
}
