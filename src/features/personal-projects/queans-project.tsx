import { queansProject } from '@/content/projects/queans'
import { sectionCopy } from '@/content/section-copy'

import { QueansPipeline } from './queans-pipeline.client'
import styles from './queans-project.module.css'

export function QueansProject() {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{queansProject.eyebrow}</p>
          <h3>{queansProject.title}</h3>
        </div>
        {queansProject.link ? (
          <a
            className={styles.link}
            href={queansProject.link.href}
            rel="noreferrer"
            target="_blank"
          >
            {queansProject.link.label}
          </a>
        ) : null}
      </header>
      <p className={styles.body}>{queansProject.body}</p>
      <div className={styles.pipeline}>
        <div className={styles.pipelineHeader}>
          <p>{sectionCopy.projects.pipelineLabel}</p>
          <p>{sectionCopy.projects.reviewLabel}</p>
        </div>
        <QueansPipeline
          ariaLabel={`${queansProject.title} ${sectionCopy.projects.pipelineAriaSuffix}`}
          steps={queansProject.steps}
        />
      </div>
      <ul aria-label={sectionCopy.projects.technologyAriaLabel} className={styles.technology}>
        {queansProject.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
    </article>
  )
}
