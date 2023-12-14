import { type Collection, type FilterKey, type Filters } from '..'

type FilterCache = {
  [key: string]: Filters['filters']
}

const cache: FilterCache = {}

export const composeFilters = (key: string, collection: Collection) => {
  if (cache[key]) return cache[key]

  const initFilters: Filters['filters'] = {
    sizes: [],
    bestFor: [],
    material: [],
    hues: [],
  }

  const filters = collection.products.reduce((data, product) => {
    const hues = product.editions.map((x) => x.products.map((y) => y.hues))

    data.hues.push(...hues.flat(2))
    data.sizes.push(...product.sizes)
    data.bestFor.push(...product.bestFor)
    data.material.push(product.material)

    return data
  }, initFilters)

  for (const key of Object.keys(filters) as FilterKey[])
    filters[key] = [...new Set(filters[key])]

  cache[key] = filters
  return filters
}
