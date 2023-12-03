import { type ProductEdition, type ProductMain } from '@/features/products'
import type { Pagination } from '@/types/pagination.type'

export type CollectionEdition = Omit<ProductEdition, 'images'> & {
  image: string
}

export type CollectionProduct = ProductMain & {
  editions: {
    edition: string
    products: CollectionEdition[]
  }[]
}

export type Collection = {
  pagination: Pagination
  products: CollectionProduct[]
}
