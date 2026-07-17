import { links } from '@/content/links'
import { sectionCopy } from '@/content/section-copy'
import { PageContainer } from '@/shared/layout/PageContainer'
import { ActionLink } from '@/shared/ui/ActionLink'

import styles from './contact-section.module.css'

const secondaryLinks = [links.resume, links.linkedin, links.github]

export function ContactSection() {
  return (
    <>
      <section aria-labelledby="contact-title" className={styles.section} id="contact">
        <PageContainer className={styles.container}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{sectionCopy.contact.label}</p>
            <h2 id="contact-title">{sectionCopy.contact.heading}</h2>
            <p>{sectionCopy.contact.intro}</p>
          </div>
          <div className={styles.actions}>
            <ActionLink className={styles.email} href={links.email.href}>
              {sectionCopy.contact.email}
            </ActionLink>
            <nav aria-label={sectionCopy.contact.linksAriaLabel} className={styles.links}>
              {secondaryLinks.map((link) => (
                <a
                  download={'download' in link ? link.download : undefined}
                  href={link.href}
                  key={link.label}
                  rel={link.external ? 'noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </PageContainer>
      </section>
      <footer className={styles.footer}>
        <PageContainer className={styles.footerInner}>
          <strong>{sectionCopy.footer.name}</strong>
          <span aria-hidden="true" />
          <p>{sectionCopy.footer.note}</p>
        </PageContainer>
      </footer>
    </>
  )
}
