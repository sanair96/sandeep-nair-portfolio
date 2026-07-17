import { careerFacts } from '../career-facts'
import type { AtlassianStory } from '../content.types'

export const atlassianStory = {
  id: 'atlassian',
  company: 'Atlassian',
  period: '2024—2026',
  role: 'Senior Software Engineer',
  title:
    'At Atlassian, I worked on two sides of support: helping people find answers and helping teams see what was worth automating.',
  body: 'One part of my work was improving article discovery. I redesigned search and navigation, added trust signals, and brought in new data sources. I also built a multi-agent pipeline that worked through thousands of support tickets and surfaced automation opportunities for engineering teams.',
  outcomes: [
    {
      value: careerFacts.annualSavings.value,
      label: careerFacts.annualSavings.label,
      factKey: 'annualSavings',
    },
    {
      value: 'Less',
      label: 'Manual engineering review',
    },
  ],
  views: [
    {
      id: 'interface',
      label: 'Interface',
      summary: 'Search · navigation · trust signals',
    },
    {
      id: 'system',
      label: 'System',
      summary: 'Coordinate → identify → verify → rate',
    },
    {
      id: 'outcome',
      label: 'Outcome',
      summary: '$5M+ contributed · less manual review',
    },
  ],
  pipeline: [
    {
      id: 'support-tickets',
      index: '01',
      label: 'Support tickets',
      description: 'Thousands of support tickets',
    },
    {
      id: 'coordinate',
      index: '02',
      label: 'Coordinate',
      description: 'Routes each ticket through the right checks',
    },
    {
      id: 'identify',
      index: '03',
      label: 'Identify',
      description: 'Find repeated ticket patterns that could become automation opportunities.',
    },
    {
      id: 'verify',
      index: '04',
      label: 'Verify',
      description: 'Check each pattern against ticket context before it reaches engineering.',
    },
    {
      id: 'rate',
      index: '05',
      label: 'Rate',
      description: 'Score impact and confidence so the strongest opportunities rise first.',
    },
    {
      id: 'prioritized-opportunities',
      index: '06',
      label: 'Prioritized opportunities',
    },
  ],
  loopLabel: 'Repeat until the result is ready for review.',
  caption:
    'The coordinator sent each ticket through identification, verification, and rating before surfacing the result for review.',
  accessibilityNote: 'Keyboard controls remain available with reduced motion.',
} as const satisfies AtlassianStory
