'use server'

export interface ContactResult {
  success: boolean
  error?: string
}

export async function submitContact(_prev: ContactResult | null, formData: FormData): Promise<ContactResult> {
  const name    = (formData.get('name')    as string | null)?.trim()
  const email   = (formData.get('email')   as string | null)?.trim()
  const subject = (formData.get('subject') as string | null)?.trim()
  const message = (formData.get('message') as string | null)?.trim()

  if (!name || !email || !message) {
    return { success: false, error: 'Please fill in your name, email, and message.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  /* ──────────────────────────────────────────────────────────────────
     Connect an email service here (Resend, Nodemailer, SendGrid, etc.)

     Example with Resend:
       const { Resend } = await import('resend')
       const resend = new Resend(process.env.RESEND_API_KEY)
       await resend.emails.send({
         from: 'website@yourdomain.com',
         to: 'sabareesh@yourdomain.com',
         subject: `[Contact] ${subject || 'New message'} — from ${name}`,
         text: `From: ${name} <${email}>\n\n${message}`,
       })
  ────────────────────────────────────────────────────────────────── */

  console.log('[Contact Form]', { name, email, subject: subject || '(no subject)', message })

  return { success: true }
}
