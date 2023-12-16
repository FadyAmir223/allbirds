import { type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'

type HeadProps = {
  title?: string
  description?: string
  children?: ReactNode
}

const Head = ({ title, description, children }: HeadProps) => {
  return (
    <Helmet>
      <title>{title} | allbirds</title>
      <meta name='description' content={description} />
      {children}
    </Helmet>
  )
}

export default Head
