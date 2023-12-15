export function getSearchQueryRegex(query: string) {
  const cleanedQuery = query.replace(/[^a-zA-Z]/g, '')
  if (!cleanedQuery) return
  const pattern = cleanedQuery.split('').join('.*')
  return new RegExp(pattern, 'i')
}
