import type { PersonalProject } from '../content.types'

export const queansProject = {
  id: 'queans',
  eyebrow: 'Personal project · Next.js / Temporal / OCR',
  title: 'Queans started with a question: what should happen when OCR isn’t sure?',
  body: 'I’m building Queans to turn question papers into structured data without hiding uncertain results. It runs each document through OCR and extraction, tracks confidence, and routes anything questionable to a human review step. The operator UI is built with Next.js, while Temporal handles the longer-running workflow.',
  technologies: ['Next.js', 'Temporal', 'OCR'],
  steps: [
    {
      id: 'upload',
      index: '01',
      label: 'Upload',
    },
    {
      id: 'ocr',
      index: '02',
      label: 'OCR',
    },
    {
      id: 'extract',
      index: '03',
      label: 'Extract',
    },
    {
      id: 'confidence',
      index: '04',
      label: 'Confidence',
    },
    {
      id: 'human-review',
      index: '05',
      label: 'Human review',
    },
  ],
  link: {
    label: 'See how it works ↗',
    href: 'https://github.com/sanair96/queans',
    external: true,
  },
} as const satisfies PersonalProject
