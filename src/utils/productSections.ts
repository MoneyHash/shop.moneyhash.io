import { nanoid } from 'nanoid';

export type Currency = 'USD' | 'EGP' | 'SAR' | 'AED';

export type Product = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  price: Record<Currency, number>;
  description: string;
  rating: 1 | 2 | 3 | 4 | 5;
  category: 'Shirts' | 'Bags';
};

export const products: Product[] = [
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Basic Tee',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 120,
      AED: 90,
    },
    description: 'Black',
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Basic Tee',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
    imageAlt: "Front of men's Basic Tee in white.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 120,
      AED: 80,
    },
    description: 'Aspen White',
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Basic Tee',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-03.jpg',
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 120,
      AED: 100,
    },
    description: 'Charcoal',
    rating: 3,
  },
  {
    id: nanoid(),
    category: 'Shirts',
    name: 'Artwork Tee',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg',
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: {
      USD: 35,
      EGP: 1000,
      SAR: 120,
      AED: 65,
    },
    description: 'Charcoal',
    rating: 4,
  },

  {
    id: nanoid(),
    category: 'Bags',
    name: 'Nomad Pouch',
    price: {
      USD: 50,
      EGP: 1500,
      SAR: 180,
      AED: 100,
    },
    description: 'White and Black',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg',
    imageAlt:
      'White fabric pouch with white zipper, black zipper pull, and black elastic loop.',
    rating: 4,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'Zip Tote Basket',
    price: {
      USD: 140,
      EGP: 4000,
      SAR: 520,
      AED: 80,
    },
    description: 'Washed Black',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-02.jpg',
    imageAlt:
      'Front of tote bag with washed black canvas body, black straps, and tan leather handles and accents.',
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'Medium Stuff Satchel',
    price: {
      USD: 220,
      EGP: 6400,
      SAR: 825,
      AED: 70,
    },
    description: 'Blue',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-03.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    rating: 5,
  },
  {
    id: nanoid(),
    category: 'Bags',
    name: 'High Wall Tote',
    price: {
      USD: 210,
      EGP: 6200,
      SAR: 780,
      AED: 50,
    },
    description: 'Black and Orange',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-07-product-04.jpg',
    imageAlt:
      'Front of zip tote bag with black canvas, black handles, and orange drawstring top.',
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
