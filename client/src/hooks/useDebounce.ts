import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number) => {
  const cleanValue =
    typeof value === 'string' ? value.replace(/[^a-zA-Z]/g, '') : value

  const [debounceValue, setDebounceValue] = useState(cleanValue)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(cleanValue), delay)
    return () => clearTimeout(timeout)
  }, [value]) // eslint-disable-line

  return debounceValue
}
