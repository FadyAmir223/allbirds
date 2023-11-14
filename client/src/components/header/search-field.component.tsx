import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { LiaAngleLeftSolid } from 'react-icons/lia';

import LinkCustom from '@/components/link-custom.component';
import Modal from '@/components/modal.component';
import SearchIcon from '@/assets/svg/search.svg?react';
import { cn } from '@/utils/cn';

// TODO: GET/POST /api/recent-search
// TODO: search functionality

const recentSearches = ['sale', 'tree runners', 'slippers', 'mizzles'];

const SearchField = () => {
  const [search, setSearch] = useState({
    isOpen: false,
    isMoving: false,
    query: '',
  });

  const [, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.query) setSearchParams({ query: search.query });
    }, 700);

    return () => clearTimeout(timeout);
  }, [search.query, setSearchParams]);

  useEffect(() => {
    if (!search.isMoving) return;

    const timeout = setTimeout(() => {
      setSearch((prevSearch) => ({
        ...prevSearch,
        isMoving: false,
      }));
    }, 250);

    return () => clearTimeout(timeout);
  }, [search.isMoving]);

  const handleSearchOpen = () => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      isOpen: true,
      isMoving: true,
    }));
  };

  const handleSearchClose = () => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      isOpen: false,
      isMoving: true,
    }));
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearch((prevSearch) => ({ ...prevSearch, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchClose();
    navigate('/pages/search?' + search.query);
  };

  return (
    <>
      <button
        className='flex items-center w-full mt-3 bg-silver rounded-lg focus:outline-0 max-h-[26px] text-xs md:hidden'
        onClick={handleSearchOpen}
      >
        <span className='px-2 py-[6px] scale-[80%]'>
          <SearchIcon />
        </span>
        <span className='capitalize text-sliver-dark'>enter search term</span>
      </button>

      <Modal>
        <div
          className={cn(
            'md:hidden fixed top-0 left-0 w-screen h-screen animate-[fade_100ms_linear] z-50',
            search.isOpen ? 'bg-white/75' : 'opacity-0 hidden',
          )}
        />

        <div
          className={cn(
            'md:hidden fixed top-0 left-0 w-screen h-screen animate-[fade_250ms_linear] bg-white px-[20px] py-[10px] flex flex-col justify-between z-50 duration-[250ms] transition-transform',
            {
              'translate-y-full opacity-0': !search.isOpen && !search.isMoving,
              'translate-y-0': search.isOpen && search.isMoving,
              '-translate-x-full': !search.isOpen && search.isMoving,
            },
          )}
        >
          <div className=''>
            <div className='flex items-center gap-[14px] mb-6'>
              <button
                className='cursor-pointer duration-[400ms] hover:-translate-x-1 scale-[120%]'
                onClick={handleSearchClose}
              >
                <LiaAngleLeftSolid />
              </button>

              <div className='bg-silver w-full rounded-lg'>
                <form onSubmit={handleSubmit}>
                  <input
                    autoFocus
                    autoComplete='off'
                    type='text'
                    name='query'
                    placeholder='Enter Search Term'
                    className='bg-transparent text-xs focus:outline-0 px-5 py-[11px]  w-full tracking-[0.06em]'
                    value={search.query}
                    onChange={handleQueryChange}
                  />
                </form>
              </div>
            </div>

            {recentSearches && (
              <div className=''>
                <p className='text-gray-dark uppercase text-[9.6px] tracking-[0.8px] pb-[6px]'>
                  recent searches
                </p>

                <ul className=''>
                  {recentSearches.map((recentSearch) => (
                    <li
                      key={recentSearch}
                      className='pb-[6px] text-[13px] leading-[18px]'
                    >
                      <Link
                        to={`/pages/search${
                          recentSearch ? `?query=${recentSearch}` : ''
                        }`}
                        onClick={handleSearchClose}
                      >
                        {recentSearch}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <LinkCustom
            to={`/pages/search${search.query ? `?query=${search.query}` : ''}`}
            text='see more'
            className='mx-auto'
            onClick={handleSearchClose}
          />
        </div>
      </Modal>
    </>
  );
};

export default SearchField;
