import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

const Product = lazy(() => import('./product.route'));

export const ProductRoute = () => {
  return (
    <Route path='products'>
      <Route index element={<Navigate to='/' replace />} />
      <Route path=':productName' element={<Product />} />
    </Route>
  );
};
