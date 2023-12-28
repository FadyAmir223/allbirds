import { type LoaderFunctionArgs } from 'react-router-dom'
import { queryClient } from '@/lib/react-query'
import {
  collectionKeys,
  collectionQuery,
  collectionSaleQuery,
} from './collection.query'
import { ensureType } from '../utils/ensureType.util'
import { type Collection } from '..'
import { composeFilters } from './composeFilters'
import { refactorCollectionsToSlides } from '@/features/misc'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const type = params.type as string
  const queries = ensureType(type)
  const otherGender = queries.gender && (type === 'mens' ? 'womens' : 'mens')

  const isSale = request.url.includes('/sale')
  const query = isSale ? collectionSaleQuery(queries) : collectionQuery(queries)

  const collectionP = queryClient.ensureQueryData(query)
  const promises = [collectionP]

  let suggestions: Collection | undefined

  if (otherGender) {
    suggestions = queryClient.getQueryData(
      collectionKeys.type({ ...queries, gender: otherGender }),
    )

    if (!suggestions) {
      const suggestionsP = queryClient.ensureQueryData(
        collectionQuery({ ...queries, gender: otherGender, limit: 5 }),
      )
      promises.push(suggestionsP)
    }
  } else {
    const suggestionsP = queryClient.ensureQueryData(
      collectionQuery({ ...ensureType('mens'), limit: 5 }),
    )
    promises.push(suggestionsP)
  }

  const responses = (await Promise.all(promises)) as [Collection, Collection]

  const [collection] = responses
  if (responses.length === 2) [, suggestions] = responses

  const suggestionSlides = refactorCollectionsToSlides([
    collection,
    suggestions as Collection,
  ])

  const filters = composeFilters(`${type}-${isSale}`, collection)

  return [collection, filters, suggestionSlides] as const
}
