export const userKeys = {
  record: ['user'],
  locations: () => [...userKeys.record, 'locations'],
  orders: () => [...userKeys.record, 'orders'],
  ordersHistory: () => [...userKeys.record, 'orders', 'history'],
}
