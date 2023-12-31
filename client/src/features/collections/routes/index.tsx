import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { lazyImport } from '@/utils/lazy-import.util'
import { loader as collectionAction } from '../services/collection.loader'

const Collections = lazy(() => import('./collection.route'))
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound')

export const CollectionRoute = () => {
  return (
    <Route path='collections' errorElement={<NotFound />}>
      <Route index element={<Navigate to='/' replace />} />
      <Route path=':type' element={<Collections />} loader={collectionAction} />
      <Route
        path='sale/:type'
        element={<Collections isSale={true} />}
        loader={collectionAction}
      />
    </Route>
  )
}
