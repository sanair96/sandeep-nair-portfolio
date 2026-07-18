export interface ContentLink {
  readonly label: string
  readonly href: string
  readonly external: boolean
  readonly download?: boolean
}

export interface ProfileEvidenceItem {
  readonly index: string
  readonly audience: string
  readonly title: string
  readonly meta: string
}

export interface Profile {
  readonly name: string
  readonly initials: string
  readonly role: string
  readonly eyebrow: string
  readonly headline: string
  readonly intro: string
  readonly location: string
  readonly focus: readonly string[]
  readonly quickIntro: string
  readonly quickIntroRoute: string
  readonly evidenceItems: readonly ProfileEvidenceItem[]
}

export interface CareerFact {
  readonly value: string
  readonly label: string
}

export type CareerFactKey =
  'experience' | 'annualSavings' | 'operatorTime' | 'platformLaunch' | 'mobileLaunch'

export interface OutcomeMetric {
  readonly value: string
  readonly label: string
  readonly factKey?: CareerFactKey
}

export interface EvidenceState {
  readonly id: string
  readonly label: string
  readonly summary: string
}

export interface DiagramStep {
  readonly id: string
  readonly index: string
  readonly label: string
  readonly description?: string
}

export interface CareerStoryBase {
  readonly id: string
  readonly company: string
  readonly period: string
  readonly role: string
  readonly title: string
  readonly body: string
  readonly outcomes: readonly OutcomeMetric[]
}

export interface AtlassianStory extends CareerStoryBase {
  readonly views: readonly EvidenceState[]
  readonly pipeline: readonly DiagramStep[]
  readonly loopLabel: string
  readonly caption: string
  readonly accessibilityNote: string
}

export interface WorkflowState {
  readonly label: string
  readonly summary: string
  readonly steps: readonly DiagramStep[]
}

export interface AmazonStory extends CareerStoryBase {
  readonly before: WorkflowState
  readonly after: WorkflowState
  readonly caption: string
  readonly reducedMotionNote: string
}

export interface SpacejoyViewer {
  readonly label: string
  readonly posterSrc: string
  readonly modelSrc: string
  readonly pauseLabel: string
  readonly fallbackCopy: string
  readonly errorCopy: string
}

export interface SpacejoyStory extends CareerStoryBase {
  readonly perspectives: readonly EvidenceState[]
  readonly viewer: SpacejoyViewer
  readonly caption: string
  readonly interactionNote: string
}

export interface LeadershipPrinciple {
  readonly index: string
  readonly title: string
  readonly body: string
}

export interface CareerTimelineItem {
  readonly period: string
  readonly company: string
  readonly role: string
  readonly current?: boolean
}

export interface PersonalProject {
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly body: string
  readonly technologies: readonly string[]
  readonly steps: readonly DiagramStep[]
  readonly link?: ContentLink
}

export interface SectionHeadingCopy {
  readonly label: string
  readonly heading: string
  readonly intro: string
}

export interface SectionCopy {
  readonly navigation: {
    readonly work: string
    readonly leadership: string
    readonly projects: string
    readonly resume: string
    readonly ariaLabel: string
  }
  readonly hero: {
    readonly reviewWork: string
    readonly downloadResume: string
    readonly quickIntroLabel: string
  }
  readonly work: SectionHeadingCopy
  readonly leadership: SectionHeadingCopy
  readonly career: {
    readonly heading: string
    readonly resumeLink: string
    readonly timelineAriaLabel: string
  }
  readonly projects: SectionHeadingCopy & {
    readonly pipelineLabel: string
    readonly reviewLabel: string
    readonly pipelineAriaSuffix: string
    readonly architectureAriaSuffix: string
    readonly technologyAriaLabel: string
  }
  readonly contact: SectionHeadingCopy & {
    readonly email: string
    readonly linksAriaLabel: string
  }
  readonly footer: {
    readonly name: string
    readonly note: string
  }
}
