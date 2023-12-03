import { QueryKey } from '@tanstack/react-query'

export const composeUri = (queryKey: QueryKey): string => {
  return queryKey
    .map((key) =>
      typeof key === 'object'
        ? '?' + composeQueryies(key as object)
        : '/' + key,
    )
    .join('')
}

export const composeQueryies = (queryObjec: object) => {
  return Object.entries(queryObjec)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([param, value]) => `${param}=${value}`)
    .join('&')
}
