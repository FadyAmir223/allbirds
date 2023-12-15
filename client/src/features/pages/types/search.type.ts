import { Pagination } from '@/types/pagination.type'

export type SearchRes = {
  products: SerachProduct[]
  pagination: Pagination
}

export type SerachProduct = {
  id: number
  handle: string
  name: string
  colorName: string
  price: number
  salePrice?: number
  image: string
}
