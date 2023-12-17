import { redirect } from 'react-router-dom'

export const loader = (totalAmount: number) =>
  totalAmount === 0 ? redirect(`/`) : null
