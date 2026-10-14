export const EVENT = {
  name: 'Corazón a Corazón',
  year: 2027,
  tagline: 'De gloria en gloria',
  dates: '8 y 9 de febrero',
  // Inicio para la cuenta regresiva (hora de Argentina). Ajustar cuando se confirme el horario.
  startsAt: '2027-02-08T00:00:00-03:00',
  address: 'J. M. Rosas 4357',
  city: 'San Juan',
  country: 'Argentina',
  ministry: 'Ministerio Cristo la Solución',
  // Pegar acá el link de venta de entradas cuando exista; mientras tanto los botones llevan a #info.
  registrationUrl: '' as string,
};

export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`${EVENT.address}, ${EVENT.city}, ${EVENT.country}`);

export const VERSE = {
  ref: '2 Corintios 3:18',
  // Explicación del lema: un párrafo por elemento
  about: [
    'Cristo le dio fin al velo que nos separaba y, sentados a sus pies, nos miramos como en espejo, a la luz de su palabra, fiel reflejo de su amor y resplandor de su eterna gracia.',
    'Tenemos su palabra y su poder en nuestros corazones: el momento llegó.',
    'Se vuelve a abrir la puerta para ser llevados a un nuevo tiempo; la primera gloria pasó y ha llegado la postrera.',
  ],
  closing: 'De corazón a corazón',
  closingScript: 'de gloria en gloria',
  text: 'Por tanto, nosotros todos, mirando a cara descubierta como en un espejo la gloria del Señor, somos transformados de gloria en gloria en la misma imagen, como por el Espíritu del Señor.',
};

export type Speaker = {
  first: string;
  last: string;
  role: string;
  card: string; // color de la columna
  spot: string; // fondo del panel destacado
  ink: string; // color de texto del panel
  photo: { src: string; w: number; h: number };
  nameImg?: { src: string; w: number; h: number };
};

export const SPEAKERS: Speaker[] = [
  {
    first: 'Juan', last: 'Crudo', role: 'Apóstol',
    card: '#FA5F49', spot: '#FA5F49', ink: '#FEF7EC',
    photo: { src: '/img/crudo-photo.webp', w: 786, h: 837 },
    nameImg: { src: '/img/crudo-name.webp', w: 810, h: 559 },
  },
  {
    first: 'Sergio', last: 'Belart', role: 'Pastor',
    card: '#F9A59A', spot: '#95B8F6', ink: '#FEF7EC',
    photo: { src: '/img/belart-photo.webp', w: 540, h: 1000 },
    nameImg: { src: '/img/belart-name.webp', w: 931, h: 557 },
  },
  {
    first: 'Marco', last: 'Barrientos', role: 'Salmista',
    card: '#F9D99A', spot: '#F9A59A', ink: '#6D6D6F',
    photo: { src: '/img/marco-photo.webp', w: 743, h: 894 },
    nameImg: { src: '/img/marco-name.webp', w: 956, h: 415 },
  },
  {
    first: 'Eddie', last: 'Nunes', role: 'Pastor',
    card: '#E8A28F', spot: '#ADD5FA', ink: '#6D6D6F',
    photo: { src: '/img/nunes-photo.webp', w: 642, h: 874 },
    nameImg: { src: '/img/nunes-name.webp', w: 737, h: 480 },
  },
  {
    first: 'German', last: 'Ponce', role: 'Pastor',
    card: '#ADD5FA', spot: '#F9D99A', ink: '#6D6D6F',
    photo: { src: '/img/ponce-photo.webp', w: 766, h: 900 },
    nameImg: { src: '/img/ponce-name.webp', w: 1666, h: 686 },
  },
];
