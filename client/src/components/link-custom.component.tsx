import { cn } from '@/utils/cn';
import { Link, LinkProps } from 'react-router-dom';

type LinkCustomProps = LinkProps & {
  hover?: boolean;
  type?: 'normal' | 'invert';
};

const LinkCustom = ({
  to,
  className,
  children,
  hover = false,
  type = 'normal',
  ...props
}: LinkCustomProps) => {
  return (
    <Link
      to={to}
      className={cn(
        'py-2 px-[18px] bg-gray focus:outline-0 rounded-sm uppercase text-center border-2 border-gray text-xs font-semibold tracking-[1.5px] w-fit',
        {
          'duration-100': hover,
          'bg-white hover:bg-gray hover:text-white': hover && type === 'normal',
          'bg-gray hover:bg-white hover:text-gray': hover && type === 'invert',
        },
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkCustom;
