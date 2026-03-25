import type { Metadata } from 'next'
import Link from 'next/link'
import { getPage } from '@/lib/getPage'

/* ─── Payload field types ─── */
interface ExpertiseCard { icon?: string; title?: string; description?: string }
interface AIProject {
  icon?: string; title?: string; description?: string
  status?: 'Live' | 'Beta' | 'WIP'; tags?: Array<{ tag: string }>; link?: string
}
interface ToolItem { tool?: string }

interface AgenticAIPage {
  heroTitle?: string; heroSubtitle?: string
  expertise?: ExpertiseCard[]
  aiProjects?: AIProject[]
  services?: Array<{ title?: string; description?: string }>
  toolStack?: ToolItem[]
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<AgenticAIPage>('agentic-ai')
  const title = page?.seo?.seoTitle || 'Agentic AI | Sabareesh'
  const description = page?.seo?.seoDescription || 'Building autonomous AI systems that think, plan, and act — turning complex workflows into self-driving pipelines.'
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
const FB_EXPERTISE: ExpertiseCard[] = [
  { icon: '🔍', title: 'RAG Systems', description: 'Retrieval-Augmented Generation pipelines that ground LLMs in proprietary data — vector databases, chunking strategies, and re-ranking for precision.' },
  { icon: '🎵', title: 'Vibe Coding', description: 'AI-assisted software development where natural language drives the build loop — prompt-first engineering with Claude, GPT-4, and Cursor.' },
  { icon: '🎨', title: 'Vibe Designing', description: 'AI-native design workflows: generating UI prototypes, iterating on brand assets, and shipping polished visuals at 10× speed with Figma AI + Midjourney.' },
  { icon: '🏢', title: 'Enterprise AI Solutions', description: 'End-to-end AI roadmaps for mid-to-large organisations — from use-case identification and build-vs-buy decisions to change management and ROI measurement.' },
]

const FB_PROJECTS: AIProject[] = [
  { icon: '🤖', title: 'SAP BTP AI Agent', status: 'Live', description: 'Autonomous agent that handles SAP S/4HANA queries via natural language — connected to procurement, finance, and HR modules.' },
  { icon: '📚', title: 'Knowledge RAG Pipeline', status: 'Live', description: 'Enterprise knowledge base with semantic search — ingests PDFs, Confluence pages, and Notion docs; returns precise answers with source citations.' },
  { icon: '✍️', title: 'Content Automation Engine', status: 'Live', description: 'Multi-agent content workflow: research agent → writer agent → editor agent. Produces publication-ready blog posts from a single keyword prompt.' },
  { icon: '🔎', title: 'AI Market Research Tool', status: 'Beta', description: 'Agentic system that monitors industry trends, competitor moves, and analyst reports — delivers weekly structured intelligence briefings.' },
]

const FB_TOOLS = ['LangChain', 'LangGraph', 'OpenAI API', 'Anthropic Claude', 'Pinecone', 'Chroma', 'SAP AI Core', 'Cursor', 'n8n', 'Zapier', 'Vercel AI SDK', 'Python', 'TypeScript']

/* ─── Design tokens ─── */
const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'
const SEP = { background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }
const STATUS_STYLE: Record<string, string> = {
  Live: 'text-[#4ade80] bg-[rgba(74,222,128,0.08)] border-[rgba(74,222,128,0.2)]',
  Beta: 'text-[#fbbf24] bg-[rgba(251,191,36,0.08)] border-[rgba(251,191,36,0.2)]',
  WIP:  'text-[#94a3b8] bg-[rgba(148,163,184,0.08)] border-[rgba(148,163,184,0.2)]',
}

export default async function AgenticAIPage() {
  const page = await getPage<AgenticAIPage>('agentic-ai')

  const heroTitle = page?.heroTitle    || 'Agentic AI'
  const heroSub   = page?.heroSubtitle || 'Building autonomous AI systems that think, plan, and act — turning complex workflows into self-driving pipelines.'
  const expertise = page?.expertise?.length   ? page.expertise   : FB_EXPERTISE
  const projects  = page?.aiProjects?.length  ? page.aiProjects  : FB_PROJECTS
  const tools     = page?.toolStack?.length   ? page.toolStack.map((t) => t.tool || '').filter(Boolean) : FB_TOOLS

  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(37,99,235,0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 85% 70%, rgba(74,159,224,0.08) 0%, transparent 65%)',
          ].join(','),
        }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(148,204,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,204,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="border-l-4 border-[#2563eb] pl-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-5">
              AI Automation
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

      {/* ── EXPERTISE CARDS ── */}
      <section className="px-6 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-4">Expertise</span>
            <h2 className="font-plus-jakarta font-bold text-[36px] text-white">What I Build</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((s, i) => (
              <div key={i} className={`${GLASS} p-8 hover:border-[rgba(96,165,250,0.3)] hover:bg-[rgba(96,165,250,0.03)] transition-all duration-200 group`}>
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl"
                       style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(37,99,235,0.15))', border: '1px solid rgba(96,165,250,0.2)' }}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-plus-jakarta font-bold text-[22px] text-white mb-3 group-hover:text-[#60a5fa] transition-colors">
                      {s.title}
                    </h3>
                    <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.75]">{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]" style={SEP} />
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-4">Portfolio</span>
            <h2 className="font-plus-jakarta font-bold text-[36px] text-white">AI Projects &amp; Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <div key={i} className={`${GLASS} p-7 hover:border-[rgba(96,165,250,0.25)] transition-colors duration-200`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl shrink-0"
                       style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(37,99,235,0.15))', border: '1px solid rgba(96,165,250,0.15)' }}>
                    {p.icon}
                  </div>
                  {p.status && (
                    <span className={`font-inter text-[11px] font-semibold px-2.5 py-1 rounded-full border tracking-wide ${STATUS_STYLE[p.status] || STATUS_STYLE.WIP}`}>
                      {p.status}
                    </span>
                  )}
                </div>
                <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-3">{p.title}</h3>
                <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.7]">{p.description}</p>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                     className="mt-4 inline-flex items-center gap-1.5 font-inter text-[13px] text-[#60a5fa] hover:text-white transition-colors">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS STRIP ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]" style={SEP} />
        <div className="max-w-[1280px] mx-auto">
          <p className="font-inter font-semibold text-[13px] text-[#64748b] tracking-[1px] uppercase mb-6">Tools &amp; Stack</p>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool) => (
              <span key={tool} className="font-inter text-[13px] text-[#c0c7d1] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-4 py-2 rounded-[10px]">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="backdrop-blur-[16px] bg-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] rounded-[24px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-plus-jakarta font-bold text-[30px] text-white leading-tight">Have an AI automation idea?</h3>
              <p className="font-inter text-[16px] text-[#94a3b8] mt-2">Let's scope it, prototype it, and ship it — fast.</p>
            </div>
            <Link href="/contact" className="font-plus-jakarta font-bold text-[15px] text-[#020617] px-8 py-4 rounded-[16px] shrink-0 transition-opacity hover:opacity-90 shadow-[0px_8px_24px_rgba(96,165,250,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              Build with Me →
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
