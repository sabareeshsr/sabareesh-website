import type { Metadata } from 'next'
import Link from 'next/link'
import { getPage } from '@/lib/getPage'

/* ─── Payload field types ─── */
interface Experience {
  company?: string; role?: string; duration?: string
  description?: string; highlights?: Array<{ item: string }>
}
interface Skill { category?: string; icon?: string; description?: string }
interface GrowthStat { metric?: string; label?: string }

interface GrowthPage {
  heroTitle?: string; heroSubtitle?: string
  experiences?: Experience[]
  skills?: Skill[]
  growthStats?: GrowthStat[]
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<GrowthPage>('growth')
  const title = page?.seo?.seoTitle || 'Growth Marketer | Sabareesh'
  const description = page?.seo?.seoDescription || 'Driving measurable growth through content, campaigns, and creativity — from zero to enterprise scale.'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.seo?.ogImage?.url ? [{ url: page.seo.ogImage.url }] : [],
    },
  }
}

/* ─── Fallback content ─── */
const FB_SKILLS: Skill[] = [
  { icon: '✉️', category: 'Email Marketing', description: 'Lifecycle campaigns, drip sequences, and newsletters that convert. A/B testing, segmentation, and deliverability optimisation.' },
  { icon: '✍️', category: 'Content Marketing', description: 'Long-form content, SEO-optimised blogs, and thought-leadership articles that attract and nurture high-intent audiences.' },
  { icon: '🌐', category: 'Website Marketing', description: 'CRO, landing page design, analytics setup (GA4, Hotjar), and performance tracking aligned to pipeline goals.' },
  { icon: '📱', category: 'Social Media', description: 'LinkedIn, Twitter/X, and Instagram — building organic reach through consistent voice, community engagement, and strategic posting.' },
  { icon: '🎨', category: 'Design', description: 'Figma-based design for marketing assets: banners, social creatives, pitch decks, and product UI mockups.' },
]

const FB_EXPERIENCE: Experience = {
  company: 'KTern.AI',
  role: 'Growth Marketer',
  duration: '2022 – Present',
  description: 'Leading growth marketing for an intelligent SAP digital transformation platform. Responsible for pipeline generation, brand positioning, and marketing-attributed revenue across enterprise accounts in 20+ countries.',
  highlights: [
    { item: 'Built and scaled content engine from 0 → 50+ published blogs' },
    { item: 'Managed B2B email campaigns with 35%+ open rates' },
    { item: 'Led product marketing for 3 major feature launches' },
    { item: 'Grew LinkedIn following 4× in 18 months organically' },
  ],
}

const FB_STATS: GrowthStat[] = [
  { metric: '50+', label: 'Blogs Published' },
  { metric: '35%', label: 'Avg Email Open Rate' },
  { metric: '20+', label: 'Enterprise Clients' },
  { metric: '4×',  label: 'LinkedIn Growth' },
]

/* ─── Design tokens ─── */
const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'
const SEP = { background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }

export default async function GrowthPage() {
  const page = await getPage<GrowthPage>('growth')

  const heroTitle  = page?.heroTitle    || 'Growth Marketer'
  const heroSub    = page?.heroSubtitle || 'Driving measurable growth through content, campaigns, and creativity — from zero to enterprise scale.'
  const experience = page?.experiences?.[0] || FB_EXPERIENCE
  const skills     = page?.skills?.length    ? page.skills     : FB_SKILLS
  const stats      = page?.growthStats?.length ? page.growthStats : FB_STATS

  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 55% 65% at 75% 45%, rgba(74,159,224,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 35% 45% at 15% 65%, rgba(37,99,235,0.07) 0%, transparent 65%)',
          ].join(','),
        }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="border-l-4 border-[#2563eb] pl-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-5">
              B2B Growth
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-[56px] md:text-[72px] tracking-tight leading-none mb-5">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                {heroTitle}
              </span>
            </h1>
            <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[560px]">{heroSub}</p>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE CARD ── */}
      <section className="px-6 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className={`${GLASS} p-8 md:p-12`}>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left — company + role */}
              <div className="lg:w-[280px] shrink-0">
                <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mb-5 shadow-[0px_0px_24px_rgba(37,99,235,0.25)]"
                     style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(37,99,235,0.2))', border: '1px solid rgba(96,165,250,0.25)' }}>
                  <span className="text-2xl">📈</span>
                </div>
                <h2 className="font-plus-jakarta font-extrabold text-[28px] text-white mb-1">{experience.company}</h2>
                <p className="font-inter text-[16px] text-[#60a5fa] font-medium mb-2">{experience.role}</p>
                <span className="font-inter text-[13px] text-[#64748b] bg-[rgba(100,116,139,0.12)] border border-[rgba(100,116,139,0.2)] px-3 py-1 rounded-full inline-block">
                  {experience.duration}
                </span>
              </div>
              {/* Right — details */}
              <div className="flex-1">
                <p className="font-inter text-[17px] text-[#94a3b8] leading-[1.8] mb-6">{experience.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {experience.highlights?.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[rgba(96,165,250,0.04)] border border-[rgba(96,165,250,0.1)] rounded-[12px] px-4 py-3">
                      <span className="shrink-0 w-2 h-2 rounded-full bg-[#4a9fe0] mt-2" />
                      <span className="font-inter text-[14px] text-[#c0c7d1] leading-snug">{h.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]" style={SEP} />
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-4">Capabilities</span>
            <h2 className="font-plus-jakarta font-bold text-[36px] text-white">Skills &amp; Disciplines</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((s, i) => (
              <div key={i} className={`${GLASS} p-7 hover:border-[rgba(96,165,250,0.3)] hover:bg-[rgba(96,165,250,0.03)] transition-all duration-200`}>
                <span className="text-4xl block mb-5">{s.icon}</span>
                <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-3">{s.category}</h3>
                <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.7]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]" style={SEP} />
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div key={i} className={`${GLASS} p-6 text-center`}>
              <span className="font-plus-jakarta font-extrabold text-[40px] leading-none bg-clip-text text-transparent block mb-2"
                    style={{ backgroundImage: 'linear-gradient(90deg, #94ccff 0%, #60a5fa 100%)' }}>
                {stat.metric}
              </span>
              <span className="font-inter text-[13px] text-[#64748b] uppercase tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="backdrop-blur-[16px] bg-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] rounded-[24px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-plus-jakarta font-bold text-[30px] text-white leading-tight">Ready to grow together?</h3>
              <p className="font-inter text-[16px] text-[#94a3b8] mt-2">Content strategy, campaigns, or brand building — let's talk.</p>
            </div>
            <Link href="/contact" className="font-plus-jakarta font-bold text-[15px] text-[#020617] px-8 py-4 rounded-[16px] shrink-0 transition-opacity hover:opacity-90 shadow-[0px_8px_24px_rgba(96,165,250,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              Work with Me →
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
