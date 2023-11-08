import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Search = lazy(() => import('./search.route'));
const OurComitment = lazy(() => import('./our-comitment.route'));

export const PagesRoute = () => {
  return (
    <Route path="pages">
      <Route path="search" element={<Search />} />
      <Route path="our-commitment" element={<OurComitment />} />
    </Route>
  );
};
