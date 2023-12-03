import { CollectionMainQuery } from '..'

export const ensureType = (type: string) => {
  const isGender = ['mens', 'womens'].includes(type)
  return isGender
    ? ({ type: 'shoes', gender: type } as CollectionMainQuery)
    : { type }
}
