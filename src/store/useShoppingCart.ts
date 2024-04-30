import { create } from 'zustand';
import { type DateRange } from 'react-day-picker';
import { type ClassOption } from '../utils/data';
import { type Currency } from './useCurrency';

export type TicketSearchInfo = {
  departureAirport: string;
  arrivalAirport: string;
  dates: DateRange;
  passengers: string;
  classOption: ClassOption;
  arriveTime: string;
  boardingTime: string;
  departureTime: string;
  price: Record<Currency, number>;
};

type State = {
  selectedTicket: TicketSearchInfo | null;
};

type Action = {
  selectTicket: (ticket: TicketSearchInfo) => void;
  emptyCart: () => void;
};

const initialCart: TicketSearchInfo | null = null;

export const useShoppingCart = create<State & Action>(set => ({
  selectedTicket: initialCart,
  selectTicket: ticket => set({ selectedTicket: ticket }),
  emptyCart: () => set({ selectedTicket: null }),
}));
