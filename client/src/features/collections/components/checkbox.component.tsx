import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/utils/cn.util';

type CheckboxProps = ComponentPropsWithoutRef<'input'> & {
  tag: string;
  isColor?: boolean;
};

const Checkbox = ({ tag, isColor = false, ...props }: CheckboxProps) => {
  return (
    <li className='flex items-center cursor-pointer select-none mb-2 last-of-type:mb-0 group/checkbox'>
      <input
        type='checkbox'
        id={tag}
        className={cn(
          'cursor-pointer peer appearance-none w-[18px] h-4',
          isColor
            ? 'border border-gray-light rounded-full hover:before:border-gray-medium checked:before:border-gray checked:hover:before:border-gray relative before:absolute before:inset-[-2.5px] before:border-[1.5px] before:border-transparent before:rounded-full before:p-2 aspect-square'
            : 'border border-gray group-hover/checkbox:bg-silver-dark/30 checked:group-hover/checkbox:bg-gray checked:bg-gray rounded-sm relative before:absolute before:top-[8px] before:right-[-1px] before:w-[14px] before:h-[1.9px] before:-rotate-45 before:bg-white after:absolute after:bottom-[1px] after:left-[2px] after:w-[1.9px] after:h-[6px] after:-rotate-[30deg] after:bg-white',
        )}
        style={isColor ? { backgroundColor: tag } : {}}
        {...props}
      />

      <label
        htmlFor={tag}
        className='peer-checked:font-bold capitalize cursor-pointer text-[12px] w-full pl-2.5'
      >
        {tag.replace('-', ' ')}
      </label>
    </li>
  );
};

export default Checkbox;
