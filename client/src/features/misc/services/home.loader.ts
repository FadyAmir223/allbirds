import { queryClient } from '@/lib/react-query'
import { refactorCollectionsToSlides } from '.'
import { collectionSaleQuery } from '@/features/collections'

export const loader = async () => {
  const query = { type: 'shoes' }

  const saleMenP = queryClient.ensureQueryData(
    collectionSaleQuery({ ...query, gender: 'mens' }),
  )
  const saleWomenP = queryClient.ensureQueryData(
    collectionSaleQuery({ ...query, gender: 'womens' }),
  )

  const saleProducts = await Promise.all([saleMenP, saleWomenP])
  const saleSlides = refactorCollectionsToSlides(saleProducts)

  return saleSlides
}
