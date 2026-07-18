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
  const [inViewport, setInViewport] = useState(false)
  const [hasApproached, setHasApproached] = useState(false)

  useEffect(() => {
    const element = scope.current
    if (!element) return

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setInViewport(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    )
    const approachObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setHasApproached(true)
      },
      { rootMargin: '700px 0px', threshold: 0 },
    )
    visibilityObserver.observe(element)
    approachObserver.observe(element)
    return () => {
      visibilityObserver.disconnect()
      approachObserver.disconnect()
    }
  }, [scope])

  return {
    hasApproached,
    viewerVisible: documentVisible && inViewport,
  }
}
