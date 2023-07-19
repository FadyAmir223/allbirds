import { lazy, Suspense } from 'react';

import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Loading from './routes/loading.component';
import Layout from './components/layout.component';
import UserLogin from './routes/user-login.component';

const Home = lazy(() => import('./routes/home.component'));
const Collection = lazy(() => import('./routes/market/collection.component'));
const Product = lazy(() => import('./routes/market/product.component'));
const Sale = lazy(() => import('./routes/market/sale.component'));
const Search = lazy(() => import('./routes/pages/search.component'));
const AdminLogin = lazy(() => import('./routes/admin/admin-login.component'));
const AdminDashboard = lazy(
  () => import('./routes/admin/admin-dashboard.component')
);
const NotFound = lazy(() => import('./routes/not-found.component'));
const Error = lazy(() => import('./routes/error.component'));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <Route path="/" element={<Layout />} errorElement={<Error />}>
              <Route path="*" element={<NotFound />} />
              <Route index element={<Home />} />

              <Route path="collections" element={<Navigate to="/" />} />
              <Route
                path="collections/:category/:item"
                element={<Collection />}
              />

              <Route path="products" element={<Navigate to="/" />} />
              <Route path="products/:category/:item" element={<Product />} />

              <Route path="sale" element={<Navigate to="/" />} />
              <Route path="sale/:category/:item" element={<Sale />} />

              <Route path="pages">
                <Route index element={<Navigate to="/" replace />} />
                <Route path="search" element={<Search />} />
              </Route>

              <Route path="admin">
                <Route index element={<Navigate to="auth/login" replace />} />
                <Route path="auth/login" element={<AdminLogin />} />
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              <Route path="account">
                <Route index element={<Navigate to="login" replace />} />
                <Route path="login" element={<UserLogin />} />
                <Route path="register" element={<UserLogin />} />
              </Route>
            </Route>
          )
        )}
      />
    </Suspense>
  );
};

export default App;
