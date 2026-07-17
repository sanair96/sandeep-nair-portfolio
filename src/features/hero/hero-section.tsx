import { careerFacts } from '@/content/career-facts'
import { links } from '@/content/links'
import { profile } from '@/content/profile'
import { sectionCopy } from '@/content/section-copy'
import { PageContainer } from '@/shared/layout/PageContainer'
import { ActionLink } from '@/shared/ui/ActionLink'

import { EvidenceBoard } from './evidence-board'
import styles from './hero-section.module.css'
import { Navigation } from './navigation'

const metrics = [
  careerFacts.experience,
  careerFacts.annualSavings,
  careerFacts.operatorTime,
  careerFacts.platformLaunch,
]

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className={styles.section}>
      <Navigation />
      <PageContainer className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.status} />
            {profile.eyebrow}
          </p>
          <h1 className={styles.title} id="hero-title">
            {profile.headline}
          </h1>
          <p className={styles.intro}>{profile.intro}</p>
          <div className={styles.actions}>
            <ActionLink href="#work">
              {sectionCopy.hero.reviewWork} <span aria-hidden="true">↓</span>
            </ActionLink>
            <ActionLink
              download={links.resume.download}
              href={links.resume.href}
              variant="secondary"
            >
              {sectionCopy.hero.downloadResume}
            </ActionLink>
          </div>
          <div className={styles.meta}>
            <span>{profile.location}</span>
            <span aria-hidden="true" className={styles.metaRule} />
            <span>{profile.focus.join(' · ')}</span>
          </div>
        </div>
        <EvidenceBoard />
      </PageContainer>
      <div className={styles.metricBar}>
        <PageContainer>
          <dl className={styles.metrics}>
            {metrics.map((metric) => (
              <div className={styles.metric} key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </PageContainer>
      </div>
    </section>
  )
}
