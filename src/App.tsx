import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import Banner from '@/components/banner';
import { ThemeProvider } from '@/context/themeProvider';

function App() {
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
