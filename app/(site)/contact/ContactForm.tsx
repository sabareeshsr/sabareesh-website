'use client'
import { useActionState } from 'react'
import { submitContact, type ContactResult } from './actions'

const DEFAULT_SUBJECTS = [
  'SAP Gen AI Project',
  'Growth Marketing',
  'Book / Writing',
  'Agentic AI Build',
  'Speaking / Podcast',
  'General Enquiry',
]

const INPUT = 'w-full font-inter text-[15px] text-white placeholder:text-[#475569] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[14px] px-5 py-3.5 focus:outline-none focus:border-[rgba(96,165,250,0.5)] transition-colors'

interface Props {
  formTitle?: string
  subjectOptions?: string[]
}

export default function ContactForm({ formTitle, subjectOptions }: Props) {
  const subjects = subjectOptions?.length ? subjectOptions : DEFAULT_SUBJECTS
  const [state, action, isPending] = useActionState<ContactResult | null, FormData>(submitContact, null)

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
             style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(37,99,235,0.2))', border: '1px solid rgba(96,165,250,0.3)' }}>
          ✅
        </div>
        <h3 className="font-plus-jakarta font-bold text-[24px] text-white">Message sent!</h3>
        <p className="font-inter text-[16px] text-[#94a3b8] max-w-[320px]">Thanks for reaching out. I&apos;ll get back to you within 1–2 business days.</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {formTitle && <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-1">{formTitle}</h3>}
      {state?.error && (
        <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-[12px] px-5 py-3">
          <p className="font-inter text-[14px] text-[#f87171]">{state.error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-inter text-[13px] text-[#94a3b8] font-medium">Name <span className="text-[#60a5fa]">*</span></label>
          <input name="name" type="text" placeholder="Your name" required className={INPUT} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-inter text-[13px] text-[#94a3b8] font-medium">Email <span className="text-[#60a5fa]">*</span></label>
          <input name="email" type="email" placeholder="you@example.com" required className={INPUT} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-inter text-[13px] text-[#94a3b8] font-medium">Subject</label>
        <select name="subject" className={`${INPUT} appearance-none cursor-pointer`} defaultValue="">
          <option value="" disabled className="bg-[#0f172a]">Select a topic…</option>
          {subjects.map((s) => <option key={s} value={s} className="bg-[#0f172a]">{s}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-inter text-[13px] text-[#94a3b8] font-medium">Message <span className="text-[#60a5fa]">*</span></label>
        <textarea name="message" rows={6} placeholder="Tell me about your project, idea, or question…" required className={`${INPUT} resize-none`} />
      </div>
      <button type="submit" disabled={isPending}
              className="w-full font-plus-jakarta font-bold text-[16px] text-[#020617] py-4 rounded-[16px] mt-2 disabled:opacity-60 transition-all shadow-[0px_8px_24px_rgba(96,165,250,0.25)] hover:shadow-[0px_12px_32px_rgba(96,165,250,0.35)] hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
        {isPending ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}
