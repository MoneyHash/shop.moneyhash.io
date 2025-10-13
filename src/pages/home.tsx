import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/navbar';
import ProductItem from '@/components/productItem';
import productSections from '@/utils/productSections';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <NavBar />

      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40 relative overflow-hidden sm:overflow-visible">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-4 text-xl text-subtle">
              {t('home.hero.description')}
            </p>
          </div>
          <div>
            <div className="mt-10 ">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:start-1/2 sm:top-0 sm:translate-x-8 lg:start-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8 rtl:sm:-translate-x-8 rtl:lg:-translate-x-8">
                  <div className="flex items-center gap-6 lg:gap-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img
                          src="/images/hero/hero-image-1.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="/images/hero/hero-image-2.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="/images/hero/hero-image-3.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="/images/hero/hero-image-4.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="/images/hero/hero-image-5.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="/images/hero/hero-image-6.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="/images/hero/hero-image-7.jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button asChild size="lg">
                <a href="#shop-sections">{t('home.hero.shopCollection')}</a>
              </Button>
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
            <h2 className="text-2xl font-bold tracking-tight text-bolder">
              {t(`product.categories.${section.category.toLowerCase()}`)}
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
