import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn.util'

type SizeButtonProps = ComponentPropsWithoutRef<'button'> & {
  selected?: boolean
  isSoldOut?: boolean
  enabledOnSoldOut?: boolean
}

const SizeButton = ({
  children,
  className,
  selected = false,
  isSoldOut = false,
  enabledOnSoldOut = false,
  ...props
}: SizeButtonProps) => {
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
      {children}
    </button>
  )
}

export default SizeButton
