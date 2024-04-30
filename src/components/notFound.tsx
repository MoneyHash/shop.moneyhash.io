import CoverImage from '../assets/cover.jpeg';

export default function NotFound() {
  return (
    <div className="flex flex-col bg-white">
      <div className="relative">
        <img src={CoverImage} alt="" className="object-cover w-full h-96" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="max-w-xl px-4 py-8 mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We can&apos;t find this flight.
          </h1>

          <p className="mt-4 text-gray-500">
            Try again, or return home to start from the beginning.
          </p>

          <a
            href="/"
            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:ring"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
