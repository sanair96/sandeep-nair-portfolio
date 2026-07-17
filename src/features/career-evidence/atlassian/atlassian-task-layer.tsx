import type { CSSProperties } from 'react'

import type { DiagramStep } from '@/content/content.types'

import styles from './atlassian-task-loop.module.css'

interface AtlassianTaskLayerProps {
  readonly entering?: boolean
  readonly initialStyle?: CSSProperties
  readonly state: 'active' | 'previous'
  readonly task: DiagramStep
}

export function AtlassianTaskLayer({
  entering = false,
  initialStyle,
  state,
  task,
}: AtlassianTaskLayerProps) {
  return (
    <div
      aria-hidden={state === 'previous' ? true : undefined}
      className={styles.taskLayer}
      data-entering={entering ? 'true' : undefined}
      data-task-id={task.id}
      data-task-layer={state}
      style={initialStyle}
    >
      <span>{task.index} / Workflow task</span>
      <strong>{task.label}</strong>
      <p>{task.description ?? task.label}</p>
    </div>
  )
}
