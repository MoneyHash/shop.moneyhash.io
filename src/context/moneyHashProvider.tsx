import MoneyHashHeadless from '@moneyhash/js-sdk/headless';
import { useContext, createContext } from 'react';

const MoneyHashContext = createContext<MoneyHashHeadless<'payment'> | null>(
  null,
);

export function MoneyHashProvider({
  children,
  moneyHash,
}: {
  children: React.ReactNode;
  moneyHash: MoneyHashHeadless<'payment'>;
}) {
  return (
    <MoneyHashContext.Provider value={moneyHash}>
      {children}
    </MoneyHashContext.Provider>
  );
}

export function useMoneyHash() {
  const context = useContext(MoneyHashContext);
  if (!context) {
    throw new Error('useMoneyHash must be used within a MoneyHashProvider');
  }
  return context;
}
