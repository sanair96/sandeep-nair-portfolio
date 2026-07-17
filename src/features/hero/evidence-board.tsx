import Image from 'next/image'

import { profile } from '@/content/profile'
import { sectionCopy } from '@/content/section-copy'

import styles from './evidence-board.module.css'

export function EvidenceBoard() {
  return (
    <aside aria-labelledby="evidence-board-title" className={styles.board}>
      <div aria-hidden="true" className={styles.constructionLine} />
      <header className={styles.intro}>
        <div className={styles.portraitShell}>
          {/* The source portrait is intentionally small, like a pinned ID photo. */}
          <Image
            alt=""
            className={styles.portrait}
            height="78"
            src="/images/portrait.webp"
            width="78"
          />
        </div>
        <div className={styles.introCopy}>
          <p className={styles.kicker}>{sectionCopy.hero.quickIntroLabel}</p>
          <p className={styles.statement} id="evidence-board-title">
            {profile.quickIntro}
          </p>
          <p className={styles.route}>{profile.quickIntroRoute}</p>
        </div>
      </header>
      <ol className={styles.list}>
        {profile.evidenceItems.map((item) => (
          <li className={styles.item} key={item.index}>
            <span className={styles.node}>{item.index}</span>
            <div>
              <p className={styles.label}>{item.audience}</p>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.meta}>{item.meta}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  )
}
