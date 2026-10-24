export const EVENT = {
  name: 'Corazón a Corazón',
  year: 2027,
  tagline: 'De gloria en gloria',
  dates: '8 y 9 de febrero',
  // Inicio para la cuenta regresiva (hora de Argentina). Ajustar cuando se confirme el horario.
  startsAt: '2027-02-08T00:00:00-03:00',
  address: 'J. M. Rosas 4357',
  city: 'San Justo',
  province: 'Buenos Aires',
  country: 'Argentina',
  ministry: 'Ministerio Cristo la Solución',
  // A dónde llevan "Quiero ir" y "Comprar entrada". '/entradas' es la venta propia con Mercado Pago.
  registrationUrl: '/entradas' as string,
};

// Venta de entradas: una sola entrada, válida para todos los días, sin cupo.
export const TICKET = {
  title: 'Entrada Corazón a Corazón 2027',
  price: 50000, // en pesos argentinos
  maxPerOrder: 10,
};

export const formatARS = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`${EVENT.address}, ${EVENT.city}, ${EVENT.province}, ${EVENT.country}`);

export const VERSE = {
  ref: '2 Corintios 3:18',
  // Explicación del lema: un párrafo por elemento
  about: [
    // Aniversario: 35 años de la iglesia
    'Hace 35 años, nuestros pastores Alfredo y Celina Dimiro fundaron la Iglesia Cristo La Solución en la ciudad de San Justo.  Hace 35 años comenzó una historia de fe, obediencia y fidelidad a Dios.  35 años siendo testigos de Su fidelidad.  35 años siendo formados por Su Palabra.  35 años orando juntos, creciendo juntos y edificando la iglesia local.  35 años compartiendo el Evangelio en nuestra ciudad, amando a las personas y alcanzando a los necesitados.  35 años creyendo, sirviendo y caminando juntos como familia de la fe.  35 años viendo la gloria de Dios en medio nuestro.  Y aunque celebramos con gratitud todo lo que Dios ha hecho, nuestra mirada sigue puesta en lo que viene. Porque todavía hay más por conocer de Su presencia, más por experimentar de Su poder y más por hacer para Su gloria.  35 años de fidelidad.  35 años de gloria.',
    'Y todavía creemos que hay más.',
  ],
  closing: 'De corazón a corazón',
  closingScript: 'de gloria en gloria',
  text: 'Por tanto, nosotros todos, mirando a cara descubierta como en un espejo la gloria del Señor, somos transformados de gloria en gloria en la misma imagen, como por el Espíritu del Señor.',
};

export type Speaker = {
  first: string;
  last: string;
  role: string;
  bio: string; // descripción debajo del nombre en el panel destacado
  card: string; // color de la columna
  spot: string; // fondo del panel destacado
  ink: string; // color de texto del panel
  photo: { src: string; w: number; h: number };
  nameImg?: { src: string; w: number; h: number };
};

export const SPEAKERS: Speaker[] = [
  {
    first: 'Juan', last: 'Crudo', role: 'Apóstol',
    bio: 'Líder del ministerio Cristo la Solución, en Buenos Aires, Argentina. Su labor pastoral está centrada en la enseñanza bíblica y el acompañamiento espiritual de la comunidad.',
    card: '#FA5F49', spot: '#FA5F49', ink: '#FEF7EC',
    photo: { src: '/img/crudo-photo.webp', w: 786, h: 837 },
    nameImg: { src: '/img/crudo-name.webp', w: 810, h: 559 },
  },
  {
    first: 'Sergio', last: 'Belart', role: 'Pastor',
    bio: 'Pastor de la iglesia Cita con la Vida y autor de libros. Recientemente lanzó una nueva edición de su obra Se necesita un muchacho.',
    card: '#F9A59A', spot: '#95B8F6', ink: '#FEF7EC',
    photo: { src: '/img/belart-photo.webp', w: 540, h: 1000 },
    nameImg: { src: '/img/belart-name-2026.webp', w: 1139, h: 687 },
  },
  {
    first: 'Marco', last: 'Barrientos', role: 'Salmista',
    bio: 'Pastor, cantante y referente de la música cristiana. A través de la adoración, la enseñanza y sus libros, ha desarrollado una reconocida trayectoria internacional.',
    card: '#F9D99A', spot: '#F9A59A', ink: '#6D6D6F',
    photo: { src: '/img/marco-photo.webp', w: 743, h: 894 },
    nameImg: { src: '/img/marco-name-2026.webp', w: 1382, h: 608 },
  },
  {
    first: 'Eddie', last: 'Nunes', role: 'Pastor',
    bio: 'Pastor de Zion Church, en Lisboa, Portugal, y referente del movimiento Dunamis. Su labor se caracteriza por impulsar una generación apasionada por la presencia de Dios y el avivamiento.',
    card: '#E8A28F', spot: '#ADD5FA', ink: '#6D6D6F',
    photo: { src: '/img/nunes-photo.webp', w: 642, h: 874 },
    nameImg: { src: '/img/nunes-name-2026.webp', w: 1101, h: 723 },
  },
  {
    first: 'German', last: 'Ponce', role: 'Pastor',
    bio: 'Líder de la iglesia Cristo Ebenezer, en Honduras. Su trayectoria se distingue por la predicación de la Palabra y su énfasis en la restauración espiritual.',
    card: '#ADD5FA', spot: '#F9D99A', ink: '#6D6D6F',
    photo: { src: '/img/ponce-photo-2026.webp', w: 646, h: 900 },
    nameImg: { src: '/img/ponce-name-2026.webp', w: 1098, h: 770 },
  },
];
