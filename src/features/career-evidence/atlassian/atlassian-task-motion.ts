import type { useAnimate } from 'motion/react-mini'

import { motionDuration, motionEase } from '@/shared/motion/motion.constants'

export interface VisualState {
  readonly opacity: number
  readonly transform: string
}

export interface TransitionStart {
  readonly incoming?: VisualState
  readonly indicator: VisualState
  readonly outgoing: VisualState
}

export const visibleLayer = { opacity: 1, transform: 'translate3d(0, 0, 0)' } as const
export const hiddenLayer = { opacity: 0, transform: 'translate3d(0, 4px, 0)' } as const

export const taskTransform = (index: number) => `translate3d(${index * 100}%, 0, 0)`

export function readVisualState(element: Element): VisualState {
  const style = window.getComputedStyle(element)
  return {
    opacity: Number.parseFloat(style.opacity),
    transform: style.transform === 'none' ? visibleLayer.transform : style.transform,
  }
}

type ScopedAnimate = ReturnType<typeof useAnimate>[1]

interface TaskMotionScope {
  readonly current: HTMLDivElement | null
}

export function cancelTaskMotion(root: Element) {
  root.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
}

export function cancelScopedTaskMotion(scope: TaskMotionScope) {
  if (scope.current) cancelTaskMotion(scope.current)
}

export function getTaskMotionRoot(scope: TaskMotionScope) {
  return scope.current
}

export function snapshotTaskMotion(root: Element, nextTaskId: string) {
  const indicator = root.querySelector<HTMLElement>('[data-loop-indicator]')
  const activeLayer = root.querySelector<HTMLElement>('[data-task-layer="active"]')
  const incomingLayer = [...root.querySelectorAll<HTMLElement>('[data-task-layer]')].find(
    (layer) => layer.dataset.taskId === nextTaskId,
  )
  const snapshot =
    indicator && activeLayer
      ? {
          incoming: incomingLayer ? readVisualState(incomingLayer) : undefined,
          indicator: readVisualState(indicator),
          outgoing: readVisualState(activeLayer),
        }
      : null
  cancelTaskMotion(root)
  return snapshot
}

export function snapshotScopedTaskMotion(scope: TaskMotionScope, nextTaskId: string) {
  return scope.current ? snapshotTaskMotion(scope.current, nextTaskId) : null
}

export function animateTaskButton(
  animate: ScopedAnimate,
  element: HTMLButtonElement,
  pressed: boolean,
) {
  const currentTransform = readVisualState(element).transform
  element.getAnimations().forEach((animation) => animation.cancel())
  return animate(
    element,
    {
      transform: [
        currentTransform,
        pressed ? 'translate3d(0, 0, 0) scale(0.97)' : 'translate3d(0, 0, 0) scale(1)',
      ],
    },
    {
      duration: pressed ? motionDuration.press : motionDuration.release,
      ease: motionEase.out,
    },
  )
}

interface TaskTransitionOptions {
  readonly animate: ScopedAnimate
  readonly isCurrent: () => boolean
  readonly nextIndex: number
  readonly root: Element
  readonly start: TransitionStart
  readonly wrap: boolean
}

export async function animateTaskTransition({
  animate,
  isCurrent,
  nextIndex,
  root,
  start,
  wrap,
}: TaskTransitionOptions) {
  const indicator = root.querySelector<HTMLElement>('[data-loop-indicator]')
  const oldLayer = root.querySelector<HTMLElement>('[data-task-layer="previous"]')
  const newLayer = root.querySelector<HTMLElement>('[data-task-layer="active"]')
  if (!indicator || !newLayer) return

  const incoming = start.incoming ?? hiddenLayer
  const oldMotion = oldLayer
    ? animate(
        oldLayer,
        {
          opacity: [start.outgoing.opacity, 0],
          transform: [start.outgoing.transform, 'translate3d(0, -4px, 0)'],
        },
        { duration: motionDuration.exit, ease: motionEase.out },
      )
    : Promise.resolve()
  const newMotion = animate(
    newLayer,
    {
      opacity: [incoming.opacity, 1],
      transform: [incoming.transform, visibleLayer.transform],
    },
    { duration: motionDuration.enter, ease: motionEase.out },
  )
  const indicatorMotion = wrap
    ? (async () => {
        await animate(
          indicator,
          {
            opacity: [start.indicator.opacity, 0],
            transform: [start.indicator.transform, 'translate3d(300%, 0, 0)'],
          },
          { duration: motionDuration.exit, ease: motionEase.out },
        )
        if (!isCurrent()) return
        indicator.style.opacity = '0'
        indicator.style.transform = 'translate3d(-100%, 0, 0)'
        await animate(
          indicator,
          {
            opacity: [0, 1],
            transform: ['translate3d(-100%, 0, 0)', taskTransform(nextIndex)],
          },
          { duration: motionDuration.enter, ease: motionEase.out },
        )
      })()
    : animate(
        indicator,
        {
          opacity: [start.indicator.opacity, 1],
          transform: [start.indicator.transform, taskTransform(nextIndex)],
        },
        { duration: motionDuration.move, ease: motionEase.inOut },
      )

  await Promise.allSettled([oldMotion, newMotion, indicatorMotion])
}
