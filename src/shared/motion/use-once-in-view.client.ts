'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useOnceInView<T extends Element>(target: RefObject<T | null>, threshold: number) {
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const node = target.current
    if (!node || hasEntered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setHasEntered(true)
        observer.disconnect()
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasEntered, target, threshold])

  return hasEntered
}
