import type { CareerFact, CareerFactKey } from './content.types'

export const careerFacts = {
  experience: {
    value: '08',
    label: 'Years building products',
  },
  annualSavings: {
    value: '$5M+',
    label: 'Annual savings contributed',
  },
  operatorTime: {
    value: '50%',
    label: 'Less operator time',
  },
  platformLaunch: {
    value: '0→1',
    label: 'Multi-sided platform',
  },
  mobileLaunch: {
    value: '2 mo',
    label: 'Mobile app launch',
  },
} as const satisfies Record<CareerFactKey, CareerFact>
