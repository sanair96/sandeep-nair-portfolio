import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  description: string
  eyebrow: string
  id: string
  title: string
}

export function SectionHeading({ description, eyebrow, id, title }: SectionHeadingProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title} id={id}>
          {title}
        </h2>
      </div>
      <p className={styles.description}>{description}</p>
    </header>
  )
}
