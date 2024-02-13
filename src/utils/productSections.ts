import { nanoid } from 'nanoid';

export type Currency = 'EUR' | 'EGP' | 'ZAR';

export type Product = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  price: Record<Currency, number>;
  description: string;
  rating: 1 | 2 | 3 | 4 | 5;
  category: 'Fleeces' | 'Inline Skating';
};

export const products: Product[] = [
  {
    id: nanoid(),
    category: 'Fleeces',
    name: 'Hiking Fleece Jacket - Hood',
    imageSrc:
      'https://contents.mediadecathlon.com/p2327732/k$df7ae2aa5a9687dd6203bfbc828a9265/sq/veste-polaire-de-randonnee-mh520-hood-homme.jpg?format=auto&f=969x969',
    imageAlt: 'Hiking Fleece Jacket - MH520 Hood.',
    price: {
      EUR: 20,
      EGP: 660,
      ZAR: 400,
    },
    description: 'A fitted cut, high collar and hood with a sporty style',
    rating: 4,
  },
  {
    id: nanoid(),
    category: 'Fleeces',
    name: 'Hiking Fleece Vest - MH120',
    imageSrc:
      'https://contents.mediadecathlon.com/p2084319/k$88f527c9857c6ed5e15a2726ae16780d/sq/gilet-polaire-de-randonnee-mh120-homme.jpg?format=auto&f=969x969',
    imageAlt: 'Hiking Fleece Vest - MH120',
    price: {
      EUR: 15,
      EGP: 495,
      ZAR: 300,
    },
    description:
      'Heat without the thickness! You will appreciate this fleece vest',
    rating: 4,
  },
  {
    id: nanoid(),
    category: 'Fleeces',
    name: 'Reversible Hunting Fleece',
    imageSrc:
      'https://contents.mediadecathlon.com/p2665511/k$dfbbd4b2bd820f7830c91c932339e78b/sq/polaire-chasse-reversible-vertorange-fluo-500.jpg?format=auto&f=969x969',
    imageAlt: 'Reversible Hunting Fleece',
    price: {
      EUR: 45,
      EGP: 1485,
      ZAR: 900,
    },
    description: 'Designed for hunters posted on big game drives.',
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Fleeces',
    name: "Men's warm sailing fleece",
    imageSrc:
      'https://contents.mediadecathlon.com/p2492469/k$8cdb8f42655e59fde821beb6b0c1c350/sq/polaire-chaude-de-voile-homme-sailing-500-navy.jpg?format=auto&f=969x969',
    imageAlt: "Men's warm sailing fleece SAILING",
    price: {
      EUR: 40,
      EGP: 1320,
      ZAR: 800,
    },
    description: 'This warm and water-repellent boating fleece jacket.',
    rating: 5,
  },

  {
    id: nanoid(),
    category: 'Inline Skating',
    name: 'Adult fitness roller FIT500 Blue Red',
    price: {
      EUR: 85,
      EGP: 2805,
      ZAR: 1700,
    },
    description: 'Comfortable and efficient, ride with complete freedom.',
    imageSrc:
      'https://contents.mediadecathlon.com/p2152407/k$ce0adf13c3f1b28abe45fc86f7c22cd3/sq/roller-fitness-adulte-fit500-bleu-rouge.jpg?format=auto&f=969x969',
    imageAlt: 'Adult fitness roller FIT500 Blue Red',
    rating: 4,
  },
  {
    id: nanoid(),
    category: 'Inline Skating',
    name: "Children's fitness roller FIT 5 Jr",
    price: {
      EUR: 70,
      EGP: 2310,
      ZAR: 1400,
    },
    description:
      'A durable and comfortable inline skate, to support your child in development.',
    imageSrc:
      'https://contents.mediadecathlon.com/p2152388/k$5454371e2a1eaf95b964be1adac2db92/sq/roller-fitness-enfant-fit-5-jr-racing-bleu.jpg?format=auto&f=969x969',
    imageAlt: "Children's fitness roller FIT 5 Jr racing blue",
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Inline Skating',
    name: 'Adult fitness roller FIT500 Ice Gray',
    price: {
      EUR: 85,
      EGP: 2805,
      ZAR: 1700,
    },
    description: 'Comfortable and efficient, ride with complete freedom.',
    imageSrc:
      'https://contents.mediadecathlon.com/p2152398/k$edc7081f9bd34cf467fdb11cfff08ef2/sq/roller-fitness-adulte-fit500-ice-grey.jpg?format=auto&f=969x969',
    imageAlt: 'Adult fitness roller FIT500 Ice Gray',
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Inline Skating',
    name: 'Adult Freeride Roller MF500',
    price: {
      EUR: 95,
      EGP: 3135,
      ZAR: 1900,
    },
    description:
      'For venturing into town, slaloming or simply rollerblading, this is perfect.',
    imageSrc:
      'https://contents.mediadecathlon.com/p2152435/k$0201222928d565726697879b56dfe12a/sq/roller-freeride-adulte-mf500-light-khaki.jpg?format=auto&f=969x969',
    imageAlt: 'Adult Freeride Roller MF500 Light Khaki',
    rating: 4,
  },
];

const productSections: { category: string; products: Product[] }[] = [
  {
    category: 'Fleeces',
    products: products.filter(product => product.category === 'Fleeces'),
  },
  {
    category: 'Inline Skating',
    products: products.filter(product => product.category === 'Inline Skating'),
  },
];

export default productSections;
