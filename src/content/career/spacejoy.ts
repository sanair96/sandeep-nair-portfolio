import { careerFacts } from '../career-facts'
import type { SpacejoyStory } from '../content.types'

export const spacejoyStory = {
  id: 'spacejoy',
  company: 'Spacejoy',
  period: '2019—2022',
  role: 'Software Developer III',
  title: 'At Spacejoy, my work stretched from storefronts and login flows to Three.js.',
  body: 'I joined while the platform was being built from scratch and worked across its React and Next.js foundation. I built customer-facing storefront and authentication flows, alongside an internal CMS for storefront operations, project management, and blog publishing. I also worked on designer-facing budget context, developed a Three.js model viewer that later informed 360-degree visualization, and helped ship the React Native app within two months.',
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
  surfacesLabel: 'Product surfaces',
  surfacesTitle: 'What I built across the platform',
  surfaces: [
    {
      id: 'customer-experience',
      label: 'Customer experience',
      summary: 'Storefront, authentication, and mobile product flows.',
    },
    {
      id: 'internal-cms',
      label: 'Internal CMS',
      summary: 'Internal storefront, project management, and blog publishing workflows.',
    },
    {
      id: 'designer-view',
      label: 'Designer view',
      summary: 'Budget context surfaced inside the room-design experience.',
    },
    {
      id: '3d-visualization',
      label: '3D visualization',
      summary: 'Model inspection and early 360° visualization with Three.js.',
    },
  ],
  viewer: {
    ariaLabel: 'Spacejoy 3D room build',
    label: 'Live Three.js room / auto-building',
    posterSrc: '/images/spacejoy-poster.webp',
    posterLabel: 'Designer view',
    posterSummary: 'Budget context',
    modelSrc: '/models/spacejoy-showcase.glb',
    pauseLabel: 'Pause room build',
    fallbackCopy: 'The static view still explains the role and workflow.',
    errorCopy: 'The interactive model is unavailable, so the static view is shown instead.',
  },
  caption: 'Watch the room assemble · orbit the finished space · replay the build',
  interactionNote:
    'The build pauses offscreen. Once complete, drag to inspect the furnished room from another angle.',
} as const satisfies SpacejoyStory
