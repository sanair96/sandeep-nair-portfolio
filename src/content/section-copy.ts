import type { SectionCopy } from './content.types'

export const sectionCopy = {
  navigation: {
    work: 'Work',
    leadership: 'Leadership',
    projects: 'Projects',
    resume: 'Résumé ↗',
    ariaLabel: 'Primary navigation',
  },
  hero: {
    reviewWork: 'Review my work',
    downloadResume: 'Download résumé ↗',
    quickIntroLabel: 'A quick intro / 01',
  },
  work: {
    label: '01 / Work',
    heading: 'Three projects I’d like to tell you about.',
    intro: 'For each one, here’s the problem, what I took on, and what changed.',
  },
  leadership: {
    label: '02 / How I work',
    heading: 'A few things I’ve learned about leading frontend work.',
    intro:
      'I usually start with the workflow, then follow the problem into the API, the data, and the delivery plan. I also try to make frontend work easier for the rest of the team to pick up.',
  },
  career: {
    heading: 'Career progression / 2018—2026',
    resumeLink: 'Full chronology in résumé ↗',
    timelineAriaLabel: 'Career progression',
  },
  projects: {
    label: '03 / Outside work',
    heading: 'A couple of things I’m building outside work.',
    intro:
      'I use personal projects to try ideas around automation, human review, and developer tooling.',
    pipelineLabel: 'From upload to human review',
    reviewLabel: 'Human review when needed',
    pipelineAriaSuffix: 'processing pipeline',
    architectureAriaSuffix: 'architecture',
    technologyAriaLabel: 'Technology used',
  },
  contact: {
    label: '04 / Say hello',
    heading: 'If this sounds like the kind of work your team needs, I’d be glad to talk.',
    intro:
      'I’m looking for senior frontend or frontend lead roles where I can stay close to the product, help shape the architecture, and still write the code.',
    email: 'Email me',
    linksAriaLabel: 'Contact and profile links',
  },
  footer: {
    name: 'Sandeep A Nair',
    note: 'Sandeep A Nair · 2026',
  },
} as const satisfies SectionCopy
