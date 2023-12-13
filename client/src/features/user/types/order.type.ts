export type Orders = {
  orders: Order[]
}

export type Order = {
  handle: string
  editionId: number
  size: string
  amount: number
  delivered: boolean
  reviewed: boolean
}
