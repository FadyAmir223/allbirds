import { type ComponentPropsWithoutRef } from 'react'
import { TfiClose } from 'react-icons/tfi'
import { cn } from '@/utils/cn.util'

type CloseButtonProps = ComponentPropsWithoutRef<'button'> & {
  position?: 'left' | 'right'
}

const CloseButton = ({ position, className, ...props }: CloseButtonProps) => {
  return (
    <button
      className={cn(
        'absolute top-0 scale-125 duration-[400ms] hover:rotate-90',
        {
          'left-0': position === 'left',
          'right-0': position === 'right',
        },
        className,
      )}
      {...props}
    >
      <TfiClose />
    </button>
  )
}

export default CloseButton
