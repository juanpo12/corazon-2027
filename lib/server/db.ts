import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

export type Order = {
  id: string;
  access_token: string;
  buyer_name: string;
  email: string;
  quantity: number;
  unit_price: number;
  total: number;
  status: 'pending' | 'paid' | 'refunded';
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  mp_status: string | null;
  created_at: string;
  paid_at: string | null;
  email_sent_at: string | null;
};

export type Ticket = { id: string; order_id: string; seq: number; code: string; created_at: string };

let client: SupabaseClient | null = null;

// Cliente con la clave secreta: solo se usa en el servidor, nunca llega al navegador.
export function db(): SupabaseClient {
  client ??= createClient(env.supabaseUrl(), env.supabaseKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
