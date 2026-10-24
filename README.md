# Corazón a Corazón 2027 — Web de la conferencia

Next.js 15 (App Router) + React 19. La web es estática; la venta de entradas usa Mercado Pago + Supabase + Resend (ver [ENTRADAS.md](ENTRADAS.md)).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm start
```

## Dónde se cambia cada cosa

- `lib/event.ts`: datos del evento (fecha, hora de inicio para la cuenta regresiva, dirección, link de inscripción, versículo) y la lista de oradores con sus colores y fotos.
- `components/`: una sección por archivo (Hero, Marquees, Verse, Speakers, Info, Countdown, Footer).
- `app/globals.css`: paleta oficial (azul #95B8F6, celeste #ADD5FA, amarillo #F9D99A, rosa #F9A59A, coral #FA5F49, gris #6D6D6F para textos; sin negro), animaciones y responsive.
- `public/img/`: recortes optimizados (webp) de las piezas del flyer.
- `app/opengraph-image.jpg` / `app/icon.png`: imagen al compartir el link y favicon.

## Pendientes

- Venta de entradas: configurar Supabase, Resend, Mercado Pago y las variables de Vercel según [ENTRADAS.md](ENTRADAS.md). "Quiero ir" y "Comprar entrada" llevan a `/entradas` (`registrationUrl` en `lib/event.ts`).
- `startsAt`: ajustar la hora real de inicio.
- `NEXT_PUBLIC_SITE_URL` en el hosting (`https://www.conferenciadecorazonacorazon.com`) para que la vista previa al compartir use el dominio correcto.

## Deploy

Vercel: importar el repo y deployar (detecta Next.js solo). También funciona en Netlify o cualquier hosting con Node.

## Animaciones

- Al cargar: barras, lockup, ícono y "a corazón" (CSS keyframes).
- Con scroll: barra de progreso, parallax del hero, versículo palabra por palabra y revelado de secciones con `animation-timeline` (Chrome, Edge, Safari 26+). En navegadores sin soporte el contenido se muestra completo y estático.
- Respeta `prefers-reduced-motion`.
