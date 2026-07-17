'use client'

import Image from 'next/image'
import { useState } from 'react'

import styles from './spacejoy-poster.module.css'

type Props = {
  label: string
  posterSrc: string
  summary: string
}

export function SpacejoyPoster({ label, posterSrc, summary }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={styles.poster}>
      {!failed ? (
        <Image
          alt=""
          fill
          onError={() => setFailed(true)}
          sizes="(max-width: 768px) 100vw, 60vw"
          src={posterSrc}
        />
      ) : (
        <div aria-hidden="true" className={styles.posterArtwork}>
          <span className={styles.roomWall} />
          <span className={styles.roomFloor} />
          <span className={styles.sofa} />
          <span className={styles.table} />
        </div>
      )}
      <span className={styles.annotation}>
        {label} / {summary}
      </span>
    </div>
  )
}
