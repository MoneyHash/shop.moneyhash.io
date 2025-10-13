import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Banner from '@/components/banner';
import { ThemeProvider } from '@/context/themeProvider';
import '@/i18n/config';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction and language based on saved preference
    const currentLang = i18n.language;
    document.documentElement.setAttribute(
      'dir',
      currentLang === 'ar' ? 'rtl' : 'ltr',
    );
    document.documentElement.setAttribute('lang', currentLang);
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <ScrollRestoration />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Banner />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
