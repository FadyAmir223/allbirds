import { ComponentPropsWithoutRef } from 'react';

import LinkCustom from '@/components/link-custom.component';
import { cn } from '@/utils/cn.util';
import heroLinks from '../data/men-women-url.json';
import { Card } from './slider.component';

type SlideCardProps = ComponentPropsWithoutRef<'div'> &
  Card & { appendix?: boolean };

export const SlideCard = ({
  imgUrl,
  miniImgUrl,
  title,
  description,
  appendix,
  className,
  ...props
}: SlideCardProps) => {
  return (
    <div
      className={cn(
        'group shadow-lg shadow-gray-light overflow-hidden group',
        className,
      )}
      {...props}
    >
      <div className='relative group/overlay w-full pb-[100%] overflow-hidden'>
        <img
          src={imgUrl}
          alt=''
          className='absolute inset-0 object-cover duration-500 transition-transform group-hover:scale-[105%] bg-silver'
          loading='lazy'
        />
        {appendix && (
          <>
            <div className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out bg-gray opacity-0 group-hover/overlay:opacity-40 hidden md:block' />

            <div className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out opacity-0 group-hover/overlay:opacity-100 justify-center items-center hidden md:flex'>
              <div className='flex flex-col gap-y-3'>
                {heroLinks.map((heroLink) => (
                  <LinkCustom
                    key={heroLink.text}
                    to={heroLink.url}
                    className='z-30 py-[10px] border-none block relative w-full'
                  >
                    {heroLink.text}
                  </LinkCustom>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className='px-6 py-3 text-gray'>
        <h4 className='capitalize font-bold text-[14px] tracking-wide whitespace-nowrap'>
          {title}
        </h4>
        {!appendix && (
          <p className='leading-[1.4] text-[12px] tracking-[0.3px] whitespace-nowrap'>
            {description}
          </p>
        )}
        {appendix && (
          <>
            <div className='flex gap-x-2 items-center  border-t-[1px] border-t-gray-light pt-[10px] mt-[10px]'>
              <img src={miniImgUrl} alt='' className='w-6' />
              <p className='leading-[1.4] text-[12px] tracking-[0.3px]'>
                {description}
              </p>
            </div>

            <div className='flex md:hidden flex-col gap-y-2 mt-2'>
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
  );
};
