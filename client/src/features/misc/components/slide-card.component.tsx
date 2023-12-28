import { type ComponentPropsWithoutRef } from 'react'
import { Card } from './slider.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import heroLinks from '../data/men-women-url.json'

type SlideCardProps = ComponentPropsWithoutRef<'div'> &
  Card & { appendix?: boolean; titleStyle?: string }

export const SlideCard = ({
  imgUrl,
  miniImgUrl,
  title,
  description,
  appendix,
  className,
  titleStyle,
  ...props
}: SlideCardProps) => {
  return (
    <div
      className={cn(
        'group group overflow-hidden shadow-lg shadow-gray-light',
        className,
      )}
      {...props}
    >
      <div className='group/overlay relative w-full overflow-hidden pb-[100%]'>
        <img
          src={imgUrl}
          alt=''
          className='absolute inset-0 w-full bg-silver object-cover transition-transform duration-500 group-hover:scale-[105%]'
          loading='lazy'
        />
        {appendix && (
          <>
            <div className='absolute left-0 top-0 hidden h-full w-full bg-gray opacity-0 transition-opacity duration-500 ease-out group-hover/overlay:opacity-40 md:block' />

            <div className='absolute left-0 top-0 hidden h-full w-full items-center justify-center opacity-0 transition-opacity duration-500 ease-out group-hover/overlay:opacity-100 md:flex'>
              <div className='flex flex-col gap-y-3'>
                {heroLinks.map((heroLink) => (
                  <LinkCustom
                    key={heroLink.text}
                    to={heroLink.url}
                    className='relative z-30 block w-full border-none py-[10px]'
                  >
                    {heroLink.text}
                  </LinkCustom>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={cn('px-6 py-3 text-gray', titleStyle)}>
        <h4 className='whitespace-nowrap text-[14px] font-bold capitalize tracking-wide'>
          {title}
        </h4>
        {!appendix && (
          <p className='whitespace-nowrap text-[12px] leading-[1.4] tracking-[0.3px]'>
            {description}
          </p>
        )}
        {appendix && (
          <>
            <div className='mt-[10px] flex items-center  gap-x-2 border-t-[1px] border-t-gray-light pt-[10px]'>
              <img src={miniImgUrl} alt='' className='w-6' />
              <p className='text-[12px] leading-[1.4] tracking-[0.3px]'>
                {description}
              </p>
            </div>

            <div className='mt-2 flex flex-col gap-y-2 md:hidden'>
              {heroLinks.map((heroLink) => (
                <LinkCustom
                  key={heroLink.text}
                  to={heroLink.url}
                  className='w-full p-2 text-[9px]'
                >
                  {heroLink.text}
                </LinkCustom>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
