import NavBar from '../components/navbar';
import ProductItem from '../components/productItem';
import productSections from '../utils/productSections';

export default function Home() {
  return (
    <div className="bg-white">
      <NavBar />

      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40 relative overflow-hidden sm:overflow-visible">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-decathlon sm:text-6xl">
              Decathlon Sports Shop
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              The retailer stocks a wide range of sporting goods, from tennis
              rackets to advanced scuba diving equipment...
            </p>
          </div>
          <div>
            <div className="mt-10 ">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/10-OCT/NEW%20WEBSITE/website%20new-14.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center "
                        />
                      </div>
                      <div className="w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/10-OCT/NEW%20WEBSITE/website%20new-11.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/10-OCT/NEW%20WEBSITE/website%20new-13.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center scale-x-[-1]"
                        />
                      </div>
                      <div className="w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/10-OCT/NEW%20WEBSITE/website%20new-15.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/10-OCT/NEW%20WEBSITE/1617-16.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/12-DEC/Winter%20OPECO/football%20(1).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://www.decathlon.eg/img/cms/2023/10-OCT/NEW%20WEBSITE/website%20new-13.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#shop-sections"
                className="inline-block rounded-md border border-transparent bg-decathlon px-8 py-3 text-center font-medium text-white hover:bg-decathlon-dark"
              >
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </div>

      <main
        id="shop-sections"
        className="max-w-7xl mx-auto  px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 space-y-20"
      >
        {productSections.map(section => (
          <section
            key={section.category}
            id={section.category}
            className="scroll-mt-20"
          >
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {section.category}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {section.products.map(product => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
