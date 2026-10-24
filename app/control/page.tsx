import type { Metadata } from 'next';
import '@/app/tickets.css';
import { isControl } from '@/lib/server/auth';
import ControlLogin from '@/components/tickets/ControlLogin';
import Scanner from '@/components/tickets/Scanner';

export const metadata: Metadata = { title: 'Control de entradas', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function ControlPage() {
  return <main className="ct">{(await isControl()) ? <Scanner /> : <ControlLogin />}</main>;
}
