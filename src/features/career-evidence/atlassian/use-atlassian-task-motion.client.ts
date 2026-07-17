'use client'

import { useAnimate } from 'motion/react-mini'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { DiagramStep } from '@/content/content.types'
import { useOnceInView } from '@/shared/motion/use-once-in-view.client'
import { useReducedMotion } from '@/shared/motion/use-reduced-motion.client'

import {
  animateTaskButton,
  animateTaskTransition,
  cancelScopedTaskMotion,
  getTaskMotionRoot,
  snapshotScopedTaskMotion,
  taskTransform,
  type TransitionStart,
  visibleLayer,
} from './atlassian-task-motion'

type Playback = 'idle' | 'playing' | 'complete' | 'manual'

interface TaskMotionOptions {
  readonly isActive: boolean
  readonly suppressMotion: boolean
  readonly tasks: readonly DiagramStep[]
}

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration))

const nextFrame = () =>
  new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))

export function useAtlassianTaskMotion({ isActive, suppressMotion, tasks }: TaskMotionOptions) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()
  const hasEntered = useOnceInView(scope, 0.6)
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [playback, setPlayback] = useState<Playback>('idle')
  const [transitionStart, setTransitionStart] = useState<TransitionStart | null>(null)
  const activeIndexRef = useRef(0)
  const sequenceRef = useRef(0)
  const transitionRef = useRef(0)
  const playedRef = useRef(false)

  const cancelMotion = useCallback(() => {
    cancelScopedTaskMotion(scope)
  }, [scope])

  const showImmediately = useCallback(
    (nextIndex: number) => {
      transitionRef.current += 1
      cancelMotion()
      activeIndexRef.current = nextIndex
      setTransitionStart(null)
      setPreviousIndex(null)
      setActiveIndex(nextIndex)
    },
    [cancelMotion],
  )

  const moveToTask = useCallback(
    async (nextIndex: number, wrap = false, snapshot: TransitionStart | null = null) => {
      const previous = activeIndexRef.current
      if (previous === nextIndex && !wrap) {
        if (snapshot) showImmediately(nextIndex)
        return
      }

      const token = ++transitionRef.current
      const start = snapshot ?? {
        indicator: { opacity: 1, transform: taskTransform(previous) },
        outgoing: visibleLayer,
      }
      setTransitionStart(start)
      setPreviousIndex(previous)
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
      await nextFrame()
      const root = getTaskMotionRoot(scope)
      if (token !== transitionRef.current || !root) return

      await animateTaskTransition({
        animate,
        isCurrent: () => token === transitionRef.current,
        nextIndex,
        root,
        start,
        wrap,
      })
      if (token !== transitionRef.current) return
      setTransitionStart(null)
      setPreviousIndex(null)
    },
    [animate, scope, showImmediately],
  )

  useEffect(() => {
    if (!reducedMotion) return
    sequenceRef.current += 1
    showImmediately(activeIndexRef.current)
  }, [reducedMotion, showImmediately])

  useEffect(() => {
    if (isActive && !suppressMotion) return
    sequenceRef.current += 1
    if (isActive && suppressMotion) playedRef.current = true
    if (playedRef.current) setPlayback('complete')
    showImmediately(activeIndexRef.current)
  }, [isActive, showImmediately, suppressMotion])

  useEffect(() => {
    if (
      !hasEntered ||
      !isActive ||
      reducedMotion ||
      suppressMotion ||
      playedRef.current ||
      tasks.length < 3
    )
      return
    playedRef.current = true
    const sequence = ++sequenceRef.current
    setPlayback('playing')

    void (async () => {
      await wait(700)
      if (sequence !== sequenceRef.current) return
      await moveToTask(1)
      await wait(1400)
      if (sequence !== sequenceRef.current) return
      await moveToTask(2)
      await wait(1400)
      if (sequence !== sequenceRef.current) return
      await moveToTask(0, true)
      if (sequence === sequenceRef.current) setPlayback('complete')
    })()

    return () => {
      sequenceRef.current += 1
    }
  }, [hasEntered, isActive, moveToTask, reducedMotion, suppressMotion, tasks.length])

  const selectTask = useCallback(
    (eventDetail: number, index: number) => {
      sequenceRef.current += 1
      playedRef.current = true
      setPlayback('manual')
      if (reducedMotion || eventDetail === 0) showImmediately(index)
      else {
        const nextTask = tasks[index]
        const snapshot = nextTask ? snapshotScopedTaskMotion(scope, nextTask.id) : null
        void moveToTask(index, false, snapshot)
      }
    },
    [moveToTask, reducedMotion, scope, showImmediately, tasks],
  )

  const pressTask = useCallback(
    (element: HTMLButtonElement, pressed: boolean) => {
      if (!reducedMotion) void animateTaskButton(animate, element, pressed)
    },
    [animate, reducedMotion],
  )

  return {
    activeIndex,
    playback: reducedMotion ? ('reduced' as const) : playback,
    pressTask,
    previousIndex,
    scope,
    selectTask,
    transitionStart,
  }
}
