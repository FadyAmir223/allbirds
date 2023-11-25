import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import {
  useSearchParams,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import { LiaAngleLeftSolid } from 'react-icons/lia';

import LinkCustom from '@/components/link-custom.component';
import Modal from '@/components/modal.component';
import Overlay from '@/components/overlay.component';
import { useScroll } from '@/hooks/useScroll';
import { cn } from '@/utils/cn.util';
import SearchIcon from '@/assets/svg/search.svg?react';

type SearchFieldProps = {
  isOpen: boolean;
};

const queryName = 'query';

const SearchField = ({ isOpen }: SearchFieldProps) => {
  const [search, setSearch] = useState({
    isOpen: false,
    isMoving: false,
    query: '',
  });

  useScroll(search.isOpen);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const elInput = useRef<HTMLInputElement | null>(null);

  const recentQueries = JSON.parse(
    localStorage.getItem(queryName) || '[]',
  ) as string[];

  useEffect(() => {
    if (search.isOpen) elInput.current?.focus();
  }, [search.isOpen]);

  useEffect(() => {
    // TODO: POST /api/search  { query }

    const timeout = setTimeout(() => {
      if (search.query) {
        const newQueries = [
          search.query,
          ...recentQueries.filter((query) => query !== search.query),
        ].slice(0, 5);

        localStorage.setItem(queryName, JSON.stringify(newQueries));
      }

      setSearchParams(
        (prevSearchParams) => {
          search.query
            ? prevSearchParams.set(queryName, search.query)
            : prevSearchParams.delete(queryName);

          return prevSearchParams;
        },
        { replace: true },
      );
    }, 600);

    return () => clearTimeout(timeout);
  }, [search.query]); // eslint-disable-line

  useEffect(() => {
    if (!search.isMoving) return;

    const timeout = setTimeout(() => {
      const query = location.pathname === '/pages/search' ? search.query : '';
      setSearch({ ...search, isMoving: false, query });
    }, 250);

    return () => clearTimeout(timeout);
  }, [search.isMoving]); // eslint-disable-line

  const handleSearchToggle = () => {
    setSearch({ ...search, isOpen: !search.isOpen, isMoving: true });
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchToggle();
    navigate(`/pages/search?${queryName}=${search.query.replace(' ', '+')}`);
  };

  return (
    <>
      <button
        className={cn(
          'flex items-center w-full mt-3 bg-silver rounded-lg focus:outline-0 max-h-[26px] text-xs md:hidden',
          { invisible: isOpen },
        )}
        onClick={handleSearchToggle}
      >
        <span className='px-2 py-[6px] scale-[80%]'>
          <SearchIcon />
        </span>
        <span className='capitalize text-silver-dark'>enter search term</span>
      </button>

      <Modal>
        <Overlay
          isOpen={search.isOpen}
          className='md:hidden top-0 left-0 z-40'
        />

        <div
          className={cn(
            'md:hidden fixed top-0 left-0 w-screen h-[100dvh] animate-[fade_250ms_linear] bg-white px-[20px] py-[10px] flex flex-col justify-between z-50 duration-[250ms] transition-transform',
            {
              'translate-y-full opacity-0': !search.isOpen && !search.isMoving,
              'translate-y-0': search.isOpen && search.isMoving,
              '-translate-x-full': !search.isOpen && search.isMoving,
            },
          )}
        >
          <div>
            <div className='flex items-center gap-[14px] mb-6'>
              <button
                className='cursor-pointer duration-[400ms] hover:-translate-x-1 scale-[120%]'
                onClick={handleSearchToggle}
              >
                <LiaAngleLeftSolid />
              </button>

              <div className='bg-silver w-full rounded-lg'>
                <form onSubmit={handleSubmit}>
                  <input
                    ref={elInput}
                    autoComplete='off'
                    type='text'
                    name={queryName}
                    placeholder='Enter Search Term'
                    className='bg-transparent text-xs focus:outline-0 px-5 py-[11px]  w-full tracking-[0.06em]'
                    value={search.query}
                    onChange={handleQueryChange}
                  />
                </form>
              </div>
            </div>

            {recentQueries && (
              <div>
                <p className='text-gray-dark uppercase text-[9.6px] tracking-[0.8px] pb-[6px]'>
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
  );
};

export default SearchField;
