import { atlassianStory } from '@/content/career/atlassian'

import { AtlassianTaskLoop } from './atlassian-task-loop.client'
import styles from './atlassian-views.module.css'

interface SystemViewProps {
  readonly isActive: boolean
  readonly suppressMotion: boolean
}

export function InterfaceView() {
  const view = atlassianStory.views[0]
  const signals = view.summary.split(' · ')

  return (
    <div className={styles.interfaceView}>
      <div className={styles.search}>
        <span aria-hidden="true">⌕</span>
        <span>{view.summary}</span>
      </div>
      <div className={styles.signalGrid}>
        {signals.map((signal, index) => (
          <div className={styles.signal} key={signal}>
            <span>0{index + 1}</span>
            <strong>{signal}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SystemView({ isActive, suppressMotion }: SystemViewProps) {
  const specialistIds = new Set(['identify', 'verify', 'rate'])
  const specialists = atlassianStory.pipeline.filter((step) => specialistIds.has(step.id))
  const surrounding = atlassianStory.pipeline.filter((step) => !specialistIds.has(step.id))
  const source = surrounding[0]
  const coordinator = surrounding[1]
  const output = surrounding.at(-1)

  return (
    <div className={styles.systemView}>
      {source ? (
        <div className={styles.sourceNode}>
          <span>{source.index}</span>
          <strong>{source.label}</strong>
        </div>
      ) : null}
      <span aria-hidden="true" className={styles.flowArrow}>
        →
      </span>
      {coordinator ? (
        <div className={styles.coordinatorNode}>
          <span>{coordinator.label}</span>
          <strong>
            {'description' in coordinator ? coordinator.description : coordinator.label}
          </strong>
        </div>
      ) : null}
      <span aria-hidden="true" className={styles.flowArrow}>
        →
      </span>
      <div className={styles.loopSlot}>
        <AtlassianTaskLoop
          isActive={isActive}
          loopLabel={atlassianStory.loopLabel}
          suppressMotion={suppressMotion}
          tasks={specialists}
        />
      </div>
      <span aria-hidden="true" className={styles.flowArrow}>
        →
      </span>
      {output ? (
        <div className={styles.outputNode}>
          <span>{output.index}</span>
          <strong>{output.label}</strong>
        </div>
      ) : null}
    </div>
  )
}

export function OutcomeView() {
  return (
    <div className={styles.outcomeView}>
      {atlassianStory.outcomes.map((outcome) => (
        <div className={styles.result} key={outcome.label}>
          <strong>{outcome.value}</strong>
          <span>{outcome.label}</span>
        </div>
      ))}
    </div>
  )
}
