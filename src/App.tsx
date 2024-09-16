import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Banner from '@/components/banner';
import { ThemeProvider } from '@/context/themeProvider';

function App() {
  return (
    <ThemeProvider>
      <ScrollRestoration />
      <Outlet />
      <Banner />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
