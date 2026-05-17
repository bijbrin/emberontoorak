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

interface ConfirmationEmailProps {
  firstName: string
  lastName:  string
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

export function ConfirmationEmail({
  firstName,
  lastName,
  date,
  time,
  guests,
  occasion,
  dietary,
  notes,
}: ConfirmationEmailProps) {
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

  return (
    <Html>
      <Head />
      <Preview>
        Your reservation at Ember on Toorak is confirmed — {displayDate} at {displayTime}
      </Preview>
      <Body style={{ backgroundColor: OBSIDIAN, fontFamily: 'Georgia, serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: SURFACE, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${STEEL}` }}>

          {/* Header */}
          <Section style={{ backgroundColor: OBSIDIAN, padding: '32px 40px 24px', textAlign: 'center' }}>
            <Text style={{ color: EMBER, fontFamily: 'Georgia, serif', fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Ember on Toorak
            </Text>
            <Heading style={{ color: CREAM, fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '400', margin: '0', letterSpacing: '1px' }}>
              Reservation Confirmed
            </Heading>
            <Text style={{ color: MUTED, fontSize: '13px', margin: '8px 0 0', letterSpacing: '1px' }}>
              328 Toorak Road, Toorak VIC 3142
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={{ padding: '32px 40px 0' }}>
            <Text style={{ color: CREAM, fontSize: '16px', margin: '0 0 12px', lineHeight: '1.6' }}>
              Dear {firstName} {lastName},
            </Text>
            <Text style={{ color: CREAM, fontSize: '15px', margin: '0', lineHeight: '1.7', opacity: 0.85 }}>
              Thank you for choosing Ember on Toorak. We are delighted to confirm your reservation and look forward to welcoming you.
            </Text>
          </Section>

          {/* Booking details card */}
          <Section style={{ padding: '24px 40px' }}>
            <div style={{ backgroundColor: OBSIDIAN, borderRadius: '8px', border: `1px solid ${STEEL}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${STEEL}` }}>
                <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Date</Text>
                <Text style={{ color: CREAM, fontSize: '17px', fontFamily: 'Georgia, serif', margin: '0', fontWeight: '600' }}>{displayDate}</Text>
              </div>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${STEEL}` }}>
                <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Time</Text>
                <Text style={{ color: CREAM, fontSize: '17px', fontFamily: 'Georgia, serif', margin: '0', fontWeight: '600' }}>{displayTime}</Text>
              </div>
              <div style={{ padding: '16px 24px', borderBottom: occasion || dietary || notes ? `1px solid ${STEEL}` : undefined }}>
                <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Guests</Text>
                <Text style={{ color: CREAM, fontSize: '17px', fontFamily: 'Georgia, serif', margin: '0', fontWeight: '600' }}>
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </Text>
              </div>
              {occasion && (
                <div style={{ padding: '16px 24px', borderBottom: dietary || notes ? `1px solid ${STEEL}` : undefined }}>
                  <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Occasion</Text>
                  <Text style={{ color: CREAM, fontSize: '15px', margin: '0' }}>{occasion}</Text>
                </div>
              )}
              {(dietary || notes) && (
                <div style={{ padding: '16px 24px' }}>
                  <Text style={{ color: MUTED, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Special Notes</Text>
                  <Text style={{ color: CREAM, fontSize: '15px', margin: '0', lineHeight: '1.6' }}>
                    {[dietary, notes].filter(Boolean).join(' · ')}
                  </Text>
                </div>
              )}
            </div>
          </Section>

          {/* CTA */}
          <Section style={{ padding: '0 40px 8px', textAlign: 'center' }}>
            <Text style={{ color: CREAM, fontSize: '14px', lineHeight: '1.7', opacity: 0.8, margin: '0 0 20px' }}>
              Need to modify or cancel? Contact us at least 24 hours before your reservation.
            </Text>
            <Button
              href="tel:0398247600"
              style={{ backgroundColor: EMBER, color: '#fff', padding: '12px 32px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', display: 'inline-block' }}
            >
              Call (03) 9824 7600
            </Button>
          </Section>

          <Hr style={{ borderColor: STEEL, margin: '32px 40px 24px' }} />

          {/* Footer */}
          <Section style={{ padding: '0 40px 32px', textAlign: 'center' }}>
            <Text style={{ color: MUTED, fontSize: '12px', margin: '0 0 4px', lineHeight: '1.6' }}>
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

export default ConfirmationEmail
