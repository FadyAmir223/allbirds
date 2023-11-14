import { cn } from '@/utils/cn';
import { Link, LinkProps } from 'react-router-dom';

const LinkCustom = ({ to, className, children, ...props }: LinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        'py-2 px-[18px] bg-gray focus:outline-0 rounded-sm uppercase text-center border-2 border-gray text-xs font-semibold tracking-[1.5px] w-fit',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkCustom;
