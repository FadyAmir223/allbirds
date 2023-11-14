import { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type OverlayProps = HTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean;
};

const Overlay = ({ isOpen, className, ...props }: OverlayProps) => {
  return (
    isOpen && (
      <button
        className={cn(
          'bg-gray fixed top-0 left-0 w-screen h-screen animate-[fade_250ms_linear] z-40 opacity-75',
          className,
        )}
        {...props}
      />
    )
  );
};

export default Overlay;
