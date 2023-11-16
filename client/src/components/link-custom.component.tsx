import { ButtonHTMLAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { cn } from '@/utils/cn';

type ExtraProps = {
  hover?: boolean;
  styleType?: 'normal' | 'invert';
  element?: 'link' | 'button';
};

type LinkCustomProps = (ButtonHTMLAttributes<HTMLButtonElement> | LinkProps) &
  ExtraProps;

const LinkCustom = ({
  hover = false,
  styleType = 'normal',
  element = 'link',
  className,
  children,
  ...props
}: LinkCustomProps) => {
  const style = cn(
    'py-2 px-[18px] bg-gray focus:outline-0 rounded-sm uppercase text-center border-2 border-gray text-xs font-semibold tracking-[1.5px] w-fit',
    {
      'duration-100': hover,
      'bg-white hover:bg-gray hover:text-white':
        hover && styleType === 'normal',
      'bg-gray hover:bg-white hover:text-gray': hover && styleType === 'invert',
    },
    className,
  );

  return element === 'link' ? (
    <Link className={style} {...(props as LinkProps)}>
      {children}
    </Link>
  ) : (
    <button
      className={style}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default LinkCustom;
