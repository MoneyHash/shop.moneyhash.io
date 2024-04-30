import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import PlaneIcon from './icons/planeIcon';
import useCurrency, { type Currency } from '../store/useCurrency';
import formatCurrency from '../utils/formatCurrency';
import { airportOptions, classOptions, type ClassOption } from '../utils/data';
import getTicketPrice from '../utils/getTicketPrice';

export interface TicketProps {
  arriveTime: string;
  departureTime: string;
  boardingTime: string;
  departureAirport: string;
  arrivalAirport: string;
  date: Date;
  passengers: string;
  classOption: ClassOption;
  price: Record<Currency, number>;
}

export default function Ticket({
  arriveTime,
  departureTime,
  boardingTime,
  departureAirport,
  arrivalAirport,
  date,
  price,
  passengers,
  classOption,
}: TicketProps) {
  const currency = useCurrency(state => state.currency);
  return (
    <div className="flex flex-col drop-shadow-lg text-slate-900">
      <header className="relative p-4 bg-white pb-0 rounded-tr-2xl rounded-tl-2xl">
        <div>
          <p className="flex justify-between text-xs font-medium uppercase">
            <span>CXB 3452</span>
            <span>{format(date, 'dd LLL y')}</span>
          </p>
        </div>
        <div className="flex items-center space-x-6 mt-5 pb-5">
          <div className="flex flex-col items-center text-center">
            <p className="text-4xl uppercase">{departureAirport}</p>
            <p className="text-xs text-gray-500 font-light max-w-[80px]">
              {airportOptions.find(o => o.value === departureAirport)?.label}
            </p>
          </div>
          <div className="flex flex-col space-y-2.5 flex-1 items-center">
            <PlaneIcon className="h-5 text-gray-500" />
            <div className="h-px border-t-2 border-dashed self-stretch" />
            <p className="text-xs bg-gray-300 rounded-full px-2.5 py-1.5 font-normal">
              2:10 hrs
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-4xl uppercase">{arrivalAirport}</p>
            <p className="text-xs text-gray-500 font-light max-w-[80px]">
              {airportOptions.find(o => o.value === arrivalAirport)?.label}
            </p>
          </div>
        </div>
      </header>
      <div className="ticket-rip relative h-10 flex-shrink-0 mx-5 bg-white px-4">
        <dl className="flex justify-between">
          <div className="flex flex-col items-center">
            <dt className="text-sm font-normal text-gray-500">Boarding Time</dt>
            <dd className="text-lg font-normal">{boardingTime}</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-sm font-normal text-gray-500">Departure</dt>
            <dd className="text-lg font-normal">{departureTime}</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-sm font-normal text-gray-500">Arrival</dt>
            <dd className="text-lg font-normal">{arriveTime}</dd>
          </div>
        </dl>
        <div className="h-px border-t-2 border-dashed self-stretch mt-4" />
      </div>
      <div className="ticket2__body text-primary  p-8">
        <div className="mt-5 flex items-center justify-between">
          <p className="text-lg  font-medium ">
            {classOptions.find(o => o.value === classOption)?.label} from{' '}
            {formatCurrency({
              amount: getTicketPrice({
                passengers: +passengers,
                ticketPrice: price[currency],
                classOption,
              }),
              currency,
            })}
          </p>
          <ChevronRightIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
