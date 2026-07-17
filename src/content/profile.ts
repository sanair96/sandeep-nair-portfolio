import type { Profile } from './content.types'

export const profile = {
  name: 'Sandeep A Nair',
  initials: 'SN',
  role: 'Senior Frontend / Full-Stack Engineer',
  eyebrow: 'Sandeep A Nair · Senior Frontend / Full-Stack Engineer',
  headline: 'I like making complex products feel straightforward to use.',
  intro:
    'I’ve spent the last eight years building products at Atlassian, Amazon, and startups, mostly in frontend-heavy roles. My work usually spans product decisions, frontend architecture, APIs, and hands-on delivery.',
  location: 'Bengaluru, India',
  focus: ['Product', 'Architecture', 'Delivery'],
  quickIntro: 'I’ve worked on products for customers, operators, and the teams building them.',
  quickIntroRoute: 'Atlassian · Amazon · startups',
  evidenceItems: [
    {
      index: '01',
      audience: 'User',
      title: 'Knowledge people can find and trust',
      meta: 'Search · navigation · trust signals',
    },
    {
      index: '02',
      audience: 'Operator',
      title: 'ML-assisted work that saves time',
      meta: '50% less operator time',
    },
    {
      index: '03',
      audience: 'Team',
      title: 'Frontend work the team can share',
      meta: 'Mentoring · delivery ownership',
    },
  ],
} as const satisfies Profile
