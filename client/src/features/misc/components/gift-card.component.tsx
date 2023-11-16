import { HTMLAttributes } from 'react';

import LinkCustom from '@/components/link-custom.component';
import heroLinks from '../data/men-women-url.json';
import { cn } from '@/utils/cn';

type GiftCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  miniImgUrl: string;
  imgUrl: string;
  description: string;
};

const GiftCard = ({
  imgUrl,
  miniImgUrl,
  title,
  description,
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
      </div>
      <div className='px-6 py-3 text-gray'>
        <h4 className='capitalize border-b-[1px] border-b-gray-light font-bold pb-[10px] mb-[10px] text-[14px] tracking-wide'>
          {title}
        </h4>
        <div className='flex gap-x-2 items-center mb-2'>
          <img src={miniImgUrl} alt='' className='w-6' />
          <p className='leading-[1.4] text-[12px] tracking-[0.3px]'>
            {description}
          </p>
        </div>
        <div className='flex md:hidden flex-col gap-y-2'>
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
      </div>
    </div>
  );
};

export default GiftCard;
