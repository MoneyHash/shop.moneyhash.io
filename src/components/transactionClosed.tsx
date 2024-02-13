import { Link } from 'react-router-dom';

export default function TransactionClosed() {
  return (
    <div className="flex flex-col bg-white">
      <img
        src="https://www.decathlon.eg/img/cms/2023/12-DEC/Winter%20OPECO/New%20Size/website%20new%20size-04.jpg"
        alt=""
        className="object-cover w-full h-96"
      />

      <div className="flex items-center justify-center flex-1">
        <div className="max-w-xl px-4 py-8 mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your payment was canceled
          </h1>

          <p className="mt-4 text-gray-500">
            Don&apos;t worry, you can try again with a different payment method.
          </p>

          <Link
            to="/"
            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-decathlon rounded hover:bg-decathlon-dark focus:outline-none focus:ring focus:ring-decathlon/20"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
