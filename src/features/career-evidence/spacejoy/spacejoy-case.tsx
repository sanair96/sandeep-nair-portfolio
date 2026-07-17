import { spacejoyStory } from '@/content/career/spacejoy'

import styles from './spacejoy-case.module.css'
import { SpacejoyExperience } from './spacejoy-experience.client'

export function SpacejoyCase() {
  return (
    <article aria-labelledby="spacejoy-title" className={styles.case}>
      <div className={styles.copy}>
        <div className={styles.narrative}>
          <div className={styles.meta}>
            <p className={styles.company}>{spacejoyStory.company}</p>
            <p className={styles.period}>{spacejoyStory.period}</p>
          </div>
          <p className={styles.role}>{spacejoyStory.role}</p>
          <h3 className={styles.title} id="spacejoy-title">
            {spacejoyStory.title}
          </h3>
          <p className={styles.body}>{spacejoyStory.body}</p>
        </div>

        <div className={styles.outcomes}>
          {spacejoyStory.outcomes.map((outcome) => (
            <div className={styles.outcome} key={outcome.label}>
              <strong>{outcome.value}</strong>
              <span>{outcome.label}</span>
            </div>
          ))}
        </div>
      </div>

      <SpacejoyExperience />
    </article>
  )
}
