import { scldomainProject } from '@/content/projects/scldomain'
import { sectionCopy } from '@/content/section-copy'

import styles from './scldomain-project.module.css'

export function ScldomainProject() {
  return (
    <article className={styles.card}>
      <header>
        <p className={styles.eyebrow}>{scldomainProject.eyebrow}</p>
        <h3>{scldomainProject.title}</h3>
      </header>
      <p className={styles.body}>{scldomainProject.body}</p>
      <ol aria-label={`${scldomainProject.title} ${sectionCopy.projects.architectureAriaSuffix}`}>
        {scldomainProject.steps.map((step) => (
          <li key={step.index}>
            <span>{step.index}</span>
            <i aria-hidden="true" />
            <strong>{step.label}</strong>
          </li>
        ))}
      </ol>
      <ul aria-label={sectionCopy.projects.technologyAriaLabel} className={styles.technology}>
        {scldomainProject.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      {scldomainProject.link ? (
        <a
          className={styles.link}
          href={scldomainProject.link.href}
          rel="noreferrer"
          target="_blank"
        >
          {scldomainProject.link.label}
        </a>
      ) : null}
    </article>
  )
}
