import { atlassianStory } from '@/content/career/atlassian'

import { AtlassianDiagram } from './atlassian-diagram.client'
import styles from './atlassian-case.module.css'

export function AtlassianCase() {
  return (
    <article aria-labelledby="atlassian-title" className={styles.case}>
      <div className={styles.copy}>
        <div className={styles.narrative}>
          <div className={styles.meta}>
            <p className={styles.company}>{atlassianStory.company}</p>
            <p className={styles.period}>{atlassianStory.period}</p>
          </div>
          <p className={styles.role}>{atlassianStory.role}</p>
          <h3 className={styles.title} id="atlassian-title">
            {atlassianStory.title}
          </h3>
          <p className={styles.body}>{atlassianStory.body}</p>
        </div>

        <div className={styles.outcomes}>
          <p className={styles.outcomeLabel}>What changed</p>
          <div className={styles.outcomeGrid}>
            {atlassianStory.outcomes.map((outcome) => (
              <div className={styles.outcome} key={outcome.label}>
                <strong>{outcome.value}</strong>
                <span>{outcome.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AtlassianDiagram />
    </article>
  )
}
