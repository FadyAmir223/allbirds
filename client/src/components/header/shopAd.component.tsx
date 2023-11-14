import { useState } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { FaAngleRight } from 'react-icons/fa';
import { cn } from '@/utils/cn';

const ads = [
  'Less Stress. More Gifts. We’ve extended free returns until 1/22/24. [Shop Men](/collections/mens) | [Shop Women](/collections/womens)',
  'The New Wool Runner 2 Is Next-Gen Design With Next-Level Comfort. [Shop Men](/collections/mens) l [Shop Women](/collections/womens)',
  'Gift Cozy, Get Cozy: Wrap Up Foolproof Gifts For Everyone On Your List. [Shop Men](/collections/mens) | [Shop Women](/collections/womens)',
];

interface MarkdownLinkProps {
  className?: string;
  href?: string;
  children?: React.ReactNode;
}

const MarkdownLink = ({
  href,
  children,
  className,
  ...props
}: MarkdownLinkProps) => (
  <Link to={href || '/'} className={cn('underline', className)} {...props}>
    {children}
  </Link>
);

const ShopAd = () => {
  const [currAd, setCurrAd] = useState(0);

  const handleNextAd = () => {
    setCurrAd((prevAd) => (prevAd + 1) % ads.length);
  };

  return (
    <div className='bg-gray h-8 px-[15px] lg:px-6 text-[9.3px] flex items-center justify-center'>
      <div className='mx-auto relative text-white'>
        <Markdown
          className='font-medium leading-[1.3] tracking-[0.3px]'
          components={{ a: MarkdownLink }}
        >
          {ads[currAd]}
        </Markdown>
      </div>
      <button
        className='flex items-center absolute right-6 scale-[130%] text-white'
        onClick={handleNextAd}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default ShopAd;
