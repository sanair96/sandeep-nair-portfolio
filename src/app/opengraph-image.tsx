import { ImageResponse } from 'next/og'

export const alt = 'Sandeep A Nair — product engineering evidence'
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#F4EFE7',
        color: '#15211D',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '64px',
        width: '100%',
      }}
    >
      <div
        style={{
          color: '#3159D9',
          display: 'flex',
          fontFamily: 'monospace',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        SENIOR FRONTEND / FULL-STACK ENGINEER
      </div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 650, lineHeight: 0.98, width: 900 }}>
        Complex products, made straightforward to use.
      </div>
      <div
        style={{
          alignItems: 'center',
          borderTop: '2px solid #D4D0C6',
          display: 'flex',
          fontFamily: 'monospace',
          fontSize: 24,
          justifyContent: 'space-between',
          paddingTop: '30px',
        }}
      >
        <span>SANDEEP A NAIR</span>
        <span style={{ color: '#66706B' }}>ATLASSIAN · AMAZON · SPACEJOY</span>
      </div>
    </div>,
    size,
  )
}
