import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

const Collections = lazy(() => import('./collection.route'));

export const CollectionRoute = () => {
  return (
    <Route path="collections">
      <Route index element={<Navigate to="/" replace />} />
      <Route path=":collectionName" element={<Collections />} />
    </Route>
  );
};
