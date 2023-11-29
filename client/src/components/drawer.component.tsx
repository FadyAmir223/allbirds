import { ReactNode } from 'react';

import Modal from '@/components/modal.component';
import Overlay from '@/components/overlay.component';
import { cn } from '@/utils/cn.util';

type DrawerProps = {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  handleClose: () => void;
};

const Drawer = ({ isOpen, children, className, handleClose }: DrawerProps) => {
  return (
    <Modal>
      <Overlay
        className='top-0 left-0 z-50 opacity-[85%]'
        isOpen={isOpen}
        onClick={handleClose}
      />
      <div
        className={cn(
          'fixed h-[100dvh] w-full md:w-[395px] bg-white top-0 right-0 z-50 duration-[250ms] overflow-y-scroll',
          { 'translate-x-full': !isOpen },
          className,
        )}
      >
        {children}
      </div>
    </Modal>
  );
};

export default Drawer;
