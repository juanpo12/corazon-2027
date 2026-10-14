import Hero from '@/components/Hero';
import Marquees from '@/components/Marquees';
import Verse from '@/components/Verse';
import Speakers from '@/components/Speakers';
import Info from '@/components/Info';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <main className="page">
      <div className="prog" aria-hidden="true" />
      <Hero />
      <Marquees />
      <Verse />
      <Speakers />
      <Info />
      <Footer />
    </main>
  );
}
