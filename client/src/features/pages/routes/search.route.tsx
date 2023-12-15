import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { queryName } from '@/components/header/search-field.component'
import { SearchInput } from '@/components/search-input.component'
import { Spinner } from '@/components/spinner.component'
import { getSerachQuery } from '../services/serach.query'
import { cn } from '@/utils/cn.util'

const Search = () => {
  const elInput = useRef<HTMLInputElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const defaultQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(defaultQuery)

  useEffect(() => {
    elInput.current?.focus()

    addEventListener('scroll', handleScroll)
    return () => removeEventListener('scroll', handleScroll)
  }, []) // eslint-disable-line

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((prevSearchParams) => {
        query
          ? prevSearchParams.set(queryName, query)
          : prevSearchParams.delete(queryName)

        return prevSearchParams
      })
    }, 600)

    return () => clearTimeout(timeout)
  }, [query]) // eslint-disable-line

  const {
    data: products,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(getSerachQuery({ q: query }))

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value)

  const handleScroll = () => {
    if (scrollY + innerHeight >= (elPage.current?.scrollHeight || 0)) {
      console.log('fetch')
      fetchNextPage()
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchNextPage()
  }

  const elPage = useRef<HTMLDivElement | null>(null)

  return (
    <main className='mx-auto px-4 py-16 md:container' ref={elPage}>
      <h1 className='mb-4 text-2xl font-bold'>Search Results</h1>

      <div className='mb-8 flex items-center gap-x-3'>
        <SearchInput
          ref={elInput}
          name={queryName}
          value={query}
          onChange={handleQueryChange}
          handleSubmit={handleSubmit}
        />

        <Link to='/' className='text-sm text-[#b4ada3]'>
          cancle
        </Link>
      </div>

      <div className=''>
        <div className='grid grid-cols-2 gap-4 bg-white md:grid-cols-3'>
          {products?.map((product) => (
            <div key={product.id} className='group relative'>
              <div className='absolute -left-4 -top-4 z-10 hidden h-[calc(100%+32px)] w-[calc(100%+32px)] group-hover:shadow-2xl group-hover:shadow-gray md:block' />

              <div className='relative pb-[100%]'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='absolute left-0 top-0 h-full w-full bg-silver object-cover'
                />
              </div>

              <Link
                to={`/products/${product.handle}?id=${product.id}`}
                className='relative z-20'
              >
                <h4 className='relative mb-1 mt-2 text-sm font-[500]'>
                  {product.name}
                </h4>
                <p className='mb-1 text-[12px]'>{product.colorName}</p>
                <div className='relative mb-1 px-3 text-[11.2px] md:px-0'>
                  {product.salePrice && (
                    <span className='mr-1 text-red'>${product?.salePrice}</span>
                  )}
                  <span
                    className={cn({
                      'text-gray-medium line-through': product?.salePrice,
                    })}
                  >
                    ${product.price}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {isFetching && <Spinner />}
      </div>
    </main>
  )
}

export default Search
