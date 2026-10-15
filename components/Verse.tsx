import { VERSE } from '@/lib/event';

export default function Verse() {
  const words = VERSE.text.split(' ');
  return (
    <section className="verse-sec">
      <div className="wrap wrap--narrow">
        <div className="lbl verse-ref rvL">{VERSE.ref}</div>
        <p className="verse">
          {words.map((w, i) => (
            <span key={i} className={`vw b${Math.min(11, Math.floor((i * 12) / words.length))}`}>
              {w}
            </span>
          ))}
        </p>
        <div className="verse-about">
          {VERSE.about.map((p) => (
            <p key={p} className="verse-about__p rv">{p}</p>
          ))}
          <p className="verse-about__end rv">
            <span className="dsp verse-about__big">{VERSE.closing}</span>
            <span className="scr verse-about__scr">{VERSE.closingScript}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
