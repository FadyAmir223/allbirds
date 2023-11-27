import { ComponentPropsWithoutRef } from 'react';

import Modal from '@/components/modal.component';
import Overlay from '@/components/overlay.component';
import CloseButton from './close-button.component';
import { cn } from '@/utils/cn.util';

type BottomDrawerProps = ComponentPropsWithoutRef<'div'> & {
  isOpen: boolean;
  handleClose: () => void;
};

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
          'bg-white text-gray py-16 px-40 z-50 fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(50%+5dvh)] h-[95dvh] w-[98%] duration-300 transition-transform tracking-[0.4px] overflow-y-scroll',
          isOpen ? '-translate-y-1/2' : 'opacity-0',
          className,
        )}
        {...props}
      >
        <CloseButton
          className='top-6 right-6 scale-[1.8]'
          onClick={handleClose}
        />

        {children}
      </div>
    </Modal>
  );
};

export default BottomDrawer;
