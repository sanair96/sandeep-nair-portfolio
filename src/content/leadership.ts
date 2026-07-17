import type { CareerTimelineItem, LeadershipPrinciple } from './content.types'

export const leadershipPrinciples = [
  {
    index: '01',
    title: 'Get clear on the problem first.',
    body: 'I work with stakeholders to turn a broad request into a clear set of decisions and tasks.',
  },
  {
    index: '02',
    title: 'Follow the problem across the stack.',
    body: 'If an API contract or model output makes the interface harder to use, I treat that as part of the frontend job.',
  },
  {
    index: '03',
    title: 'Help more people contribute.',
    body: 'I mentor backend engineers so they can contribute confidently to frontend work and the team doesn’t bottleneck around one person.',
  },
] as const satisfies readonly LeadershipPrinciple[]

export const careerTimeline = [
  {
    period: '2018—19',
    company: 'Throughbit',
    role: 'Software Developer',
  },
  {
    period: '2019',
    company: 'ClearTax',
    role: 'Software Developer I',
  },
  {
    period: '2019—22',
    company: 'Spacejoy',
    role: 'Software Developer III',
  },
  {
    period: '2022',
    company: 'fabric',
    role: 'Software Developer 2',
  },
  {
    period: '2022—24',
    company: 'Amazon',
    role: 'Frontend Engineer II',
  },
  {
    period: '2024—26',
    company: 'Atlassian',
    role: 'Senior Software Engineer',
    current: true,
  },
] as const satisfies readonly CareerTimelineItem[]
