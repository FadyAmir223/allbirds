import { type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/cn.util'
import { type CollectionEdition } from '@/features/collections'
import { type ProductEdition } from '@/features/products'

type SizeButtonProps = ComponentPropsWithoutRef<'button'> & {
  size: string
  product?: CollectionEdition | ProductEdition
  selected?: boolean
  enabledOnSoldOut?: boolean
}

const SizeButton = ({
  size,
  product,
  className,
  selected = false,
  enabledOnSoldOut = false,
  ...props
}: SizeButtonProps) => {
  const isSoldOut = product?.sizesSoldOut.includes(size)

  return (
    <button
      className={cn(
        'gird aspect-square place-items-center border border-black text-[12px] text-black',
        {
          'border-gray/60 text-gray/60 [background:linear-gradient(to_top_left,transparent_calc(50%-1px),gray,transparent_calc(50%+1px))]':
            isSoldOut,
          '!bg-gray !text-white': selected,
          'duration-100 hover:bg-gray-light':
            !selected && (!isSoldOut || enabledOnSoldOut),
          'pointer-events-none': isSoldOut && !enabledOnSoldOut,
        },
        className,
      )}
      {...props}
    >
      {size}
    </button>
  )
}

export default SizeButton
