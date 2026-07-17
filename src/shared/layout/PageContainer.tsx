import type { HTMLAttributes } from 'react'

import styles from './PageContainer.module.css'

type PageContainerProps = HTMLAttributes<HTMLDivElement>

export function PageContainer({ className, ...props }: PageContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(' ')

  return <div className={classes} {...props} />
}
