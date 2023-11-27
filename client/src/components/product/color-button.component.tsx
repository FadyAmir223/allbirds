import { ComponentPropsWithoutRef, useCallback } from 'react';

import { cn } from '@/utils/cn.util';

type ColorButtonProps = ComponentPropsWithoutRef<'button'> & {
  hues: string[];
  selectable?: boolean;
  selected?: boolean;
};

const ColorButton = ({
  hues,
  selectable = false,
  selected = false,
  className,
  style,
  ...props
}: ColorButtonProps) => {
  const linearGradient = useCallback(() => {
    const calculatePercentage = (index: number, cut: number) =>
      Number((index * cut).toFixed(2)) * 100;

    const cut = 1 / hues.length;
    const degree = `${(hues.length - 1) * -45}deg`;

    const stops = hues.map((color, index) => {
      const start = calculatePercentage(index, cut);
      const end = calculatePercentage(index + 1, cut);
      return `,${color} ${start}%, ${color} ${end}%`;
    });

    return `linear-gradient(${degree} ${stops.join('')})`;
  }, [hues]);

  return (
    <button
      className={cn(
        'w-full aspect-square border-2 border-gray rounded-full',
        className,
        {
          'relative before:absolute before:inset-[-5px] before:border-[1.5px] before:border-transparent before:rounded-full before:p-2':
            selectable,
          'before:border-gray': selected,
          'hover:before:border-gray-medium': selectable && !selected,
        },
      )}
      style={{ background: linearGradient(), ...style }}
      {...props}
    />
  );
};

export default ColorButton;
