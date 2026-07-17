import { careerFacts } from '../career-facts'
import type { SpacejoyStory } from '../content.types'

export const spacejoyStory = {
  id: 'spacejoy',
  company: 'Spacejoy',
  period: '2019—2022',
  role: 'Software Developer III',
  title: 'At Spacejoy, my work stretched from storefronts and login flows to Three.js.',
  body: 'I joined while the platform was being built from scratch and worked across its React and Next.js foundation. I built budget-aware storefront flows for designers, cross-product authentication, and a Three.js model viewer that later informed 360-degree visualization. I also helped ship the React Native app within two months.',
  outcomes: [
    {
      value: careerFacts.platformLaunch.value,
      label: careerFacts.platformLaunch.label,
      factKey: 'platformLaunch',
    },
    {
      value: careerFacts.mobileLaunch.value,
      label: careerFacts.mobileLaunch.label,
      factKey: 'mobileLaunch',
    },
  ],
  perspectives: [
    {
      id: 'customer',
      label: 'Customer',
      summary: 'Customer-facing storefront and room-design experience',
    },
    {
      id: 'designer',
      label: 'Designer',
      summary: 'Budget-aware storefront flows for room designs',
    },
    {
      id: '3d-artist',
      label: '3D artist',
      summary: 'Model inspection and rendering context',
    },
  ],
  viewer: {
    label: 'Three.js viewer / contained',
    posterSrc: '/images/spacejoy-poster.webp',
    modelSrc: '/models/spacejoy-showcase.glb',
    actionLabel: 'View in 3D',
    pauseLabel: 'Pause 3D',
    fallbackCopy: 'The static view still explains the role and workflow.',
    errorCopy: 'The interactive model is unavailable, so the static view is shown instead.',
  },
  caption: 'Drag to orbit · switch role perspective · inspect product',
  interactionNote:
    'Orbit is available, not required. The static view still explains the role and workflow.',
} as const satisfies SpacejoyStory
