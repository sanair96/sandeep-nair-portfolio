import { links } from '@/content/links'
import { profile } from '@/content/profile'
import { sectionCopy } from '@/content/section-copy'
import { PageContainer } from '@/shared/layout/PageContainer'

import styles from './navigation.module.css'

const navigationItems = [
  { href: '#work', label: sectionCopy.navigation.work },
  { href: '#leadership', label: sectionCopy.navigation.leadership },
  { href: '#projects', label: sectionCopy.navigation.projects },
]

export function Navigation() {
  return (
    <header className={styles.header}>
      <PageContainer className={styles.container}>
        <a className={styles.identity} href="#main-content">
          <span aria-hidden="true" className={styles.mark}>
            {profile.initials}
          </span>
          <span>{profile.name}</span>
        </a>
        <nav aria-label={sectionCopy.navigation.ariaLabel} className={styles.navigation}>
          {navigationItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <a className={styles.resume} download={links.resume.download} href={links.resume.href}>
            {sectionCopy.navigation.resume}
          </a>
        </nav>
        <a
          className={styles.mobileResume}
          download={links.resume.download}
          href={links.resume.href}
        >
          {sectionCopy.navigation.resume}
        </a>
      </PageContainer>
    </header>
  )
}
