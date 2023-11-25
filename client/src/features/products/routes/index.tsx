import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { loader as productLoader } from '../services/product.loader';

const Product = lazy(() => import('./product.route'));

export const ProductRoute = () => {
  return (
    <Route path='products'>
      <Route index element={<Navigate to='/' replace />} />
      <Route path=':productName' element={<Product />} loader={productLoader} />
    </Route>
  );
};
