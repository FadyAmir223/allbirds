import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { LiaAngleLeftSolid } from 'react-icons/lia'

import LinkCustom from '@/components/link-custom.component'
import Modal from '@/components/modal.component'
import Overlay from '@/components/overlay.component'
import { cn } from '@/utils/cn.util'
import SearchIcon from '@/assets/svg/search.svg?react'

type SearchFieldProps = {
  isOpen: boolean
}

const queryName = 'query'

const SearchField = ({ isOpen }: SearchFieldProps) => {
  const [search, setSearch] = useState({
    isOpen: false,
    isMoving: false,
    query: '',
  })

  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const location = useLocation()
  const elInput = useRef<HTMLInputElement | null>(null)

  const recentQueries = JSON.parse(
    localStorage.getItem(queryName) || '[]',
  ) as string[]

  useEffect(() => {
    if (search.isOpen) elInput.current?.focus()
  }, [search.isOpen])

  useEffect(() => {
    // TODO: POST /api/search  { query }

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
    }, 600)

    return () => clearTimeout(timeout)
  }, [search.query]) // eslint-disable-line

  useEffect(() => {
    if (!search.isMoving) return

    const timeout = setTimeout(() => {
      const query = location.pathname === '/pages/search' ? search.query : ''
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
        <span className='capitalize text-silver-dark'>enter search term</span>
      </button>

      <Modal>
        <Overlay
          isOpen={search.isOpen}
          className='left-0 top-0 z-40 md:hidden'
        />

        <div
          className={cn(
            'fixed left-0 top-0 z-50 flex h-[100dvh] w-screen animate-[fade_250ms_linear] flex-col justify-between bg-white px-[20px] py-[10px] transition-transform duration-[250ms] md:hidden',
            {
              'translate-y-full opacity-0': !search.isOpen && !search.isMoving,
              'translate-y-0': search.isOpen && search.isMoving,
              '-translate-x-full': !search.isOpen && search.isMoving,
            },
          )}
        >
          <div>
            <div className='mb-6 flex items-center gap-[14px]'>
              <button
                className='scale-[120%] cursor-pointer duration-[400ms] hover:-translate-x-1'
                onClick={handleSearchToggle}
              >
                <LiaAngleLeftSolid />
              </button>

              <div className='w-full rounded-lg bg-silver'>
                <form onSubmit={handleSubmit}>
                  <input
                    ref={elInput}
                    autoComplete='off'
                    type='text'
                    name={queryName}
                    placeholder='Enter Search Term'
                    className='w-full bg-transparent px-5 py-[11px] text-xs  tracking-[0.06em] focus:outline-0'
                    value={search.query}
                    onChange={handleQueryChange}
                  />
                </form>
              </div>
            </div>

            {recentQueries && (
              <div>
                <p className='pb-[6px] text-[9.6px] uppercase tracking-[0.8px] text-gray-dark'>
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
                            ? `?${queryName}=${recentQuery.replace(' ', '+')}`
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
          </div>

          <LinkCustom
            to={`/pages/search${
              search.query ? `?query=${search.query.replace(' ', '+')}` : ''
            }`}
            className='mx-auto'
            onClick={handleSearchToggle}
          >
            see more
          </LinkCustom>
        </div>
      </Modal>
    </>
  )
}

export default SearchField
