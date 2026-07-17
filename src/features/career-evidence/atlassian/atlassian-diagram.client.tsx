'use client'

import { useId, useRef, useState } from 'react'

import { atlassianStory } from '@/content/career/atlassian'

import styles from './atlassian-diagram.module.css'
import { InterfaceView, OutcomeView, SystemView } from './atlassian-views'

type InteractionModality = 'initial' | 'keyboard' | 'pointer'

interface EvidenceViewProps {
  readonly index: number
  readonly isActive: boolean
  readonly modality: InteractionModality
}

function EvidenceView({ index, isActive, modality }: EvidenceViewProps) {
  if (index === 0) return <InterfaceView />
  if (index === 1)
    return <SystemView isActive={isActive} suppressMotion={modality === 'keyboard'} />
  return <OutcomeView />
}

export function AtlassianDiagram() {
  const id = useId()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(1)
  const [interactionModality, setInteractionModality] = useState<InteractionModality>('initial')

  function selectTab(index: number, modality: InteractionModality) {
    setInteractionModality(modality)
    setActiveIndex(index)
    if (modality === 'keyboard') tabs.current[index]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') selectTab((index + 1) % atlassianStory.views.length, 'keyboard')
    else if (event.key === 'ArrowLeft')
      selectTab((index - 1 + atlassianStory.views.length) % atlassianStory.views.length, 'keyboard')
    else if (event.key === 'Home') selectTab(0, 'keyboard')
    else if (event.key === 'End') selectTab(atlassianStory.views.length - 1, 'keyboard')
    else return
    event.preventDefault()
  }

  return (
    <div className={styles.visual}>
      <div className={styles.toolbar}>
        <div aria-label="Atlassian evidence view" className={styles.tabs} role="tablist">
          {atlassianStory.views.map((view, index) => (
            <button
              aria-controls={`${id}-panel-${view.id}`}
              aria-selected={index === activeIndex}
              className={styles.tab}
              id={`${id}-tab-${view.id}`}
              key={view.id}
              onClick={(event) => selectTab(index, event.detail === 0 ? 'keyboard' : 'pointer')}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabs.current[index] = node
              }}
              role="tab"
              tabIndex={index === activeIndex ? 0 : -1}
              type="button"
            >
              {view.label}
            </button>
          ))}
        </div>
        <p>Recreated system model</p>
      </div>

      {atlassianStory.views.map((view, index) => (
        <div
          aria-labelledby={`${id}-tab-${view.id}`}
          className={styles.panel}
          hidden={index !== activeIndex}
          id={`${id}-panel-${view.id}`}
          key={view.id}
          role="tabpanel"
          tabIndex={index === activeIndex ? 0 : -1}
        >
          <EvidenceView
            index={index}
            isActive={index === activeIndex}
            modality={interactionModality}
          />
        </div>
      ))}

      <div className={styles.staticFallback}>
        {atlassianStory.views.map((view) => (
          <div className={styles.staticState} key={view.id}>
            <strong>{view.label}</strong>
            <span>{view.summary}</span>
          </div>
        ))}
      </div>
      <noscript>
        <div className={styles.noScriptFallback}>
          {atlassianStory.views.map((view) => (
            <p key={view.id}>
              <strong>{view.label}:</strong> {view.summary}
            </p>
          ))}
        </div>
      </noscript>

      <p className={styles.caption}>{atlassianStory.caption}</p>
      <p className={styles.accessibilityNote}>{atlassianStory.accessibilityNote}</p>
    </div>
  )
}
