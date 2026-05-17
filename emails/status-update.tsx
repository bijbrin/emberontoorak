import {
  Body,
  Button,
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

interface StatusUpdateEmailProps {
  firstName: string
  lastName:  string
  date:      string
  time:      string
  guests:    number
  occasion?: string
  dietary?:  string
  notes?:    string
  status:    'CONFIRMED' | 'CANCELLED'
}

const OBSIDIAN = '#273F4F'
const SURFACE  = '#2A4255'
const STEEL    = '#447D9B'
const EMBER    = '#FE7743'
const CREAM    = '#F0EAE0'
const MUTED    = '#8BAFC5'

export function StatusUpdateEmail({
  firstName,
  lastName,
  date,
  time,
  guests,
  occasion,
  dietary,
  notes,
  status,
}: StatusUpdateEmailProps) {
  const displayDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const [h, m] = time.split(':').map(Number)
  const displayTime = new Date(2000, 0, 1, h, m).toLocaleTimeString('en-AU', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  const isConfirmed = status === 'CONFIRMED'

  const accentColor = isConfirmed ? EMBER : '#EF4444'
  const headingText = isConfirmed ? 'Reservation Confirmed' : 'Reservation Cancelled'
  const previewText = isConfirmed
    ? `Your table at Ember on Toorak is confirmed — ${displayDate} at ${displayTime}`
    : `Your reservation at Ember on Toorak has been cancelled`
  const bodyText = isConfirmed
    ? `We are delighted to confirm your table is reserved and we look forward to welcoming you.`
    : `Your reservation has been cancelled. We hope to welcome you again soon — please don't hesitate to book a new table.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: OBSIDIAN, fontFamily: 'Georgia, serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: SURFACE, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${STEEL}` }}>

          {/* Header */}
          <Section style={{ backgroundColor: OBSIDIAN, padding: '32px 40px 24px', textAlign: 'center', borderBottom: `2px solid ${accentColor}` }}>
            <Text style={{ color: accentColor, fontFamily: 'Georgia, serif', fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Ember on Toorak
            </Text>
            <Heading style={{ color: CREAM, fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '400', margin: '0', letterSpacing: '1px' }}>
              {headingText}
            </Heading>
          </Section>

          {/* Greeting */}
          <Section style={{ padding: '28px 40px 0' }}>
            <Text style={{ color: CREAM, fontSize: '16px', margin: '0 0 10px', lineHeight: '1.6' }}>
              Dear {firstName} {lastName},
            </Text>
            <Text style={{ color: CREAM, fontSize: '15px', margin: '0', lineHeight: '1.7', opacity: 0.8 }}>
              {bodyText}
            </Text>
          </Section>

          {/* Booking details */}
          {isConfirmed && (
            <Section style={{ padding: '24px 40px' }}>
              <div style={{ backgroundColor: OBSIDIAN, borderRadius: '8px', border: `1px solid ${STEEL}`, overflow: 'hidden' }}>
                <div style={{ padding: '14px 22px', borderBottom: `1px solid ${STEEL}` }}>
                  <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>Date</Text>
                  <Text style={{ color: CREAM, fontSize: '16px', fontFamily: 'Georgia, serif', margin: '0', fontWeight: '600' }}>{displayDate}</Text>
                </div>
                <div style={{ padding: '14px 22px', borderBottom: `1px solid ${STEEL}` }}>
                  <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>Time</Text>
                  <Text style={{ color: CREAM, fontSize: '16px', fontFamily: 'Georgia, serif', margin: '0', fontWeight: '600' }}>{displayTime}</Text>
                </div>
                <div style={{ padding: '14px 22px', borderBottom: occasion || dietary || notes ? `1px solid ${STEEL}` : undefined }}>
                  <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>Guests</Text>
                  <Text style={{ color: CREAM, fontSize: '16px', fontFamily: 'Georgia, serif', margin: '0', fontWeight: '600' }}>
                    {guests} {guests === 1 ? 'guest' : 'guests'}
                  </Text>
                </div>
                {occasion && (
                  <div style={{ padding: '14px 22px', borderBottom: dietary || notes ? `1px solid ${STEEL}` : undefined }}>
                    <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>Occasion</Text>
                    <Text style={{ color: CREAM, fontSize: '15px', margin: '0' }}>{occasion}</Text>
                  </div>
                )}
                {(dietary || notes) && (
                  <div style={{ padding: '14px 22px' }}>
                    <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 3px' }}>Special Notes</Text>
                    <Text style={{ color: CREAM, fontSize: '15px', margin: '0', lineHeight: '1.6' }}>
                      {[dietary, notes].filter(Boolean).join(' · ')}
                    </Text>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* CTA */}
          <Section style={{ padding: isConfirmed ? '0 40px 8px' : '20px 40px 8px', textAlign: 'center' }}>
            {isConfirmed ? (
              <>
                <Text style={{ color: CREAM, fontSize: '14px', lineHeight: '1.7', opacity: 0.75, margin: '0 0 20px' }}>
                  Need to change your plans? Contact us at least 24 hours before your reservation.
                </Text>
                <Button
                  href="tel:0398247600"
                  style={{ backgroundColor: EMBER, color: '#fff', padding: '12px 32px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}
                >
                  Call (03) 9824 7600
                </Button>
              </>
            ) : (
              <>
                <Text style={{ color: CREAM, fontSize: '14px', lineHeight: '1.7', opacity: 0.75, margin: '0 0 20px' }}>
                  We would love to see you soon. Book a new table online or call us directly.
                </Text>
                <Button
                  href="https://emberontoorak.com.au/reservations"
                  style={{ backgroundColor: EMBER, color: '#fff', padding: '12px 32px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}
                >
                  Book Again
                </Button>
              </>
            )}
          </Section>

          <Hr style={{ borderColor: STEEL, margin: '28px 40px 20px' }} />

          {/* Footer */}
          <Section style={{ padding: '0 40px 28px', textAlign: 'center' }}>
            <Text style={{ color: MUTED, fontSize: '12px', margin: '0 0 3px', lineHeight: '1.6' }}>
              Ember on Toorak · 328 Toorak Road, Toorak VIC 3142
            </Text>
            <Text style={{ color: MUTED, fontSize: '12px', margin: '0', lineHeight: '1.6' }}>
              Mon–Thu &amp; Sun 11:00–21:00 · Fri–Sat 11:00–22:00
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default StatusUpdateEmail
