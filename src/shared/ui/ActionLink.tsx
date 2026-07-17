import type { AnchorHTMLAttributes, ReactNode } from 'react'

import styles from './ActionLink.module.css'

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'inverse'
}

export function ActionLink({
  children,
  className,
  variant = 'primary',
  ...props
}: ActionLinkProps) {
  const classes = [styles.link, styles[variant], className].filter(Boolean).join(' ')

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  )
}
