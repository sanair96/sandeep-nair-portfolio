'use client'

import { useAnimate } from 'motion/react-mini'
import dynamic from 'next/dynamic'
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'

import { spacejoyStory } from '@/content/career/spacejoy'
import { motionDuration, motionEase } from '@/shared/motion/motion.constants'
import { useReducedMotion } from '@/shared/motion/use-reduced-motion.client'

import actionStyles from './spacejoy-actions.module.css'
import styles from './spacejoy-case.module.css'
import { SpacejoyPoster } from './spacejoy-poster.client'
import { supportsWebGL } from './spacejoy-webgl'
import { useSpacejoyVisibility } from './use-spacejoy-visibility.client'
import { ViewerErrorBoundary } from './viewer-error-boundary.client'

const DynamicViewer = dynamic(() => import('./spacejoy-viewer.client'), {
  loading: () => <div className={styles.loading}>Loading room model…</div>,
  ssr: false,
})

const noWebGLSubscription = () => () => {}
const getServerWebGLSnapshot = () => null
const getWebGLSnapshot = () => supportsWebGL()
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

type ActivationModality = 'keyboard' | 'pointer'

export function SpacejoyExperience() {
  const id = useId()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const failureInFlight = useRef(false)
  const viewerSession = useRef(0)
  const [perspective, setPerspective] = useState(1)
  const webGL = useSyncExternalStore(noWebGLSubscription, getWebGLSnapshot, getServerWebGLSnapshot)
  const reducedMotion = useReducedMotion()
  const [viewerEnabled, setViewerEnabled] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [activationModality, setActivationModality] = useState<ActivationModality>('keyboard')
  const viewerVisible = useSpacejoyVisibility(scope)
  const viewerPaused = paused || !viewerVisible

  function selectPerspective(index: number) {
    setPerspective(index)
    tabs.current[index]?.focus()
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') selectPerspective((index + 1) % 3)
    else if (event.key === 'ArrowLeft') selectPerspective((index + 2) % 3)
    else if (event.key === 'Home') selectPerspective(0)
    else if (event.key === 'End') selectPerspective(2)
    else return
    event.preventDefault()
  }

  function startViewer(event: React.MouseEvent<HTMLButtonElement>) {
    viewerSession.current += 1
    setActivationModality(event.detail === 0 ? 'keyboard' : 'pointer')
    failureInFlight.current = false
    setFailed(false)
    setViewerReady(false)
    setPaused(false)
    setViewerEnabled(true)
  }

  function retryViewer(event: React.MouseEvent<HTMLButtonElement>) {
    setRetryKey((key) => key + 1)
    startViewer(event)
  }

  async function handleViewerFailure(session: number) {
    if (session !== viewerSession.current) return
    if (failureInFlight.current) return
    failureInFlight.current = true

    if (!reducedMotion && activationModality === 'pointer') {
      const viewer = scope.current?.querySelector<HTMLElement>('[data-viewer-layer]')
      const loading = scope.current?.querySelector<HTMLElement>('[data-viewer-loading]')
      const exits = [viewer, loading]
        .filter((element): element is HTMLElement => element !== null && element !== undefined)
        .map((element) =>
          animate(element, { opacity: 0 }, { duration: 0.16, ease: motionEase.out }),
        )
      await Promise.allSettled(exits)
    }

    if (session !== viewerSession.current) return
    setViewerReady(false)
    setFailed(true)
    failureInFlight.current = false
  }

  const activePerspective = spacejoyStory.perspectives[perspective]
  const activeViewerSession = viewerSession.current
  const canStart = webGL === true && !reducedMotion
  const viewerActive = viewerEnabled && !reducedMotion
  const fallbackReason = reducedMotion
    ? 'Static view shown because reduced motion is enabled.'
    : webGL === false
      ? 'Static view shown because WebGL is unavailable.'
      : spacejoyStory.viewer.fallbackCopy

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    const handleChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return

      viewerSession.current += 1
      scope.current?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
      const viewer = scope.current?.querySelector<HTMLElement>('[data-viewer-layer]')
      const loading = scope.current?.querySelector<HTMLElement>('[data-viewer-loading]')
      if (viewer) viewer.style.opacity = '0'
      if (loading) loading.style.opacity = '0'

      failureInFlight.current = false
      setViewerReady(false)
      setViewerEnabled(false)
      setPaused(false)
      setFailed(false)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [scope])

  useEffect(() => {
    if (!viewerActive || failed) return
    const viewer = scope.current?.querySelector<HTMLElement>('[data-viewer-layer]')
    const loading = scope.current?.querySelector<HTMLElement>('[data-viewer-loading]')
    if (!viewer || !viewerReady) return

    if (activationModality === 'keyboard' || reducedMotion) {
      scope.current?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
      viewer.style.opacity = '1'
      viewer.style.transform = 'scale3d(1, 1, 1)'
      if (loading) loading.style.opacity = '0'
      return
    }

    void animate(
      viewer,
      {
        opacity: [0, 1],
        transform: ['scale3d(0.99, 0.99, 1)', 'scale3d(1, 1, 1)'],
      },
      { duration: motionDuration.enter, ease: motionEase.out },
    )
    if (loading) {
      void animate(
        loading,
        { opacity: [1, 0] },
        { duration: motionDuration.exit, ease: motionEase.out },
      )
    }
  }, [activationModality, animate, failed, reducedMotion, scope, viewerActive, viewerReady])

  return (
    <div className={styles.experience} ref={scope}>
      <div className={styles.toolbar}>
        <div aria-label="Spacejoy role perspective" className={styles.perspectives} role="tablist">
          {spacejoyStory.perspectives.map((item, index) => (
            <button
              aria-controls={`${id}-perspective`}
              aria-selected={index === perspective}
              className={styles.perspective}
              id={`${id}-tab-${item.id}`}
              key={item.id}
              onClick={() => setPerspective(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
              ref={(node) => {
                tabs.current[index] = node
              }}
              role="tab"
              tabIndex={index === perspective ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.viewerNote}>{spacejoyStory.viewer.label}</p>
      </div>

      <div
        aria-labelledby={`${id}-tab-${activePerspective.id}`}
        className={styles.viewerShell}
        id={`${id}-perspective`}
        role="tabpanel"
        tabIndex={0}
      >
        <SpacejoyPoster
          label={activePerspective.label}
          posterSrc={spacejoyStory.viewer.posterSrc}
          summary={activePerspective.summary}
        />

        {viewerActive && !failed ? (
          <ViewerErrorBoundary
            fallback={<div className={styles.posterError}>{fallbackReason}</div>}
            key={retryKey}
            onError={() => void handleViewerFailure(activeViewerSession)}
          >
            <div
              aria-hidden={!viewerReady}
              className={styles.viewerLayer}
              data-activation={activationModality}
              data-ready={viewerReady}
              data-rendering={viewerPaused ? 'paused' : 'active'}
              data-viewer-layer
            >
              <DynamicViewer
                onError={() => void handleViewerFailure(activeViewerSession)}
                onReady={() => setViewerReady(true)}
                paused={viewerPaused}
                perspective={perspective}
              />
            </div>
          </ViewerErrorBoundary>
        ) : null}
        {viewerActive && !failed ? (
          <div
            aria-hidden={viewerReady}
            className={styles.viewerLoading}
            data-ready={viewerReady}
            data-viewer-loading
          >
            Loading room model…
          </div>
        ) : null}
      </div>

      <div className={styles.actions}>
        {!viewerActive || failed ? (
          <button
            className={actionStyles.primaryAction}
            disabled={!canStart}
            onClick={(event) => (failed ? retryViewer(event) : startViewer(event))}
            type="button"
          >
            {failed ? 'Retry 3D' : spacejoyStory.viewer.actionLabel}
          </button>
        ) : (
          <button
            className={actionStyles.secondaryAction}
            disabled={!viewerReady}
            onClick={() => setPaused((value) => !value)}
            type="button"
          >
            {viewerReady ? (paused ? 'Resume 3D' : 'Pause 3D') : 'Loading 3D…'}
          </button>
        )}
        <p aria-live="polite" className={styles.status}>
          {failed
            ? 'The model could not load. The poster remains available.'
            : !viewerActive
              ? fallbackReason
              : !viewerReady
                ? 'Loading the room model…'
                : paused
                  ? '3D view paused.'
                  : '3D view ready. Drag to orbit.'}
        </p>
      </div>

      <p className={styles.caption}>{spacejoyStory.caption}</p>
      <p className={styles.interactionNote}>{spacejoyStory.interactionNote}</p>
    </div>
  )
}
