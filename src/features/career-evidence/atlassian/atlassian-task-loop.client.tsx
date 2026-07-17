'use client'

import { useId } from 'react'

import type { DiagramStep } from '@/content/content.types'

import { AtlassianTaskLayer } from './atlassian-task-layer'
import { taskTransform } from './atlassian-task-motion'
import styles from './atlassian-task-loop.module.css'
import { useAtlassianTaskMotion } from './use-atlassian-task-motion.client'

interface AtlassianTaskLoopProps {
  readonly isActive: boolean
  readonly loopLabel: string
  readonly suppressMotion: boolean
  readonly tasks: readonly DiagramStep[]
}

export function AtlassianTaskLoop({
  isActive,
  loopLabel,
  suppressMotion,
  tasks,
}: AtlassianTaskLoopProps) {
  const id = useId()
  const { activeIndex, playback, pressTask, previousIndex, scope, selectTask, transitionStart } =
    useAtlassianTaskMotion({ isActive, suppressMotion, tasks })

  if (tasks.length === 0) return null
  const activeTask = tasks[activeIndex] ?? tasks[0]
  const previousTask = previousIndex === null ? null : tasks[previousIndex]

  return (
    <div
      aria-label="Identify, verify, and rate repeat as a loop"
      className={styles.loop}
      data-active-task={activeTask.id}
      data-playback={playback}
      ref={scope}
    >
      <div aria-label="Choose a workflow task" className={styles.taskRail} role="group">
        <span
          aria-hidden="true"
          className={styles.indicator}
          data-loop-indicator
          style={
            transitionStart?.indicator ?? {
              opacity: 1,
              transform: taskTransform(activeIndex),
            }
          }
        />
        {tasks.map((task, index) => (
          <button
            aria-controls={`${id}-focus`}
            aria-pressed={index === activeIndex}
            className={styles.taskButton}
            id={`${id}-${task.id}`}
            key={task.id}
            onClick={(event) => selectTask(event.detail, index)}
            onPointerCancel={(event) => pressTask(event.currentTarget, false)}
            onPointerDown={(event) => pressTask(event.currentTarget, true)}
            onPointerLeave={(event) => pressTask(event.currentTarget, false)}
            onPointerUp={(event) => pressTask(event.currentTarget, false)}
            type="button"
          >
            {task.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`${id}-${activeTask.id}`}
        className={styles.focusCard}
        id={`${id}-focus`}
        role="region"
      >
        {previousTask ? (
          <AtlassianTaskLayer
            initialStyle={transitionStart?.outgoing}
            state="previous"
            task={previousTask}
          />
        ) : null}
        <AtlassianTaskLayer
          entering={previousTask !== null}
          initialStyle={transitionStart?.incoming}
          state="active"
          task={activeTask}
        />
      </div>

      <p className={styles.loopLabel}>
        <span aria-hidden="true">↻</span>
        {loopLabel}
      </p>
    </div>
  )
}
