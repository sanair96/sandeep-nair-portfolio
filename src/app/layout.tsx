import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import './globals.css'
import { getSiteUrl } from './site-url'

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'Sandeep A Nair — Senior Software Engineer',
    template: '%s — Sandeep A Nair',
  },
  description:
    'Senior frontend and full-stack engineer building straightforward product experiences, scalable frontend architecture, and AI-assisted workflows.',
  alternates: { canonical: '/' },
  openGraph: {
    description:
      'Selected work across Atlassian, Amazon, and Spacejoy, plus personal projects in automation and developer tooling.',
    locale: 'en_IN',
    siteName: 'Sandeep A Nair',
    title: 'Sandeep A Nair — Senior Software Engineer',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    description:
      'Selected product engineering work across frontend architecture, AI-assisted workflows, and 3D experiences.',
    title: 'Sandeep A Nair — Senior Software Engineer',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F4EFE7',
  width: 'device-width',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
