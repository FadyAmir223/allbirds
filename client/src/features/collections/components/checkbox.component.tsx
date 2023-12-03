import { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/cn.util'

type CheckboxProps = ComponentPropsWithoutRef<'input'> & {
  tag: string
  isColor?: boolean
}

const Checkbox = ({ tag, isColor = false, ...props }: CheckboxProps) => {
  return (
    <li className='group/checkbox mb-2 flex cursor-pointer select-none items-center last-of-type:mb-0'>
      <input
        type='checkbox'
        id={tag}
        className={cn(
          'peer h-4 w-[18px] cursor-pointer appearance-none',
          isColor
            ? 'relative aspect-square rounded-full border border-gray-light before:absolute before:inset-[-2.5px] before:rounded-full before:border-[1.5px] before:border-transparent before:p-2 checked:before:border-gray hover:before:border-gray-medium checked:hover:before:border-gray'
            : 'relative rounded-sm border border-gray before:absolute before:right-[-1px] before:top-[8px] before:h-[1.9px] before:w-[14px] before:-rotate-45 before:bg-white after:absolute after:bottom-[1px] after:left-[2px] after:h-[6px] after:w-[1.9px] after:-rotate-[30deg] after:bg-white checked:bg-gray group-hover/checkbox:bg-silver-dark/30 checked:group-hover/checkbox:bg-gray',
        )}
        style={isColor ? { backgroundColor: tag } : {}}
        {...props}
      />

      <label
        htmlFor={tag}
        className='w-full cursor-pointer pl-2.5 text-[12px] capitalize peer-checked:font-bold'
      >
        {tag.replace('-', ' ')}
      </label>
    </li>
  )
}

export default Checkbox
