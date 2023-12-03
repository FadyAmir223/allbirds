import { MouseEvent, useState } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import Markdown from 'react-markdown'

import MarkdownLink from '@/components/markdown-link.component'

type ShopAdProps = {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

const ads = [
  'Less Stress. More Gifts. We’ve extended free returns until 1/22/24. [Shop Men](/collections/mens) | [Shop Women](/collections/womens)',
  'The New Wool Runner 2 Is Next-Gen Design With Next-Level Comfort. [Shop Men](/collections/mens) l [Shop Women](/collections/womens)',
  'Gift Cozy, Get Cozy: Wrap Up Foolproof Gifts For Everyone On Your List. [Shop Men](/collections/mens) | [Shop Women](/collections/womens)',
]

const ShopAd = ({ onClick }: ShopAdProps) => {
  const [currAd, setCurrAd] = useState(0)

  const handleNextAd = () => {
    setCurrAd((prevAd) => (prevAd + 1) % ads.length)
  }

  return (
    <div className='flex h-8 items-center justify-center bg-gray px-[15px] text-[9.3px] lg:px-6'>
      <div className='relative mx-auto text-white'>
        <Markdown
          className='font-medium leading-[1.3] tracking-[0.3px]'
          components={{
            a: (props) => <MarkdownLink {...props} onClick={onClick} />,
          }}
        >
          {ads[currAd]}
        </Markdown>
      </div>
      <button
        className='absolute right-6 flex scale-[130%] items-center text-white'
        onClick={handleNextAd}
      >
        <FaAngleRight />
      </button>
    </div>
  )
}

export default ShopAd
