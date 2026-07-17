'use client'

import { type RefObject, useEffect, useState, useSyncExternalStore } from 'react'

const getServerDocumentVisibility = () => true
const getDocumentVisibility = () => document.visibilityState === 'visible'

function subscribeToDocumentVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

export function useSpacejoyVisibility(scope: RefObject<HTMLElement | null>) {
  const documentVisible = useSyncExternalStore(
    subscribeToDocumentVisibility,
    getDocumentVisibility,
    getServerDocumentVisibility,
  )
  const [inViewport, setInViewport] = useState(true)

  useEffect(() => {
    const element = scope.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [scope])

  return documentVisible && inViewport
}
