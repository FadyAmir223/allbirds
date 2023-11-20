import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { loader as collectionAction } from '../services/collection.loader';
import { lazyImport } from '@/utils/lazy-import';

const Collections = lazy(() => import('./collection.route'));
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound');

export const CollectionRoute = () => {
  return (
    <Route path='collections'>
      <Route index element={<Navigate to='/' replace />} />
      <Route
        path=':type'
        element={<Collections />}
        loader={collectionAction}
        errorElement={<NotFound />}
      />
    </Route>
  );
};
