import { LoaderFunctionArgs } from 'react-router-dom'
import { queryClient } from '@/lib/react-query'
import {
  collectionFiltersQuery,
  collectionKeys,
  collectionQuery,
} from './collection.query'
import { ensureType } from '../utils/ensureType.util'
import { type Collection, type Filters } from '..'
import { refactorCollectionsToSlides } from '@/features/misc'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const type = params.type as string
  const queries = ensureType(type)
  const otherGender = queries.gender && (type === 'mens' ? 'womens' : 'mens')

  const promises = []
  const collectionP = queryClient.ensureQueryData(collectionQuery(queries))
  const filtersP = queryClient.ensureQueryData(collectionFiltersQuery(queries))
  promises.push(collectionP, filtersP)

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

  const responses = (await Promise.all(promises)) as [
    Collection,
    Filters,
    Collection,
  ]

  const [collection, filters] = responses

  if (responses.length === 3) suggestions = responses[2]

  const suggestionSlides = refactorCollectionsToSlides([
    collection,
    suggestions as Collection,
  ])

  return [collection, filters, suggestionSlides]
}
