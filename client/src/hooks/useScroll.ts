import { useEffect } from 'react';

export const useScroll = (isOpen: boolean) => {
  useEffect(() => {
    isOpen
      ? document.body.classList.add('overflow-y-hidden')
      : document.body.classList.remove('overflow-y-hidden');
  }, [isOpen]);
};
