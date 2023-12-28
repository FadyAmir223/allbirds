import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
}

const Modal = ({ children }: ModalProps) => {
  const elRef = useRef<HTMLDivElement | null>(null)

  if (!elRef.current) elRef.current = document.createElement('div')

  useEffect(() => {
    const modalRoot = document.getElementById('modal')

    if (!modalRoot) throw new Error("#modal doesn't exist")

    if (elRef.current) modalRoot.appendChild(elRef.current)

    return () => {
      if (elRef.current) modalRoot.removeChild(elRef.current)
    }
  }, [])

  return createPortal(children, elRef.current)
}

export default Modal
