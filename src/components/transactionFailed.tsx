import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function TransactionFailed({
  message = 'Oh no, your payment failed',
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col">
      <img
        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
        alt=""
        className="object-cover w-full h-64"
      />

      <div className="flex items-center justify-center flex-1">
        <div className="max-w-xl px-4 py-8 mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            {message}
          </h1>

          <p className="mt-4 text-subtle">
            Don&apos;t worry, you can try again with a different payment method.
          </p>

          <Button asChild className="mt-6">
            <Link to="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
