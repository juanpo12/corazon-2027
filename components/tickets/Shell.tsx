import Link from 'next/link';
import '@/app/tickets.css';

// Marco común de las páginas de entradas (fondo azul + volver a la web)
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="tk">
      <div className="tk__top">
        <Link className="tk__home" href="/">← Corazón a Corazón 2027</Link>
      </div>
      {children}
    </main>
  );
}
