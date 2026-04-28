import { nanoid } from 'nanoid';

export type Currency = 'USD' | 'EGP' | 'SAR' | 'AED' | 'KWD' | 'ZAR';

export type Product = {
  id: string;
  descriptionKey: string;
  imageSrc: string;
  imageAlt: string;
  price: Record<Currency, number>;
  rating: 1 | 2 | 3 | 4 | 5;
  category: 'Shirts' | 'Bags';
  // Chatbot search products tool
  name: string;
  color: string;
  description: string;
  nameKey: string;
};

export const products: Product[] = [
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Basic Tee',
    color: 'Black',
    description:
      'A wardrobe essential crafted from soft, breathable cotton. The classic black colorway offers effortless versatility — dress it up or keep it casual.',
    nameKey: 'product.items.basicTee',
    descriptionKey: 'product.colors.black',
    imageSrc: '/images/products/product-page-01-related-product-01.png',
    imageAlt: "Front of men's Basic Tee in black.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 90,
      AED: 90,
      KWD: 10,
      ZAR: 650,
    },
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Basic Tee',
    color: 'Aspen White',
    description:
      'A clean, minimalist tee in a soft off-white tone. Made from lightweight cotton for all-day comfort, perfect as a standalone piece or layered look.',
    nameKey: 'product.items.basicTee',
    descriptionKey: 'product.colors.aspenWhite',
    imageSrc: '/images/products/product-page-01-related-product-02.png',
    imageAlt: "Front of men's Basic Tee in white.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 85,
      AED: 80,
      KWD: 9,
      ZAR: 650,
    },
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Basic Tee',
    color: 'Charcoal',
    description:
      'The same everyday essential in a rich charcoal gray. A neutral that pairs with everything while adding a bit more depth to your outfit.',
    nameKey: 'product.items.basicTee',
    descriptionKey: 'product.colors.charcoal',
    imageSrc: '/images/products/product-page-01-related-product-03.png',
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 95,
      AED: 100,
      KWD: 11,
      ZAR: 650,
    },
    rating: 3,
  },
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Artwork Tee',
    color: 'Charcoal',
    description:
      'A statement tee featuring an isometric cube graphic composed of delicate white and brown dots on a soft peach background. Artistic, understated, and unique.',
    nameKey: 'product.items.artworkTee',
    descriptionKey: 'product.colors.charcoal',
    imageSrc: '/images/products/product-page-01-related-product-04.png',
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 70,
      AED: 65,
      KWD: 7,
      ZAR: 650,
    },
    rating: 4,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'Nomad Pouch',
    color: 'White and Black',
    description:
      'A compact travel pouch in white fabric with a smooth zipper and black elastic loop. Ideal for organizing cables, cosmetics, or daily essentials.',
    nameKey: 'product.items.nomadPouch',
    descriptionKey: 'product.colors.whiteAndBlack',
    imageSrc: '/images/products/category-page-07-product-01.png',
    imageAlt:
      'White fabric pouch with white zipper, black zipper pull, and black elastic loop.',
    price: {
      USD: 50,
      EGP: 1500,
      SAR: 95,
      AED: 100,
      KWD: 12,
      ZAR: 900,
    },
    rating: 4,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'Zip Tote Basket',
    color: 'Washed Black',
    description:
      'A structured tote with a washed black canvas body, durable black straps, and refined tan leather handles and accents. Spacious enough for work or weekend use.',
    nameKey: 'product.items.zipToteBasket',
    descriptionKey: 'product.colors.washedBlack',
    imageSrc: '/images/products/category-page-07-product-02.png',
    imageAlt:
      'Front of tote bag with washed black canvas body, black straps, and tan leather handles and accents.',
    price: {
      USD: 140,
      EGP: 4000,
      SAR: 75,
      AED: 80,
      KWD: 9,
      ZAR: 2500,
    },
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'Medium Stuff Satchel',
    color: 'Blue',
    description:
      'A bold blue satchel with a drawstring top closure, front zipper pouch, and sturdy black straps. Designed for those who need both style and functionality on the go.',
    nameKey: 'product.items.mediumStuffSatchel',
    descriptionKey: 'product.colors.blue',
    imageSrc: '/images/products/category-page-07-product-03.png',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    price: {
      USD: 220,
      EGP: 6400,
      SAR: 65,
      AED: 70,
      KWD: 8,
      ZAR: 4000,
    },
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'High Wall Tote',
    color: 'Black and Orange',
    description:
      'A high-capacity tote in black canvas with an eye-catching orange drawstring top and robust handles. Perfect for gym, market, or any adventure that demands extra room.',
    nameKey: 'product.items.highWallTote',
    descriptionKey: 'product.colors.blackAndOrange',
    imageSrc: '/images/products/category-page-07-product-04.png',
    imageAlt:
      'Front of zip tote bag with black canvas, black handles, and orange drawstring top.',
    price: {
      USD: 210,
      EGP: 6200,
      SAR: 82,
      AED: 50,
      KWD: 7,
      ZAR: 3800,
    },
    rating: 4,
  },
];

const productSections: { category: string; products: Product[] }[] = [
  {
    category: 'Shirts',
    products: products.filter(product => product.category === 'Shirts'),
  },
  {
    category: 'Bags',
    products: products.filter(product => product.category === 'Bags'),
  },
];

export default productSections;
