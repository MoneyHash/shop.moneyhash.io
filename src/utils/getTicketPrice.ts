import { ClassOption } from './data';

const classPriceAdditionMap: Record<ClassOption, number> = {
  economy: 100,
  'premium-economy': 200,
  business: 300,
  first: 400,
};
export default function getTicketPrice({
  ticketPrice,
  classOption,
  passengers,
}: {
  ticketPrice: number;
  classOption: ClassOption;
  passengers: number;
}) {
  return (ticketPrice + classPriceAdditionMap[classOption]) * passengers;
}
