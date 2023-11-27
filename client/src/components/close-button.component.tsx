import { ComponentPropsWithoutRef } from 'react';
import { TfiClose } from 'react-icons/tfi';

import { cn } from '@/utils/cn.util';

type CloseButtonProps = ComponentPropsWithoutRef<'button'> & {
  position?: 'left' | 'right';
};

const CloseButton = ({ position, className, ...props }: CloseButtonProps) => {
  return (
    <button
      className={cn(
        'absolute top-0 hover:rotate-90 duration-[400ms] scale-125',
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
  );
};

export default CloseButton;
