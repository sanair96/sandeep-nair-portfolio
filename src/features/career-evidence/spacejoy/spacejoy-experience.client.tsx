'use client'

import { useAnimate } from 'motion/react-mini'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { spacejoyStory } from '@/content/career/spacejoy'
import { motionDuration, motionEase } from '@/shared/motion/motion.constants'
import { useReducedMotion } from '@/shared/motion/use-reduced-motion.client'

import actionStyles from './spacejoy-actions.module.css'
import styles from './spacejoy-case.module.css'
import { SpacejoyPoster } from './spacejoy-poster.client'
import surfaceStyles from './spacejoy-surfaces.module.css'
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

export function SpacejoyExperience() {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const viewerAction = useRef<HTMLButtonElement>(null)
  const failureInFlight = useRef(false)
  const restartInFlight = useRef(false)
  const restoreActionFocus = useRef(false)
  const viewerSession = useRef(0)
  const webGL = useSyncExternalStore(noWebGLSubscription, getWebGLSnapshot, getServerWebGLSnapshot)
  const reducedMotion = useReducedMotion()
  const [viewerReady, setViewerReady] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const { hasApproached, viewerVisible } = useSpacejoyVisibility(scope)
  const viewerPaused = paused || !viewerVisible

  async function restartViewer() {
    if (restartInFlight.current) return
    restartInFlight.current = true
    restoreActionFocus.current = true
    viewerSession.current += 1
    failureInFlight.current = false

    if (failed) {
      try {
        const { clearSpacejoyModelCache } = await import('./spacejoy-viewer.client')
        clearSpacejoyModelCache()
      } finally {
        restartInFlight.current = false
      }
    }

    setFailed(false)
    setViewerReady(false)
    setBuildComplete(false)
    setPaused(false)
    setRetryKey((key) => key + 1)
    restartInFlight.current = false
  }

  async function handleViewerFailure(session: number) {
    if (session !== viewerSession.current) return
    if (failureInFlight.current) return
    failureInFlight.current = true

    if (!reducedMotion) {
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

  const activeViewerSession = viewerSession.current
  const viewerAvailable = webGL === true && !reducedMotion
  const viewerActive = viewerAvailable && !failed && hasApproached
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
      setBuildComplete(false)
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
  }, [animate, failed, scope, viewerActive, viewerReady])

  useEffect(() => {
    if (!viewerReady || !restoreActionFocus.current) return
    restoreActionFocus.current = false
    viewerAction.current?.focus()
  }, [viewerReady])

  return (
    <div className={styles.experience} ref={scope}>
      <div className={styles.toolbar}>
        <p className={styles.viewerNote}>{spacejoyStory.viewer.label}</p>
      </div>

      <div aria-label={spacejoyStory.viewer.ariaLabel} className={styles.viewerShell} role="region">
        <SpacejoyPoster
          label={spacejoyStory.viewer.posterLabel}
          posterSrc={spacejoyStory.viewer.posterSrc}
          summary={spacejoyStory.viewer.posterSummary}
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
              data-activation="automatic"
              data-build={buildComplete ? 'complete' : 'assembling'}
              data-ready={viewerReady}
              data-rendering={viewerPaused ? 'paused' : 'active'}
              data-viewer-layer
            >
              <DynamicViewer
                onError={() => void handleViewerFailure(activeViewerSession)}
                onReady={() => setViewerReady(true)}
                onSequenceComplete={() => setBuildComplete(true)}
                paused={viewerPaused}
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
        {failed ? (
          <button
            className={actionStyles.primaryAction}
            disabled={!viewerAvailable}
            onClick={() => void restartViewer()}
            ref={viewerAction}
            type="button"
          >
            Retry 3D
          </button>
        ) : viewerActive ? (
          <button
            className={actionStyles.secondaryAction}
            disabled={!viewerReady}
            onClick={() => (buildComplete ? void restartViewer() : setPaused((value) => !value))}
            ref={viewerAction}
            type="button"
          >
            {!viewerReady
              ? 'Loading 3D…'
              : buildComplete
                ? 'Replay room build'
                : paused
                  ? 'Resume room build'
                  : spacejoyStory.viewer.pauseLabel}
          </button>
        ) : null}
        <p aria-live="polite" className={styles.status}>
          {failed
            ? 'The model could not load. The poster remains available.'
            : !viewerActive
              ? webGL === null
                ? 'Preparing the interactive room…'
                : fallbackReason
              : !viewerReady
                ? 'Loading the room model…'
                : buildComplete
                  ? 'Room complete. Drag to orbit or replay the build.'
                  : paused
                    ? 'Room build paused.'
                    : 'Building the room, one object at a time…'}
        </p>
      </div>

      <div className={styles.viewerDescription}>
        <p className={styles.caption}>{spacejoyStory.caption}</p>
        <p className={styles.interactionNote}>{spacejoyStory.interactionNote}</p>
      </div>

      <section aria-labelledby="spacejoy-surfaces-title" className={surfaceStyles.surfaces}>
        <div className={surfaceStyles.header}>
          <p className={surfaceStyles.eyebrow}>{spacejoyStory.surfacesLabel}</p>
          <h4 className={surfaceStyles.title} id="spacejoy-surfaces-title">
            {spacejoyStory.surfacesTitle}
          </h4>
        </div>
        <ol className={surfaceStyles.grid}>
          {spacejoyStory.surfaces.map((surface, index) => (
            <li className={surfaceStyles.item} key={surface.id}>
              <span aria-hidden="true" className={surfaceStyles.index}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className={surfaceStyles.label}>{surface.label}</p>
                <p className={surfaceStyles.summary}>{surface.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
