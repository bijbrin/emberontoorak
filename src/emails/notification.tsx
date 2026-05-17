import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface NotificationEmailProps {
  firstName: string
  lastName:  string
  email:     string
  phone?:    string
  date:      string
  time:      string
  guests:    number
  occasion?: string
  dietary?:  string
  notes?:    string
}

const OBSIDIAN = '#273F4F'
const SURFACE  = '#2A4255'
const STEEL    = '#447D9B'
const EMBER    = '#FE7743'
const CREAM    = '#F0EAE0'
const MUTED    = '#8BAFC5'

export function NotificationEmail({
  firstName,
  lastName,
  email,
  phone,
  date,
  time,
  guests,
  occasion,
  dietary,
  notes,
}: NotificationEmailProps) {
  const displayDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-AU', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })

  const [h, m] = time.split(':').map(Number)
  const displayTime = new Date(2000, 0, 1, h, m).toLocaleTimeString('en-AU', {
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const row = (label: string, value: string) => (
    <div style={{ padding: '12px 20px', borderBottom: `1px solid ${STEEL}` }}>
      <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>{label}</Text>
      <Text style={{ color: CREAM, fontSize: '15px', margin: '0' }}>{value}</Text>
    </div>
  )

  return (
    <Html>
      <Head />
      <Preview>{`New reservation — ${firstName} ${lastName} · ${displayDate} at ${displayTime} · ${guests} guests`}</Preview>
      <Body style={{ backgroundColor: OBSIDIAN, fontFamily: 'Georgia, serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: '520px', margin: '0 auto', backgroundColor: SURFACE, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${STEEL}` }}>

          <Section style={{ backgroundColor: OBSIDIAN, padding: '24px 32px', borderBottom: `2px solid ${EMBER}` }}>
            <Text style={{ color: EMBER, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Ember on Toorak · New Booking
            </Text>
            <Heading style={{ color: CREAM, fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '400', margin: '0' }}>
              {firstName} {lastName}
            </Heading>
          </Section>

          <Section style={{ padding: '8px 0' }}>
            <div style={{ backgroundColor: OBSIDIAN, margin: '16px 24px', borderRadius: '6px', border: `1px solid ${STEEL}`, overflow: 'hidden' }}>
              {row('Date', displayDate)}
              {row('Time', displayTime)}
              {row('Party size', `${guests} ${guests === 1 ? 'guest' : 'guests'}`)}
              {occasion && row('Occasion', occasion)}
              <div style={{ padding: '12px 20px', borderBottom: dietary || notes ? `1px solid ${STEEL}` : undefined }}>
                <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>Contact</Text>
                <Text style={{ color: CREAM, fontSize: '15px', margin: '0' }}>{email}</Text>
                {phone && <Text style={{ color: CREAM, fontSize: '15px', margin: '4px 0 0' }}>{phone}</Text>}
              </div>
              {(dietary || notes) && (
                <div style={{ padding: '12px 20px' }}>
                  <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 2px' }}>Notes</Text>
                  <Text style={{ color: CREAM, fontSize: '15px', margin: '0', lineHeight: '1.6' }}>
                    {[dietary, notes].filter(Boolean).join(' · ')}
                  </Text>
                </div>
              )}
            </div>
          </Section>

          <Hr style={{ borderColor: STEEL, margin: '8px 24px 0' }} />

          <Section style={{ padding: '16px 32px 24px', textAlign: 'center' }}>
            <Text style={{ color: MUTED, fontSize: '12px', margin: '0' }}>
              Manage reservations at your admin dashboard
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default NotificationEmail
