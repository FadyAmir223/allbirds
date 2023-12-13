export const userKeys = {
  record: ['user'],
  locations: () => [...userKeys.record, 'locations'],
  location: (id: string) => [...userKeys.locations(), id],
  orders: () => [...userKeys.record, 'orders'],
  ordersHistory: () => [...userKeys.record, 'orders', history],
}
