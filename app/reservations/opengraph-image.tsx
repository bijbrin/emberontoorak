import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Book a Table — Ember on Toorak'
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
        <div style={{ fontSize: 18, color: '#8faabc', letterSpacing: '0.4em' }}>
          EMBER ON TOORAK
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
        <div style={{ fontSize: 60, color: '#FE7743', fontWeight: 700 }}>
          RESERVATIONS
        </div>
        <div style={{ fontSize: 22, color: '#D7D7D7', marginTop: 8, fontStyle: 'italic' }}>
          Secure your table in Toorak Village
        </div>
      </div>
    ),
    { ...size },
  )
}
