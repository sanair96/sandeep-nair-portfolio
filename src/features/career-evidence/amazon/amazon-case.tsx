import { amazonStory } from '@/content/career/amazon'

import styles from './amazon-case.module.css'
import { AmazonWorkflow } from './amazon-workflow.client'

export function AmazonCase() {
  return (
    <article aria-labelledby="amazon-title" className={styles.case}>
      <AmazonWorkflow />

      <div className={styles.copy}>
        <div className={styles.narrative}>
          <div className={styles.meta}>
            <p className={styles.company}>{amazonStory.company}</p>
            <p className={styles.period}>{amazonStory.period}</p>
          </div>
          <p className={styles.role}>{amazonStory.role}</p>
          <h3 className={styles.title} id="amazon-title">
            {amazonStory.title}
          </h3>
          <p className={styles.body}>{amazonStory.body}</p>
        </div>

        <div className={styles.outcomes}>
          {amazonStory.outcomes.map((outcome) => (
            <div className={styles.outcome} key={outcome.label}>
              <strong>{outcome.value}</strong>
              <span>{outcome.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
