import type { ContentLink } from './content.types'

export const links = {
  resume: {
    label: 'Résumé',
    href: '/documents/sandeep-a-nair-resume.pdf',
    external: false,
    download: true,
  },
  email: {
    label: 'Email me',
    href: 'mailto:sannair96@gmail.com',
    external: false,
  },
  linkedin: {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sanair96/',
    external: true,
  },
  github: {
    label: 'GitHub',
    href: 'https://github.com/sanair96',
    external: true,
  },
} as const satisfies Record<'resume' | 'email' | 'linkedin' | 'github', ContentLink>
