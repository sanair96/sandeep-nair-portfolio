import { careerFacts } from '../career-facts'
import type { AmazonStory } from '../content.types'

export const amazonStory = {
  id: 'amazon',
  company: 'Amazon',
  period: '2022—2024',
  role: 'Frontend Engineer II',
  title: 'At Amazon, I redesigned a critical tool around the way operators actually worked.',
  body: 'The X-ray pipeline tool depended on a system that was being retired. I led the frontend redesign, worked through its API contracts and data flow, and partnered with the ML team to make its output more useful to operators. The new workflow reduced operator time by 50%.',
  outcomes: [
    {
      value: careerFacts.operatorTime.value,
      label: 'Reduction in operator time',
      factKey: 'operatorTime',
    },
  ],
  before: {
    label: 'Before / deprecated system',
    summary: 'A critical operator workflow tied to a system being retired.',
    steps: [
      {
        id: 'critical-workflow',
        index: '01',
        label: 'Critical operator workflow',
      },
      {
        id: 'retiring-system',
        index: '02',
        label: 'System being retired',
      },
    ],
  },
  after: {
    label: 'After / redesigned workflow',
    summary: 'UI, data flow, and model output redesigned around the operator’s task.',
    steps: [
      {
        id: 'frontend',
        index: '01',
        label: 'Frontend redesign',
      },
      {
        id: 'data-flow',
        index: '02',
        label: 'API contracts and data flow',
      },
      {
        id: 'model-output',
        index: '03',
        label: 'ML model output',
      },
      {
        id: 'operator',
        index: '04',
        label: 'Operator workflow',
      },
    ],
  },
  caption:
    'What made the difference was working on the UI, API contracts, and model output as one workflow.',
  reducedMotionNote: 'Reduced motion shows both states together instead of animating between them.',
} as const satisfies AmazonStory
