import { type ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn.util'
import type { LinkProps } from 'react-router-dom'

const styleTypes = {
  normal: 'hover:bg-white hover:text-gray',
  invert: 'bg-white text-gray hover:bg-gray hover:text-white',
  black:
    'bg-black text-white border-2 border-transparent hover:bg-transparent hover:text-black hover:border-black',
}

type ExtraProps = {
  styleType?: keyof typeof styleTypes
  element?: 'link' | 'button'
}

type LinkCustomProps = (ComponentPropsWithoutRef<'button'> | LinkProps) &
  ExtraProps

const LinkCustom = ({
  styleType = 'normal',
  element = 'link',
  className,
  children,
  ...props
}: LinkCustomProps) => {
  const isDisabled =
    element === 'button' && 'disabled' in props && props.disabled

  const style = cn(
    'py-2 px-[18px] bg-gray text-white focus:outline-0 rounded-sm uppercase text-center border-2 border-gray text-xs font-[500] tracking-[1.5px] w-fit duration-100',
    { [styleTypes[styleType]]: !isDisabled },
    className,
  )

  return element === 'link' ? (
    <Link className={style} {...(props as LinkProps)}>
      {children}
    </Link>
  ) : (
    <button
      className={style}
      {...(props as ComponentPropsWithoutRef<'button'>)}
    >
      {children}
    </button>
  )
}

export default LinkCustom
