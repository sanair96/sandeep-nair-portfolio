import { sectionCopy } from '@/content/section-copy'

import { AmazonCase } from './amazon/amazon-case'
import { AtlassianCase } from './atlassian/atlassian-case'
import styles from './career-evidence-section.module.css'
import { SpacejoyCase } from './spacejoy/spacejoy-case'

export function CareerEvidenceSection() {
  return (
    <section aria-labelledby="career-evidence-heading" className={styles.section} id="work">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <p className={styles.eyebrow}>{sectionCopy.work.label}</p>
            <h2 className={styles.heading} id="career-evidence-heading">
              {sectionCopy.work.heading}
            </h2>
          </div>
          <p className={styles.introduction}>{sectionCopy.work.intro}</p>
        </header>

        <div className={styles.cases}>
          <AtlassianCase />
          <AmazonCase />
          <SpacejoyCase />
        </div>
      </div>
    </section>
  )
}
