import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ember on Toorak — Theatre of Fire'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 80, color: '#FE7743', fontWeight: 700, letterSpacing: '-2px' }}>
          EMBER
        </div>
        <div style={{ fontSize: 18, color: '#D7D7D7', letterSpacing: '0.4em' }}>
          ON TOORAK
        </div>
        <div
          style={{
            width: 60,
            height: 2,
            background: '#FE7743',
            marginTop: 16,
            marginBottom: 16,
          }}
        />
        <div style={{ fontSize: 26, color: '#D7D7D7', fontStyle: 'italic' }}>
          Theatre of Fire
        </div>
        <div style={{ fontSize: 14, color: '#8faabc', marginTop: 8, letterSpacing: '0.15em' }}>
          Toorak, Victoria
        </div>
      </div>
    ),
    { ...size },
  )
}
