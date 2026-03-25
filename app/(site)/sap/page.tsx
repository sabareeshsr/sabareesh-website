import Link from 'next/link'
import RichText from '@/components/RichText'
import { getPage } from '@/lib/getPage'

/* ─── Payload field types ─── */
interface Certification {
  title?: string; issuer?: string; date?: string
  badgeImage?: { url?: string } | null; link?: string
}
interface CommunityBlog {
  title?: string; url?: string; platform?: string; date?: string
  tags?: Array<{ tag: string }>; excerpt?: string
}
interface SapSection { icon?: string; title?: string; description?: string }

interface SAPPage {
  heroTitle?: string; heroSubtitle?: string
  certifications?: Certification[]
  communityBlogs?: CommunityBlog[]
  approachTitle?: string
  approachContent?: object
  sapSections?: SapSection[]
}

/* ─── Fallback content ─── */
const FB_CERT: Certification = {
  title: 'SAP Certified Associate',
  issuer: 'SAP SE',
  date: '2024',
}

const FB_BLOGS: CommunityBlog[] = [
  { title: 'Bridging SAP and Generative AI: What Enterprises Need to Know', url: '#', date: 'Jan 2024', tags: [{ tag: 'Gen AI' }, { tag: 'SAP BTP' }] },
  { title: 'Building RAG Pipelines on SAP AI Core', url: '#', date: 'Feb 2024', tags: [{ tag: 'RAG' }, { tag: 'LLM' }] },
  { title: 'SAP Joule: A Deep Dive Under the Hood', url: '#', date: 'Mar 2024', tags: [{ tag: 'Joule' }, { tag: 'Copilot' }] },
  { title: 'LLM Fine-tuning for ERP Data Patterns', url: '#', date: 'Apr 2024', tags: [{ tag: 'Fine-tuning' }] },
  { title: 'Multi-Agent Frameworks in SAP Contexts', url: '#', date: 'May 2024', tags: [{ tag: 'Agents' }, { tag: 'SAP' }] },
  { title: 'Prompt Engineering for Structured ERP Data', url: '#', date: 'Jun 2024', tags: [{ tag: 'Prompts' }] },
]

const FB_APPROACH: SapSection[] = [
  { icon: '🔗', title: 'Integration First', description: 'Design AI solutions that slot natively into SAP — S/4HANA, BTP, SuccessFactors — without disrupting existing workflows.' },
  { icon: '🧠', title: 'Right-Sized Models', description: 'Select the correct model (GPT-4, Gemini, open-source) based on data sensitivity, latency, and cost constraints.' },
  { icon: '⚡', title: 'Rapid Prototyping', description: 'Business requirement to working prototype in days using SAP AI Core, Joule, and custom agent pipelines.' },
  { icon: '🔒', title: 'Enterprise Security', description: 'Data stays within enterprise boundaries. Auth, RBAC, and audit logging built in from day one.' },
]

/* ─── Design tokens ─── */
const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'
const SEP = { background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }

export default async function SAPPage() {
  const page = await getPage<SAPPage>('sap')

  const heroTitle = page?.heroTitle    || 'SAP Certified Gen AI Developer'
  const heroSub   = page?.heroSubtitle || 'Bridging enterprise SAP ecosystems with the power of generative AI and intelligent automation.'
  const certs     = page?.certifications?.length ? page.certifications : [FB_CERT]
  const blogs     = page?.communityBlogs?.length  ? page.communityBlogs  : FB_BLOGS
  const approach  = page?.sapSections?.length     ? page.sapSections     : FB_APPROACH
  const cert      = certs[0]

  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 60% 70% at 85% 40%, rgba(74,159,224,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 10% 60%, rgba(37,99,235,0.08) 0%, transparent 65%)',
          ].join(','),
        }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="border-l-4 border-[#2563eb] pl-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-5">
              Enterprise AI
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-[44px] md:text-[62px] tracking-tight leading-[1.08] mb-5">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                {heroTitle}
              </span>
            </h1>
            <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[580px]">{heroSub}</p>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATION BADGE ── */}
      <section className="px-6 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className={`${GLASS} p-8 md:p-12`}>
            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* Badge */}
              <div className="shrink-0">
                <div className="w-[140px] h-[140px] rounded-[24px] flex flex-col items-center justify-center gap-2 shadow-[0px_0px_40px_rgba(37,99,235,0.35)]"
                     style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(37,99,235,0.22) 100%)', border: '1px solid rgba(96,165,250,0.3)' }}>
                  <span className="font-plus-jakarta font-extrabold text-[26px] text-[#60a5fa]">SAP</span>
                  <div className="w-10 h-[2px] rounded" style={{ background: 'linear-gradient(90deg, #60a5fa, #2563eb)' }} />
                  <span className="font-inter text-[10px] text-[#94ccff] tracking-wider uppercase text-center px-3 leading-tight">Certified</span>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-inter text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.1)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                    Certified · {cert?.date || '2024'}
                  </span>
                  <span className="font-inter text-[12px] text-[#64748b]">Issued by {cert?.issuer || 'SAP SE'}</span>
                </div>
                <h2 className="font-plus-jakarta font-bold text-[32px] md:text-[40px] text-white leading-tight mb-2">
                  {cert?.title || 'SAP Certified Associate'}
                </h2>
                <p className="font-inter text-[20px] text-[#60a5fa] font-medium mb-5">
                  Generative AI Developer
                </p>
                <p className="font-inter text-[16px] text-[#94a3b8] leading-[1.8] max-w-[560px]">
                  Officially certified in developing generative AI solutions within SAP Business Technology Platform — covering LLM integration, prompt engineering, and enterprise AI deployment patterns.
                </p>
                {cert?.link && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer"
                     className="mt-5 inline-flex items-center gap-2 font-inter text-[14px] text-[#60a5fa] hover:text-white transition-colors">
                    View Certificate →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAP COMMUNITY BLOGS ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]" style={SEP} />
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-4">SAP Community</span>
            <h2 className="font-plus-jakarta font-bold text-[36px] text-white mb-2">Technical Blog Posts</h2>
            <p className="font-inter text-[16px] text-[#94a3b8]">Published on the SAP Community — exploring the frontier of enterprise AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((blog, i) => (
              <a key={i} href={blog.url || '#'} target="_blank" rel="noopener noreferrer"
                 className={`${GLASS} p-6 group hover:border-[rgba(96,165,250,0.35)] hover:bg-[rgba(96,165,250,0.04)] transition-all duration-200 flex flex-col gap-4`}>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((t) => (
                    <span key={t.tag} className="font-inter text-[11px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] px-2.5 py-1 rounded-full">{t.tag}</span>
                  ))}
                </div>
                <h3 className="font-plus-jakarta font-semibold text-[16px] text-white group-hover:text-[#60a5fa] transition-colors leading-snug flex-1">{blog.title}</h3>
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.07)]">
                  <span className="font-inter text-[13px] text-[#64748b]">{blog.date}</span>
                  <svg className="text-[#60a5fa] group-hover:translate-x-1 transition-transform duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]" style={SEP} />
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-4">Methodology</span>
            <h2 className="font-plus-jakarta font-bold text-[36px] text-white">{page?.approachTitle || 'My Approach'}</h2>
          </div>
          {page?.approachContent
            ? <RichText content={page.approachContent as any} />
            : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approach.map((s, i) => (
                  <div key={i} className={`${GLASS} p-7 hover:border-[rgba(96,165,250,0.25)] transition-colors duration-200`}>
                    <span className="text-3xl block mb-4">{s.icon}</span>
                    <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-3">{s.title}</h3>
                    <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.75]">{s.description}</p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="backdrop-blur-[16px] bg-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] rounded-[24px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-plus-jakarta font-bold text-[30px] text-white leading-tight">Want to discuss an SAP AI project?</h3>
              <p className="font-inter text-[16px] text-[#94a3b8] mt-2">From scoping to deployment — let's explore what's possible.</p>
            </div>
            <Link href="/contact" className="font-plus-jakarta font-bold text-[15px] text-[#020617] px-8 py-4 rounded-[16px] shrink-0 transition-opacity hover:opacity-90 shadow-[0px_8px_24px_rgba(96,165,250,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              Let's Discuss SAP →
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
