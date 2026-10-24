import 'server-only';

// Variables de entorno (se cargan en Vercel → Settings → Environment Variables). Ver ENTRADAS.md.
function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

export const env = {
  siteUrl: () =>
    (process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    ).replace(/\/$/, ''),
  mpAccessToken: () => need('MP_ACCESS_TOKEN'),
  // Opcional pero recomendada: valida que los avisos vengan de Mercado Pago
  mpWebhookSecret: () => process.env.MP_WEBHOOK_SECRET || '',
  supabaseUrl: () => need('SUPABASE_URL'),
  supabaseKey: () => process.env.SUPABASE_SECRET_KEY || need('SUPABASE_SERVICE_ROLE_KEY'),
  resendKey: () => need('RESEND_API_KEY'),
  emailFrom: () => process.env.EMAIL_FROM || 'Corazón a Corazón <onboarding@resend.dev>',
  emailReplyTo: () => process.env.EMAIL_REPLY_TO || '',
  controlPin: () => need('CONTROL_PIN'),
  authSecret: () => need('AUTH_SECRET'),
};
