import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
