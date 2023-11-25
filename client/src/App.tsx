import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Layout from '@/components/layout.component';
import ErrorFallback from '@/components/error-fallback.component';
import { UserRoute } from '@/features/auth';
import { CollectionRoute } from '@/features/collections';
import { ProductRoute } from '@/features/products';
import { PagesRoute } from '@/features/pages';
import { loader as homeLoader } from './features/misc';
import { lazyImport } from '@/utils/lazy-import.util';

const mistFactory = () => import('@/features/misc');
const { Home } = lazyImport(mistFactory, 'Home');
const { NotFound } = lazyImport(mistFactory, 'NotFound');

const App = () => {
  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route path='/' element={<Layout />} errorElement={<ErrorFallback />}>
            <Route path='*' element={<NotFound />} />
            <Route index element={<Home />} loader={homeLoader} />
            {CollectionRoute()}
            {ProductRoute()}
            {UserRoute()}
            {PagesRoute()}
          </Route>,
        ),
      )}
    />
  );
};

export default App;
