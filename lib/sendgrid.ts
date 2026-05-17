import sgMail from '@sendgrid/mail'
import { render } from '@react-email/components'
import { ConfirmationEmail } from '@/emails/confirmation'
import { NotificationEmail } from '@/emails/notification'
import { StatusUpdateEmail } from '@/emails/status-update'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM = {
  email: process.env.SENDGRID_FROM_EMAIL ?? 'reservations@emberontoorak.com.au',
  name:  'Ember on Toorak',
}

export interface ReservationEmailParams {
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

function formatDisplay(date: string, time: string) {
  const displayDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const [h, m] = time.split(':').map(Number)
  const displayTime = new Date(2000, 0, 1, h, m).toLocaleTimeString('en-AU', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
  return { displayDate, displayTime }
}

// Called on new reservation — sends confirmation to guest + notification to owner
export async function sendReservationEmails(params: ReservationEmailParams) {
  const [confirmationHtml, notificationHtml] = await Promise.all([
    render(ConfirmationEmail(params)),
    render(NotificationEmail(params)),
  ])

  const { displayDate, displayTime } = formatDisplay(params.date, params.time)

  await Promise.all([
    sgMail.send({
      to:      params.email,
      from:    FROM,
      subject: `Reservation confirmed — ${displayDate} at ${displayTime}`,
      html:    confirmationHtml,
    }),
    sgMail.send({
      to:      process.env.RESTAURANT_NOTIFY_EMAIL ?? 'bijbrin@gmail.com',
      from:    FROM,
      subject: `New reservation — ${params.firstName} ${params.lastName} · ${displayDate} at ${displayTime}`,
      html:    notificationHtml,
    }),
  ])
}

// Called when admin changes status — sends update email to guest only
export async function sendStatusEmail(
  params: ReservationEmailParams,
  status: 'CONFIRMED' | 'CANCELLED',
) {
  const html = await render(StatusUpdateEmail({ ...params, status }))
  const { displayDate, displayTime } = formatDisplay(params.date, params.time)

  const subject =
    status === 'CONFIRMED'
      ? `Reservation confirmed — ${displayDate} at ${displayTime}`
      : `Reservation cancelled — ${displayDate} at ${displayTime}`

  await sgMail.send({
    to:   params.email,
    from: FROM,
    subject,
    html,
  })
}
