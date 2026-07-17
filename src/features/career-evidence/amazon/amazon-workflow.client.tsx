'use client'

import { useId, useRef, useState } from 'react'

import { careerFacts } from '@/content/career-facts'
import { amazonStory } from '@/content/career/amazon'

import styles from './amazon-workflow.module.css'

type WorkflowState = {
  readonly label: string
  readonly summary: string
  readonly steps: readonly {
    readonly id: string
    readonly index: string
    readonly label: string
  }[]
}

type InteractionModality = 'keyboard' | 'pointer'

function WorkflowPanel({ state, tone }: { state: WorkflowState; tone: 'before' | 'after' }) {
  return (
    <div className={tone === 'after' ? styles.afterPanel : styles.beforePanel}>
      <div className={styles.panelHeader}>
        <p>{state.label}</p>
        {tone === 'after' ? <strong>−{careerFacts.operatorTime.value} operator time</strong> : null}
      </div>
      <h4>{state.summary}</h4>
      <ol className={styles.steps}>
        {state.steps.map((step) => (
          <li key={step.id}>
            <span>{step.index}</span>
            <strong>{step.label}</strong>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function AmazonWorkflow() {
  const id = useId()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(1)
  const [interactionModality, setInteractionModality] = useState<InteractionModality>('keyboard')
  const states = [amazonStory.before, amazonStory.after] as const

  function selectTab(index: number, modality: InteractionModality) {
    setInteractionModality(modality)
    setActiveIndex(index)
    if (modality === 'keyboard') tabs.current[index]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      selectTab((index + 1) % states.length, 'keyboard')
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      selectTab((index - 1 + states.length) % states.length, 'keyboard')
    else if (event.key === 'Home') selectTab(0, 'keyboard')
    else if (event.key === 'End') selectTab(states.length - 1, 'keyboard')
    else return
    event.preventDefault()
  }

  return (
    <div className={styles.visual}>
      <div className={styles.toolbar}>
        <div aria-label="Amazon workflow state" className={styles.tabs} role="tablist">
          {states.map((state, index) => (
            <button
              aria-controls={`${id}-panel-${index}`}
              aria-selected={activeIndex === index}
              className={styles.tab}
              id={`${id}-tab-${index}`}
              key={state.label}
              onClick={(event) => selectTab(index, event.detail === 0 ? 'keyboard' : 'pointer')}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabs.current[index] = node
              }}
              role="tab"
              tabIndex={activeIndex === index ? 0 : -1}
              type="button"
            >
              {index === 0 ? 'Before' : 'After'}
            </button>
          ))}
        </div>
        <p>Recreated workflow</p>
      </div>

      <div className={styles.motionPanels} data-animate={interactionModality === 'pointer'}>
        {states.map((state, index) => (
          <div
            aria-labelledby={`${id}-tab-${index}`}
            className={activeIndex === index ? styles.activePanel : styles.inactivePanel}
            id={`${id}-panel-${index}`}
            key={state.label}
            role="tabpanel"
            tabIndex={0}
          >
            <WorkflowPanel state={state} tone={index === 0 ? 'before' : 'after'} />
          </div>
        ))}
      </div>

      <div className={styles.staticPanels}>
        <WorkflowPanel state={states[0]} tone="before" />
        <WorkflowPanel state={states[1]} tone="after" />
      </div>
      <noscript>
        <div className={styles.noScriptPanels}>
          <WorkflowPanel state={states[0]} tone="before" />
          <WorkflowPanel state={states[1]} tone="after" />
        </div>
      </noscript>

      <p className={styles.caption}>{amazonStory.caption}</p>
      <p className={styles.reducedMotionNote}>{amazonStory.reducedMotionNote}</p>
    </div>
  )
}
