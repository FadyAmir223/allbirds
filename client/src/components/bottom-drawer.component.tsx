import { type ComponentPropsWithoutRef } from 'react'
import CloseButton from './close-button.component'
import Modal from '@/components/modal.component'
import Overlay from '@/components/overlay.component'
import { cn } from '@/utils/cn.util'

type BottomDrawerProps = ComponentPropsWithoutRef<'div'> & {
  isOpen: boolean
  handleClose: () => void
  animate?: boolean
}

const BottomDrawer = ({
  isOpen,
  handleClose,
  children,
  className,
  animate = true,
  ...props
}: BottomDrawerProps) => {
  return (
    <Modal>
      <Overlay isOpen={isOpen} onClick={handleClose} />

      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 h-[100dvh] w-full -translate-x-1/2 translate-y-[calc(50%+2.5dvh)] overflow-y-scroll bg-white px-6 py-16 tracking-[0.4px] text-gray md:h-[95dvh] md:w-[98%]',
          className,
          isOpen ? '-translate-y-1/2' : 'opacity-0',
          { 'transition-transform duration-300': animate },
        )}
        {...props}
      >
        <CloseButton
          className='right-6 top-6 scale-[1.8]'
          onClick={handleClose}
        />
        <div className={cn('h-full', { 'container mx-auto': !className })}>
          {children}
        </div>
      </div>
    </Modal>
  )
}

export default BottomDrawer
