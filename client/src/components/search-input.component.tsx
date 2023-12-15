import { ComponentPropsWithRef, FormEvent, forwardRef } from 'react'
import SearchIcon from '@/assets/svg/search.svg?react'

type SearchInputProps = ComponentPropsWithRef<'input'> & {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ handleSubmit, ...props }, ref) => (
    <div className='w-full items-center rounded-lg bg-silver'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center px-3'>
          <span className='scale-[80%] pr-2'>
            <SearchIcon />
          </span>
          <input
            ref={ref}
            className='w-full bg-transparent py-[11px] text-xs tracking-[0.06em] focus:outline-0'
            autoComplete='off'
            type='text'
            placeholder='Enter Search Term'
            {...props}
          />
        </div>
      </form>
    </div>
  ),
)
