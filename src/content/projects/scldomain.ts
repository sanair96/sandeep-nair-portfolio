import type { PersonalProject } from '../content.types'

export const scldomainProject = {
  id: 'scldomain',
  eyebrow: 'Personal project · Go / macOS',
  title: 'scldomain — a small tool for trusted local HTTPS.',
  body: 'I built scldomain to give local development servers short, trusted HTTPS addresses without stitching together several tools. It runs as a self-contained macOS CLI and service.',
  technologies: ['Go', 'macOS'],
  steps: [
    {
      id: 'local-dev-server',
      index: '01',
      label: 'Local dev server',
    },
    {
      id: 'loopback-daemon',
      index: '02',
      label: 'Loopback daemon',
    },
    {
      id: 'https-localhost',
      index: '03',
      label: 'HTTPS .localhost',
    },
  ],
  link: {
    label: 'View the code ↗',
    href: 'https://github.com/sanair96/scldomain',
    external: true,
  },
} as const satisfies PersonalProject
