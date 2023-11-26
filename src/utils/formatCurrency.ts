export default function formatCurrency({
  currency,
  amount,
}: {
  currency: string;
  amount: number;
}) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}
