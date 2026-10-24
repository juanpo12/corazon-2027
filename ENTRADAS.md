# Venta de entradas (Mercado Pago + Supabase + Resend)

Una sola entrada de **$ 50.000**, válida para todos los días, sin cupo. Se cambia en `lib/event.ts` (`TICKET`).

## Cómo funciona

1. `/entradas`: la persona pone nombre, email y cantidad (1 a 10) y paga con Mercado Pago (Checkout Pro).
2. Mercado Pago avisa a `/api/mp/webhook`. El servidor consulta el pago a Mercado Pago y, si está **aprobado** y el monto coincide, marca la compra como pagada y emite **un QR por entrada**. Es seguro que avise varias veces: no se duplican entradas.
3. Le llega un mail con los QR y un link a `/mis-entradas/<clave>`, donde también los puede ver.
4. Al volver de Mercado Pago (`/entradas/gracias`) también se confirma el pago, por si el aviso tarda.
5. Si el pago se devuelve o hay contracargo, las entradas quedan **anuladas** solas.
6. En la puerta: `/control` (con clave). Escanea con la cámara del celular y muestra en pantalla completa:
   - verde **Puede pasar**,
   - naranja **Ya ingresó hoy** (con la hora),
   - rojo **QR no válido** o **Entrada anulada**.

   Cada entrada tiene **un ingreso por día** (hora de Argentina). Pestaña **Buscar**: por nombre o email, para cuando a alguien no le carga el QR.
7. `/control/panel`: entradas vendidas, recaudado, ingresos de hoy, lista de compras, **Reenviar** mail y **Descargar Excel**.

## Puesta en marcha (una sola vez)

### 1. Supabase (base de datos)
1. Crear cuenta en https://supabase.com y un proyecto nuevo (región São Paulo). Guardar la contraseña de la base.
2. **SQL Editor → New query**: pegar todo `supabase/schema.sql` y **Run**.
3. **Project Settings → API Keys**: copiar la **secret key** (`sb_secret_…`). En proyectos viejos es la `service_role`. Copiar también la **Project URL** (`https://xxxx.supabase.co`), que está en **Project Settings → Data API**.
4. La secret key nunca va en el código ni en el navegador: solo en Vercel.

### 2. Resend (mails)
1. Crear cuenta en https://resend.com.
2. **Domains → Add Domain**: agregar el dominio de la iglesia y cargar los registros DNS que indica, donde esté el dominio. Esperar a que diga *Verified*.
   - Sin dominio verificado, Resend solo deja mandar mails a la propia cuenta: sirve para probar, no para vender.
3. **API Keys → Create API Key** (permiso *Sending access*). Copiarla.

### 3. Mercado Pago
Seguir la guía para el pastor. Hacen falta: Access Token de **prueba**, Access Token de **producción** y la **clave secreta** del webhook.

Webhook (en Tus integraciones → la aplicación → Webhooks → Configurar notificaciones):
- URL: `https://www.conferenciadecorazonacorazon.com/api/mp/webhook`, en modo de prueba y en modo productivo.
- Evento: **Pagos**.

### 4. Variables en Vercel
Vercel → el proyecto → **Settings → Environment Variables**. Cargarlas y después hacer **Redeploy**.

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.conferenciadecorazonacorazon.com`, sin `/` al final |
| `MP_ACCESS_TOKEN` | Access Token de Mercado Pago. Primero el de **prueba**; para vender, el de **producción** |
| `MP_WEBHOOK_SECRET` | Clave secreta del webhook de Mercado Pago |
| `SUPABASE_URL` | Project URL de Supabase |
| `SUPABASE_SECRET_KEY` | Secret key de Supabase (o `SUPABASE_SERVICE_ROLE_KEY` con la service_role) |
| `RESEND_API_KEY` | API key de Resend |
| `EMAIL_FROM` | `Corazón a Corazón <entradas@dominio-verificado.com>` |
| `EMAIL_REPLY_TO` | (opcional) mail de la iglesia para respuestas |
| `CONTROL_PIN` | Clave del equipo de puerta. Que sea larga: no 1234 |
| `AUTH_SECRET` | Texto largo al azar (por ejemplo, de `openssl rand -hex 32`). Si se cambia, se cierran todas las sesiones de control |

`MP_API_URL` y `RESEND_API_URL` existen solo para pruebas locales con servidores falsos: **no** se cargan en Vercel.

### 5. Probar antes de vender
1. Con el Access Token de **prueba** cargado, comprar desde `/entradas` en una ventana de incógnito, logueado con la **cuenta de prueba compradora**.
2. Pagar con una tarjeta de prueba con titular **APRO** (aprobado). Probar también con **OTHE** (rechazado).
3. Verificar que:
   - llega el mail,
   - `/mis-entradas` muestra los QR,
   - `/control` los escanea en verde, y en naranja la segunda vez,
   - el panel suma la venta.
4. Cambiar `MP_ACCESS_TOKEN` al de **producción**, hacer Redeploy y hacer una compra real chica para confirmar.

## El día del evento
- Cada persona de la puerta abre `https://www.conferenciadecorazonacorazon.com/control` en su celular, pone la clave y da permiso a la cámara. Pueden ser varios celulares a la vez.
- Hace falta internet en la puerta (datos o wifi).
- Si a alguien no le carga el QR: pestaña **Buscar** → nombre o email → **Ingresar**.

## Archivos
- `supabase/schema.sql`: tablas (`cac_orders`, `cac_tickets`, `cac_checkins`) y función `cac_mark_order_paid`.
- `lib/server/*`: Mercado Pago, base de datos, mails, sesión del control, ingresos.
- `app/api/*`: checkout, webhook, imagen QR, control (login, checkin, search, export, resend).
- `app/entradas`, `app/mis-entradas`, `app/control`: pantallas.
