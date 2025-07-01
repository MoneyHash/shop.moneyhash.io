import { Fragment, useState } from 'react';

import { type Card } from '@moneyhash/js-sdk/headless';
import { CreditCardIcon, LoaderIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SavedCards({
  cards,
  onPay,
}: {
  cards: Card[];
  onPay: (options: { cardId: string; cvv: string }) => Promise<any>;
}) {
  const [selectedCard, setSelectedCard] = useState(cards[0].id);
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Select value={selectedCard} onValueChange={setSelectedCard}>
        <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0 border border-input rounded-md">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:pl-2 [&_*[role=option]]:pr-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex-1 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          {cards.map((card, index) => (
            <Fragment key={card.id}>
              <SelectItem value={card.id} className="flex items-center">
                <img src={card.logo} alt="" className="h-4 w-4 shrink-0" />
                <span className="truncate">{`${
                  card.first6Digits || '••••••'
                }••••••${card.last4}`}</span>

                <span className="ml-auto">
                  {card.expiryMonth} / {card.expiryYear}
                </span>
              </SelectItem>
              {index < cards.length - 1 && <SelectSeparator />}
            </Fragment>
          ))}
        </SelectContent>
      </Select>

      <Input
        label="CVV"
        className="h-9"
        maxLength={4}
        value={cvv}
        onChange={e => setCvv(e.target.value)}
      />

      <Button
        className="gap-1"
        variant="outline"
        disabled={loading}
        onClick={() => {
          if (cvv.length < 3) {
            toast.error('Please enter a valid CVV');
            return;
          }
          setLoading(true);
          onPay({ cardId: selectedCard, cvv }).finally(() => {
            setLoading(false);
          });
        }}
      >
        Pay{' '}
        {loading ? (
          <LoaderIcon className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCardIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
