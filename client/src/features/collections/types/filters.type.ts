export type Filters = {
  filters: {
    sizes: string[]
    bestFor: string[]
    material: string[]
    hues: string[]
  }
}

export type FilterKey = keyof Filters['filters']
export type FilterValues = string[] | undefined
export type SelectedFilters = { [key in FilterKey]: FilterValues }
