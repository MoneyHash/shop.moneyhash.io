import { nanoid } from 'nanoid';
import { Currency } from '../store/useCurrency';

export type Ticket = {
  id: string;
  boardingTime: string;
  departureTime: string;
  arriveTime: string;
  price: Record<Currency, number>;
};
export type ClassOption = 'economy' | 'premium-economy' | 'business' | 'first';

export const tickets: Ticket[] = [
  {
    id: nanoid(),
    boardingTime: '02:00 AM',
    departureTime: '04:30 AM',
    arriveTime: '06:55 AM',
    price: {
      EGP: 8000,
      USD: 500,
      AED: 2000,
    },
  },
  {
    id: nanoid(),
    boardingTime: '04:00 PM',
    departureTime: '04:45 PM',
    arriveTime: '06:55 PM',
    price: {
      EGP: 10000,
      USD: 600,
      AED: 2500,
    },
  },
  {
    id: nanoid(),
    boardingTime: '07:00 PM',
    departureTime: '9:00 PM',
    arriveTime: '11:55 PM',
    price: {
      EGP: 12000,
      USD: 700,
      AED: 3000,
    },
  },
];

export const classOptions: { label: string; value: ClassOption }[] = [
  { label: 'Economy Class', value: 'economy' },
  {
    label: 'Premium Economy',
    value: 'premium-economy',
  },
  {
    label: 'Business Class',
    value: 'business',
  },
  {
    label: 'First Class',
    value: 'first',
  },
];

export const airportOptions = [
  { label: 'Cairo, Egypt', value: 'cai' },
  {
    label: 'Dubai, United Arab Emirates',
    value: 'dxb',
  },
  {
    label: 'Paris, France',
    value: 'cdg',
  },
  {
    label: 'New York, USA ',
    value: 'jfk',
  },
  {
    label: 'Sydney, Australia',
    value: 'syd',
  },
  {
    label: 'Tokyo, Japan',
    value: 'nrt',
  },
  {
    label: 'Jeddah, Saudi Arabia',
    value: 'jed',
  },
];
