import { HTMLAttributes } from 'react';

import LinkCustom from '@/components/link-custom.component';
import heroLinks from '../data/men-women-url.json';
import { cn } from '@/utils/cn';

type GiftCardProps = HTMLAttributes<HTMLDivElement> & {
  imgUrl: string;
  miniImgUrl: string;
  title: string;
  description: string;
  appendix: 'on' | 'off';
};

const GiftCard = ({
  imgUrl,
  miniImgUrl,
  title,
  description,
  appendix,
  className,
  ...props
}: GiftCardProps) => {
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
          className='absolute top-0 left-0 w-full h-full object-cover duration-500 transition-transform group-hover:scale-[105%]'
          loading='lazy'
        />
        {appendix === 'on' && (
          <>
            <div className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out bg-gray opacity-0 group-hover/overlay:opacity-40 hidden md:block' />

            <div className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out opacity-0 group-hover/overlay:opacity-100 justify-center items-center hidden md:flex'>
              <div className='flex flex-col gap-y-3'>
                {heroLinks.map((heroLink) => (
                  <LinkCustom
                    key={heroLink.text}
                    to={heroLink.url}
                    className='z-30 py-[10px] border-none block relative w-full'
                    hover
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
        <h4 className='capitalize font-bold text-[14px] tracking-wide'>
          {title}
        </h4>
        {appendix === 'on' && (
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

export default GiftCard;
