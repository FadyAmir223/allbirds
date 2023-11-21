import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/utils/cn';
import { EditionProduct } from '@/features/collections';

type SizeButtonProps = ComponentPropsWithoutRef<'button'> & {
  size: string;
  product?: EditionProduct;
  selected?: boolean;
};

const SizeButton = ({
  size,
  product,
  className,
  selected = false,
  ...props
}: SizeButtonProps) => {
  return (
    <button
      className={cn(
        'border border-black text-black gird place-items-center aspect-square text-[12px]',
        product?.sizesSoldOut.includes(size)
          ? 'border-gray/60 text-gray/60 [background:linear-gradient(to_top_left,transparent_calc(50%-1px),gray,transparent_calc(50%+1px))]'
          : 'hover:bg-gray-light duration-100',
        { 'bg-gray hover:bg-gray text-white': selected },
        className,
      )}
      {...props}
    >
      {size}
    </button>
  );
};

export default SizeButton;
