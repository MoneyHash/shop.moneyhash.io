import { Controller, useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import CoverImage from '../assets/cover2.avif';
import FlyBetterImage from '../assets/emirates-fly-better-white.svg';
import PlaneIcon from '../components/icons/planeIcon';
import ClockIcon from '../components/icons/clockIcon';
import PlaneWing from '../components/icons/planeWing';
import PriceTagIcon from '../components/icons/PriceTagIcon';
import Combobox from '../components/combobox';
import DatePickerWithRange from '../components/dateRangePicker';
import NumberInput from '../components/numberInput';
import Button from '../components/button';
import Ticket from '../components/ticket';
import { airportOptions, classOptions, tickets } from '../utils/data';
import {
  type TicketSearchInfo,
  useShoppingCart,
} from '../store/useShoppingCart';

export default function Home() {
  const [ticketSearchInfo, setTicketSearchInfo] =
    useState<TicketSearchInfo | null>(null);
  const selectTicket = useShoppingCart(state => state.selectTicket);
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <NavBar />

      <div className="h-[460px] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CoverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-0" />
        </div>

        <div className="relative max-w-7xl mx-auto text-left px-4 sm:px-6 lg:px-8 text-white flex flex-col h-full justify-center">
          <p className="relative text-2xl pl-5 font-serif italic drop-shadow-lg">
            Stretch out in
          </p>
          <p className="relative italic text-7xl uppercase drop-shadow-md tracking-tight font-oswald -mt-1">
            premium economy
          </p>
          <img
            src={FlyBetterImage}
            alt=""
            className="h-12 absolute right-16 top-8"
          />
        </div>
      </div>

      <main
        id="shop-sections"
        className="max-w-7xl mx-auto  px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8 space-y-20 relative"
      >
        <TicketForm onSearch={setTicketSearchInfo} />

        {ticketSearchInfo ? (
          <div className="mt-10 space-y-4 max-w-2xl mx-auto">
            {tickets.map(ticket => (
              <button
                type="button"
                key={ticket.id}
                className="block w-full focus:outline-none hover:-translate-y-1 transition-transform duration-300 rounded-2xl focus-visible:ring focus-visible:ring-ring/30"
                onClick={() => {
                  selectTicket({ ...ticket, ...ticketSearchInfo });
                  navigate('/checkout');
                }}
              >
                <Ticket
                  {...ticket}
                  {...ticketSearchInfo}
                  date={ticketSearchInfo.dates.from!}
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Search for flights to see available tickets...
          </p>
        )}
      </main>
    </div>
  );
}

function TicketForm({
  onSearch,
}: {
  onSearch: (info: TicketSearchInfo) => void;
}) {
  const { control, handleSubmit } = useForm<TicketSearchInfo>({
    mode: 'onTouched',
    defaultValues: {
      departureAirport: '',
      arrivalAirport: '',
      passengers: '1',
      classOption: 'economy',
    },
    shouldFocusError: true,
  });
  const { arrivalAirport, departureAirport } = useWatch({ control });

  return (
    <section
      id="#book"
      className="bg-white shadow-lg rounded-md -mt-20 overflow-hidden"
    >
      <div className="flex divide-x-2  text-center">
        <div className="flex-1 flex items-center justify-center space-x-2 border-b-2 p-4 border-b-primary">
          <PlaneIcon className="h-6 rotate-45" />
          <p className="text-lg font-medium">Search flights</p>
        </div>
        <div className="hidden flex-1 text-slate-500 md:flex items-center justify-center space-x-2 border-b p-4">
          <PriceTagIcon className="h-6 -rotate-90" />
          <p className="text-lg font-thin">Manage booking / Check in</p>
        </div>
        <div className="hidden  flex-1 text-slate-500 md:flex items-center justify-center space-x-2 border-b p-4">
          <PlaneWing className="h-6 " />
          <p className="text-lg font-thin">What&apos;s on your flight</p>
        </div>
        <div className="hidden  flex-1 text-slate-500 md:flex items-center justify-center space-x-2 border-b p-4">
          <ClockIcon className="h-6 " />
          <p className="text-lg font-thin">Flight status</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSearch)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            control={control}
            rules={{ required: true }}
            name="departureAirport"
            render={({ field }) => (
              <Combobox
                label="Departing - Returning"
                options={airportOptions.filter(o => o.value !== arrivalAirport)}
                format={option =>
                  `${option.label} (${option.value.toUpperCase()})`
                }
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            rules={{ required: true }}
            name="arrivalAirport"
            render={({ field }) => (
              <Combobox
                label="Arrival airport"
                options={airportOptions.filter(
                  o => o.value !== departureAirport,
                )}
                format={option =>
                  `${option.label} (${option.value.toUpperCase()})`
                }
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            rules={{
              required: true,
              validate: v => Boolean(v.from && v.to) || 'required',
            }}
            name="dates"
            render={({ field }) => (
              <DatePickerWithRange label="Departure date" {...field} />
            )}
          />

          <Controller
            control={control}
            rules={{ required: true }}
            name="passengers"
            render={({ field }) => <NumberInput min={1} max={12} {...field} />}
          />

          <Controller
            control={control}
            rules={{ required: true }}
            name="classOption"
            render={({ field }) => (
              <Combobox label="Class" options={classOptions} {...field} />
            )}
          />

          <Button type="submit">Search flights</Button>
        </div>
      </form>
    </section>
  );
}
