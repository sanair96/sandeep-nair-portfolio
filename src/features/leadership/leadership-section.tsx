import { careerTimeline, leadershipPrinciples } from '@/content/leadership'
import { links } from '@/content/links'
import { sectionCopy } from '@/content/section-copy'
import { PageContainer } from '@/shared/layout/PageContainer'
import { SectionHeading } from '@/shared/ui/SectionHeading'

import styles from './leadership-section.module.css'

export function LeadershipSection() {
  return (
    <section aria-labelledby="leadership-title" className={styles.section} id="leadership">
      <PageContainer className={styles.container}>
        <SectionHeading
          description={sectionCopy.leadership.intro}
          eyebrow={sectionCopy.leadership.label}
          id="leadership-title"
          title={sectionCopy.leadership.heading}
        />
        <ol className={styles.principles}>
          {leadershipPrinciples.map((principle) => (
            <li className={styles.principle} key={principle.index}>
              <span className={styles.index}>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </li>
          ))}
        </ol>
        <div className={styles.timelineBlock}>
          <div className={styles.timelineHeader}>
            <h3>{sectionCopy.career.heading}</h3>
            <a
              className={styles.resumeLink}
              download={links.resume.download}
              href={links.resume.href}
            >
              {sectionCopy.career.resumeLink}
            </a>
          </div>
          <ol aria-label={sectionCopy.career.timelineAriaLabel} className={styles.timeline}>
            {careerTimeline.map((item) => (
              <li
                className={'current' in item && item.current ? styles.current : undefined}
                key={`${item.company}-${item.period}`}
              >
                <time>{item.period}</time>
                <strong>{item.company}</strong>
                <span>{item.role}</span>
              </li>
            ))}
          </ol>
        </div>
      </PageContainer>
    </section>
  )
}
