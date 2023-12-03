import { Pagination } from '@/types/pagination.type'

export type Reviews = {
  pagination: Pagination
  rating: number
  reviews: Review[]
}

export type Review = {
  _id: string
  score: number
  title: string
  content: string
  username: string
  verifiedBuyer: boolean
  createdAt: string
  customFields: {
    title: string
    value: string
    _id: string
  }[]
}

export type ReviewsHeadline = {
  rating: number
  total: number
}
