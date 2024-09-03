import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Banner from '@/components/banner';

function App() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <Banner />
      <Toaster />
    </>
  );
}

export default App;
