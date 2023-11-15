import { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { cn } from '@/utils/cn';
import GiftCard from './gift-card.component';
import gifts from '../data/gifts.json';
import screenSize from '@/data/screen-size.json';

const BestSellingGifts = () => {
  const [gift, setGift] = useState({
    section: 0,
    card: 0,
    total: gifts.flatMap((figt) => figt.items).length,
  });

  const imgSize = (innerWidth - 8 * 2) / (screenSize.sm > innerWidth ? 1 : 2);

  const handleGiftSection = (idx: number) => {
    setGift((prevGift) => ({
      ...prevGift,
      section: idx,
      card: idx * 3,
    }));
  };

  const handleGiftChange = (direction: 1 | -1) => {
    setGift((prevGift) => ({
      ...prevGift,
      card: prevGift.card + direction,
    }));
  };

  return (
    <section className='px-6'>
      <div className='lg:px-9'>
        <h2 className='capitalize font-bold text-[26px] text-center mb-2'>
          our best-selling gifts
        </h2>

        <div className='border-b-2 border-gray-light flex justify-center mb-8'>
          <div className='flex justify-center relative'>
            <span
              className='absolute -bottom-[2px] w-44 bg-black left-0 h-[2px] duration-150'
              style={{ translate: `${100 * gift.section}%` }}
            />

            {gifts.map((gift, idx) => (
              <button
                key={gift.text}
                className={cn(
                  'allbirds-font p-3 border-b-2 border-b-transparent w-44 tracking-[1px]',
                )}
                onClick={() => handleGiftSection(idx)}
              >
                {gift.text}
              </button>
            ))}
          </div>
        </div>

        <div className='hidden md:flex gap-x-2 justify-center'>
          {gifts[gift.section].items.map((giftItem) => (
            <GiftCard key={giftItem.title} {...giftItem} className='w-full' />
          ))}
        </div>

        <div className=' md:hidden relative'>
          <div
            className='whitespace-nowrap flex gap-x-2 duration-500 '
            style={{ translate: `-${gift.card * (imgSize + 8)}px` }}
          >
            {gifts.map((gift) =>
              gift.items.map((giftItem) => (
                <GiftCard
                  key={giftItem.title}
                  {...giftItem}
                  style={{ minWidth: imgSize }}
                />
              )),
            )}
          </div>

          <button
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gray text-gray-light grid place-items-center w-10 h-10',
              { hidden: gift.card > gift.total - 3 },
            )}
            onClick={() => handleGiftChange(1)}
            disabled={gift.card > gift.total - 3}
          >
            <span className='scale-150'>
              <FaAngleRight />
            </span>
          </button>

          <button
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gray text-gray-light grid place-items-center w-10 h-10',
              { hidden: gift.card === 0 },
            )}
            onClick={() => handleGiftChange(-1)}
            disabled={gift.card === 0}
          >
            <span className='scale-150'>
              <FaAngleLeft />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellingGifts;
