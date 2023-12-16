import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import SearchIcon from '@/assets/svg/search.svg?react'
import { LiaAngleLeftSolid } from 'react-icons/lia'
import LinkCustom from '@/components/link-custom.component'
import Modal from '@/components/modal.component'
import Overlay from '@/components/overlay.component'
import { SearchInput } from '@/components/search-input.component'
import { cn } from '@/utils/cn.util'
import { composeUri } from '@/utils/compose-uri.util'
import { type SearchRes } from '@/features/pages'
import { productKeys } from '@/features/products'
import { useDebounce } from '@/hooks/useDebounce'
import { axios } from '@/lib/axios'

type SearchFieldProps = {
  isOpen: boolean
}

export const queryName = 'q'
export const typingDelay = 400

const SearchField = ({ isOpen }: SearchFieldProps) => {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const { pathname } = useLocation()
  const elInput = useRef<HTMLInputElement | null>(null)

  const [search, setSearch] = useState({
    isOpen: false,
    isMoving: false,
    query: '',
  })

  const debounceQuery = useDebounce(search.query, typingDelay)

  const { data: searchResult } = useQuery<SearchRes>({
    queryKey: productKeys.search(debounceQuery, 4),
    queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
  })

  const recentQueries = JSON.parse(
    localStorage.getItem(queryName) || '[]',
  ) as string[]

  useEffect(() => {
    if (search.isOpen) elInput.current?.focus()
  }, [search.isOpen])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.query) {
        const newQueries = [
          search.query,
          ...recentQueries.filter((query) => query !== search.query),
        ].slice(0, 5)

        localStorage.setItem(queryName, JSON.stringify(newQueries))
      }

      setSearchParams(
        (prevSearchParams) => {
          search.query
            ? prevSearchParams.set(queryName, search.query)
            : prevSearchParams.delete(queryName)

          return prevSearchParams
        },
        { replace: true },
      )
    }, typingDelay)

    return () => clearTimeout(timeout)
  }, [search.query]) // eslint-disable-line

  useEffect(() => {
    if (!search.isMoving) return

    const timeout = setTimeout(() => {
      const query = pathname === '/pages/search' ? search.query : ''
      setSearch({ ...search, isMoving: false, query })
    }, 250)

    return () => clearTimeout(timeout)
  }, [search.isMoving]) // eslint-disable-line

  const handleSearchToggle = () => {
    setSearch({ ...search, isOpen: !search.isOpen, isMoving: true })
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSearch({ ...search, [name]: value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSearchToggle()
    navigate(`/pages/search?${queryName}=${search.query.replace(' ', '+')}`)
  }

  return (
    <>
      <Overlay isOpen={search.isOpen} className='left-0 top-0 z-40 md:hidden' />

      {pathname === '/' && (
        <>
          <button
            className={cn(
              'mt-3 flex max-h-[26px] w-full items-center rounded-lg bg-silver text-xs focus:outline-0 md:hidden',
              { invisible: isOpen },
            )}
            onClick={handleSearchToggle}
          >
            <span className='scale-[80%] px-2 py-[6px]'>
              <SearchIcon />
            </span>
            <span className='capitalize text-silver-dark'>
              enter search term
            </span>
          </button>

          <Modal>
            <div
              className={cn(
                'fixed left-0 top-0 z-50 flex h-[100dvh] w-screen animate-[fade_250ms_linear] flex-col justify-between overflow-y-auto bg-silver-2 px-[20px] py-[10px] transition-transform duration-[250ms] md:hidden',
                {
                  'translate-y-full opacity-0':
                    !search.isOpen && !search.isMoving,
                  'translate-y-0': search.isOpen && search.isMoving,
                  '-translate-x-full': !search.isOpen && search.isMoving,
                },
              )}
            >
              <div>
                <div className='mb-10 flex items-center gap-[14px]'>
                  <button
                    className='scale-[120%] cursor-pointer duration-[400ms] hover:-translate-x-1'
                    onClick={handleSearchToggle}
                  >
                    <LiaAngleLeftSolid />
                  </button>

                  <SearchInput
                    ref={elInput}
                    value={search.query}
                    onChange={handleQueryChange}
                    handleSubmit={handleSubmit}
                  />
                </div>

                {recentQueries && (
                  <div>
                    <p className='pb-[6px] text-[9.6px] font-[500] uppercase tracking-[0.8px] text-gray-dark'>
                      recent searches
                    </p>

                    <ul>
                      {recentQueries.map((recentQuery) => (
                        <li
                          key={recentQuery}
                          className='pb-[6px] text-[13px] leading-[18px]'
                        >
                          <Link
                            to={`/pages/search${
                              recentQuery
                                ? `?${queryName}=${recentQuery.replace(
                                    ' ',
                                    '+',
                                  )}`
                                : ''
                            }`}
                            onClick={handleSearchToggle}
                          >
                            {recentQuery}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchResult?.products.length !== 0 && (
                  <div className='mt-5'>
                    <p className='pb-[6px] text-[9.6px] font-[500] uppercase tracking-[0.8px] text-gray-dark'>
                      results
                    </p>

                    <div className='mb-8 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3'>
                      {searchResult?.products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.handle}?id=${product.id}`}
                          className='relative z-20'
                        >
                          <div className='relative pb-[100%]'>
                            <img
                              src={product.image}
                              alt={product.name}
                              className='absolute left-0 top-0 h-full w-full bg-silver object-cover'
                            />
                          </div>

                          <div className='bg-white px-3 py-1'>
                            <h4 className='relative mb-1 mt-2 text-sm font-[500]'>
                              {product.name}
                            </h4>
                            <p className='mb-1 text-[12px]'>
                              {product.colorName}
                            </p>
                            <div className='relative mb-1 text-[11.2px] md:px-0'>
                              {product.salePrice && (
                                <span className='mr-1 text-red'>
                                  ${product?.salePrice}
                                </span>
                              )}
                              <span
                                className={cn({
                                  'text-gray-medium line-through':
                                    product?.salePrice,
                                })}
                              >
                                ${product.price}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <LinkCustom
                to={`/pages/search${
                  search.query
                    ? `?${queryName}=${search.query.replace(' ', '+')}`
                    : ''
                }`}
                className='mx-auto'
                onClick={handleSearchToggle}
              >
                see more
              </LinkCustom>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}

export default SearchField
