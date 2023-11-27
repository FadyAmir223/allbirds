import { useEffect } from 'react';

export const useScroll = (...isOpenArgs: boolean[]) => {
  useEffect(() => {
    isOpenArgs.some((isOpen) => isOpen)
      ? document.body.classList.add('overflow-y-hidden')
      : document.body.classList.remove('overflow-y-hidden');
  }, [isOpenArgs]);
};
