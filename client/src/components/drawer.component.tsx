import { type ReactNode } from 'react'
import Modal from '@/components/modal.component'
import Overlay from '@/components/overlay.component'
import { cn } from '@/utils/cn.util'

type DrawerProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
  handleClose: () => void
}

const Drawer = ({ isOpen, children, className, handleClose }: DrawerProps) => {
  return (
    <Modal>
      <Overlay
        className='left-0 top-0 z-50 opacity-[85%]'
        isOpen={isOpen}
        onClick={handleClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-[100dvh] w-full overflow-y-scroll bg-white duration-[250ms] md:w-[395px]',
          { 'translate-x-full': !isOpen },
          className,
        )}
      >
        {children}
      </div>
    </Modal>
  )
}

export default Drawer
