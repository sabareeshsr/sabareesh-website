import ContactForm from '@/components/ContactForm'
import ContentBlocks, { type ContentBlock } from '@/components/sections/ContentBlocks'

export interface ContactTemplateProps {
  heroTitle: string
  heroSubtitle?: string
  email?: string
  linkedin?: string
  twitter?: string
  github?: string | null
  availability?: string | null
  formTitle?: string
  subjectOptions?: string[]
  contentBlocks?: ContentBlock[]
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)
const ArrowIcon = () => (
  <svg className="ml-auto shrink-0 text-[#334155] group-hover:text-[#60a5fa] group-hover:translate-x-0.5 transition-all" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function ContactTemplate({
  heroTitle,
  heroSubtitle,
  email = 'hello@sabareesh.com',
  linkedin = 'https://linkedin.com/in/sabareesh',
  twitter = 'https://twitter.com/sabareesh',
  github,
  availability,
  formTitle,
  subjectOptions,
  contentBlocks,
}: ContactTemplateProps) {
  const contacts = [
    { icon: <EmailIcon />, label: 'Email', value: email, href: `mailto:${email}`, external: false },
    { icon: <LinkedInIcon />, label: 'LinkedIn', value: linkedin.replace('https://', ''), href: linkedin, external: true },
    { icon: <TwitterIcon />, label: 'Twitter / X', value: '@sabareesh', href: twitter, external: true },
    ...(github ? [{ icon: <GitHubIcon />, label: 'GitHub', value: github.replace('https://github.com/', ''), href: github, external: true }] : []),
  ]

  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 80% 40%, rgba(74,159,224,0.07) 0%, transparent 65%)',
          ].join(','),
        }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="border-l-4 border-[#2563eb] pl-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-5">
              Get in Touch
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-[56px] md:text-[72px] tracking-tight leading-none mb-5">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                {heroTitle}
              </span>
            </h1>
            {heroSubtitle && (
              <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[540px]">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT BLOCKS ── */}
      <ContentBlocks blocks={contentBlocks} />

      {/* ── SPLIT LAYOUT ── */}
      <section className="px-6 pb-24">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">

          {/* ── LEFT: Contact info ── */}
          <div className="flex flex-col gap-6">
            <div className={`${GLASS} p-7`}>
              <h2 className="font-plus-jakarta font-bold text-[22px] text-white mb-3">Direct Channels</h2>
              <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.75]">
                For quick questions, use any of the channels below. For project scoping, the form works best.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contacts.map(({ icon, label, value, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={`${GLASS} px-5 py-4 flex items-center gap-4 hover:border-[rgba(96,165,250,0.35)] hover:bg-[rgba(96,165,250,0.04)] transition-all duration-200 group`}
                >
                  <div className="shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center text-[#60a5fa]"
                       style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(37,99,235,0.15))', border: '1px solid rgba(96,165,250,0.2)' }}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-inter text-[12px] text-[#64748b] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="font-inter text-[14px] text-white group-hover:text-[#60a5fa] transition-colors truncate">{value}</p>
                  </div>
                  <ArrowIcon />
                </a>
              ))}
            </div>

            <div className="flex items-start gap-3 px-5 py-4 bg-[rgba(148,204,255,0.04)] border border-[rgba(148,204,255,0.1)] rounded-[16px]">
              <span className="text-xl shrink-0">⏱️</span>
              <p className="font-inter text-[14px] text-[#64748b] leading-[1.6]">
                {availability
                  ? availability
                  : <>I typically respond within <span className="text-[#94a3b8]">1–2 business days</span>. For urgent matters, LinkedIn DMs are fastest.</>
                }
              </p>
            </div>
          </div>

          {/* ── RIGHT: Contact form ── */}
          <div className={`${GLASS} p-8 md:p-10`}>
            <h2 className="font-plus-jakarta font-bold text-[24px] text-white mb-2">Send a Message</h2>
            <p className="font-inter text-[15px] text-[#64748b] mb-8">Fill in the details and I&apos;ll get back to you shortly.</p>
            <ContactForm formTitle={formTitle} subjectOptions={subjectOptions} />
          </div>

        </div>
      </section>

    </main>
  )
}
