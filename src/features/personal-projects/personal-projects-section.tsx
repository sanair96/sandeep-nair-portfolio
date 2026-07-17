import { sectionCopy } from '@/content/section-copy'
import { PageContainer } from '@/shared/layout/PageContainer'
import { SectionHeading } from '@/shared/ui/SectionHeading'

import styles from './personal-projects-section.module.css'
import { QueansProject } from './queans-project'
import { ScldomainProject } from './scldomain-project'

export function PersonalProjectsSection() {
  return (
    <section aria-labelledby="projects-title" className={styles.section} id="projects">
      <PageContainer className={styles.container}>
        <SectionHeading
          description={sectionCopy.projects.intro}
          eyebrow={sectionCopy.projects.label}
          id="projects-title"
          title={sectionCopy.projects.heading}
        />
        <div className={styles.projects}>
          <QueansProject />
          <ScldomainProject />
        </div>
      </PageContainer>
    </section>
  )
}
