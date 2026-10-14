import { SPEAKERS } from '@/lib/event';

const TOP = ['Corazón a corazón', 'De gloria en gloria', 'Conferencia 2027', '8 y 9 de febrero'];
const BOTTOM = ['San Juan', 'Cristo la Solución', SPEAKERS.map((s) => `${s.first} ${s.last}`).join(' · ')];

function Row({ items, small }: { items: string[]; small?: boolean }) {
  return (
    <div className={small ? 'mq-item lbl mq-item--sm' : 'mq-item dsp'}>
      {items.map((t) => (
        <span key={t} className="mq-pair">
          <span>{t}</span>
          <span className="dot" />
        </span>
      ))}
    </div>
  );
}

export default function Marquees() {
  return (
    <section className="marquees" aria-label="Lema">
      <div className="mq-band mq-band--a">
        <div className="mq">
          <Row items={TOP} />
          <div aria-hidden="true"><Row items={TOP} /></div>
        </div>
      </div>
      <div className="mq-band mq-band--b" aria-hidden="true">
        <div className="mq r">
          <Row items={BOTTOM} small />
          <Row items={BOTTOM} small />
        </div>
      </div>
    </section>
  );
}
