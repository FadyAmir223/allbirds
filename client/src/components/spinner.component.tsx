import { cn } from '@/utils/cn.util'

type SpinnerProps = {
  className?: string
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className={cn('grid place-items-center p-16', className)}>
      <div className='h-20 w-20 animate-[spin_1.5s_linear_infinite] rounded-full border-8 border-gray border-r-transparent' />
    </div>
  )
}
