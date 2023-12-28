import { useEffect } from 'react'
import { cn } from '@/utils/cn.util'
import type { ComponentPropsWithoutRef } from 'react'

type OverlayProps = ComponentPropsWithoutRef<'button'> & {
  isOpen: boolean
}

const Overlay = ({ isOpen, className, ...props }: OverlayProps) => {
  useEffect(() => {
    if (isOpen)
      setTimeout(() => {
        document.body.classList.add('overflow-y-hidden')
      }, 150)
    else document.body.classList.remove('overflow-y-hidden')

    return () => document.body.classList.remove('overflow-y-hidden')
  }, [isOpen])

  return (
    isOpen && (
      <button
        className={cn(
          'fixed left-0 top-0 z-40 h-[100dvh] w-screen animate-[fade_250ms_linear] cursor-auto bg-gray opacity-75',
          className,
        )}
        {...props}
      />
    )
  )
}

export default Overlay
