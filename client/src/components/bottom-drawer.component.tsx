import { ComponentPropsWithoutRef } from 'react'
import CloseButton from './close-button.component'
import Modal from '@/components/modal.component'
import Overlay from '@/components/overlay.component'
import { cn } from '@/utils/cn.util'

type BottomDrawerProps = ComponentPropsWithoutRef<'div'> & {
  isOpen: boolean
  handleClose: () => void
}

const BottomDrawer = ({
  isOpen,
  handleClose,
  children,
  className,
  ...props
}: BottomDrawerProps) => {
  return (
    <Modal>
      <Overlay isOpen={isOpen} onClick={handleClose} />

      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 h-[100dvh] w-full -translate-x-1/2 translate-y-[calc(50%+2.5dvh)] overflow-y-scroll bg-white px-40 py-16 tracking-[0.4px] text-gray transition-transform duration-300 md:h-[95dvh] md:w-[98%]',
          isOpen ? '-translate-y-1/2' : 'opacity-0',
          className,
        )}
        {...props}
      >
        <CloseButton
          className='right-6 top-6 scale-[1.8]'
          onClick={handleClose}
        />

        {children}
      </div>
    </Modal>
  )
}

export default BottomDrawer
