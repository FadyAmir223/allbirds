import { ComponentPropsWithoutRef, useCallback } from 'react'

import { cn } from '@/utils/cn.util'

type ColorButtonProps = ComponentPropsWithoutRef<'button'> & {
  hues: string[]
  selectable?: boolean
  selected?: boolean
}

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
      Number((index * cut).toFixed(2)) * 100

    const cut = 1 / hues.length
    const degree = `${(hues.length - 1) * -45}deg`

    const stops = hues.map((color, index) => {
      const start = calculatePercentage(index, cut)
      const end = calculatePercentage(index + 1, cut)
      return `,${color} ${start}%, ${color} ${end}%`
    })

    return `linear-gradient(${degree} ${stops.join('')})`
  }, [hues])

  return (
    <button
      className={cn(
        'aspect-square w-full rounded-full border border-gray',
        className,
        {
          'relative before:absolute before:inset-[-2px] before:rounded-full before:border-2 before:border-transparent before:p-2':
            selectable,
          'before:border-gray': selected,
          'hover:before:border-gray-medium': selectable && !selected,
        },
      )}
      style={{ background: linearGradient(), ...style }}
      {...props}
    />
  )
}

export default ColorButton
