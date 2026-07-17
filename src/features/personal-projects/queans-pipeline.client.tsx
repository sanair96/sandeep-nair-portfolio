'use client'

import { useAnimate } from 'motion/react-mini'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { DiagramStep } from '@/content/content.types'
import { motionEase } from '@/shared/motion/motion.constants'
import { useOnceInView } from '@/shared/motion/use-once-in-view.client'
import { useReducedMotion } from '@/shared/motion/use-reduced-motion.client'

import styles from './queans-project.module.css'

type Playback = 'idle' | 'playing' | 'complete'

interface QueansPipelineProps {
  readonly ariaLabel: string
  readonly steps: readonly DiagramStep[]
}

const HANDOFF_DURATION = 0.24
const DWELL_DURATION = 480

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration))

function getStepTransform(list: HTMLOListElement, index: number) {
  const steps = list.querySelectorAll<HTMLElement>('[data-pipeline-step]')
  const origin = steps.item(0)
  const target = steps.item(index)

  if (!origin || !target) return 'translate3d(0, 0, 0)'

  return `translate3d(${target.offsetLeft - origin.offsetLeft}px, ${
    target.offsetTop - origin.offsetTop
  }px, 0)`
}

export function QueansPipeline({ ariaLabel, steps }: QueansPipelineProps) {
  const [scope, animate] = useAnimate<HTMLOListElement>()
  const reducedMotion = useReducedMotion()
  const hasEntered = useOnceInView(scope, 0.5)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playback, setPlayback] = useState<Playback>('idle')
  const activeIndexRef = useRef(0)
  const playedRef = useRef(false)
  const sequenceRef = useRef(0)

  const placeIndicator = useCallback(
    (index: number) => {
      const list = scope.current
      const indicator = list?.querySelector<HTMLElement>('[data-pipeline-indicator]')
      if (!list || !indicator) return
      indicator.style.transform = getStepTransform(list, index)
    },
    [scope],
  )

  useEffect(() => {
    const list = scope.current
    if (!list) return

    let frame = 0
    const reposition = () => {
      if (!playedRef.current) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => placeIndicator(activeIndexRef.current))
    }

    window.addEventListener('resize', reposition)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', reposition)
    }
  }, [placeIndicator, scope])

  useLayoutEffect(() => {
    if (steps.length === 0) return

    if (!reducedMotion) {
      if (!playedRef.current) return
      placeIndicator(activeIndexRef.current)
      return
    }

    playedRef.current = true
    sequenceRef.current += 1
    const finalIndex = steps.length - 1
    activeIndexRef.current = finalIndex
    const indicator = scope.current?.querySelector<HTMLElement>('[data-pipeline-indicator]')
    indicator?.getAnimations().forEach((animation) => animation.cancel())
    placeIndicator(finalIndex)
    const frame = window.requestAnimationFrame(() => {
      setActiveIndex(finalIndex)
      setPlayback('complete')
    })

    return () => window.cancelAnimationFrame(frame)
  }, [placeIndicator, reducedMotion, scope, steps.length])

  useEffect(() => {
    if (!hasEntered || reducedMotion || playedRef.current || steps.length === 0) return

    playedRef.current = true
    const sequence = ++sequenceRef.current
    setPlayback('playing')

    void (async () => {
      await wait(DWELL_DURATION)

      for (let index = 1; index < steps.length; index += 1) {
        if (sequence !== sequenceRef.current) return
        const list = scope.current
        const indicator = list?.querySelector<HTMLElement>('[data-pipeline-indicator]')
        if (!list || !indicator) return

        await animate(
          indicator,
          { transform: getStepTransform(list, index) },
          { duration: HANDOFF_DURATION, ease: motionEase.inOut },
        )
        if (sequence !== sequenceRef.current) return

        activeIndexRef.current = index
        setActiveIndex(index)
        if (index < steps.length - 1) await wait(DWELL_DURATION)
      }

      if (sequence === sequenceRef.current) setPlayback('complete')
    })()

    return () => {
      sequenceRef.current += 1
    }
  }, [animate, hasEntered, reducedMotion, scope, steps.length])

  const activeStep = steps[activeIndex]
  const playbackState = reducedMotion ? 'reduced' : playback

  return (
    <ol
      aria-label={ariaLabel}
      className={styles.pipelineList}
      data-active-step={activeStep?.id ?? 'none'}
      data-playback={playbackState}
      ref={scope}
      role="list"
    >
      {steps.length > 0 ? (
        <li
          aria-hidden="true"
          className={styles.pipelineIndicator}
          data-pipeline-indicator
          data-playback={playbackState}
          role="presentation"
        />
      ) : null}
      {steps.map((step, index) => (
        <li
          className={index === steps.length - 1 ? styles.reviewStep : undefined}
          data-pipeline-step={step.id}
          key={step.index}
        >
          <span>{step.index}</span>
          <strong>{step.label}</strong>
        </li>
      ))}
    </ol>
  )
}
