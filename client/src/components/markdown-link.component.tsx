import { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/utils/cn.util';

type MarkdownLinkProps = ComponentPropsWithoutRef<'a'> & {
  href?: string;
};

const MarkdownLink = ({
  children,
  className,
  href,
  ...props
}: MarkdownLinkProps) => (
  <Link to={href || '/'} className={cn('underline', className)} {...props}>
    {children}
  </Link>
);

export default MarkdownLink;
