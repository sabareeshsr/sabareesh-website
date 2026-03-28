export interface ExpertiseCard {
  icon?: string
  title: string
  description?: string
}

export interface Project {
  icon?: string
  title: string
  description?: string
  status?: 'Live' | 'Beta' | 'WIP'
  tags?: Array<{ tag: string }>
  link?: string
}

export interface ExpertiseTemplateProps {
  heroTitle: string
  heroSubtitle?: string
  badge?: string
  expertiseCards?: ExpertiseCard[]
  projects?: Project[]
  services?: ExpertiseCard[]
  toolStack?: Array<{ tool: string }>
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

const STATUS_COLORS: Record<string, string> = {
  Live:  'text-[#4ade80] bg-[rgba(74,222,128,0.1)] border-[rgba(74,222,128,0.3)]',
  Beta:  'text-[#60a5fa] bg-[rgba(96,165,250,0.1)] border-[rgba(96,165,250,0.3)]',
  WIP:   'text-[#f59e0b] bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]',
}

export default function ExpertiseTemplate({
  heroTitle,
  heroSubtitle,
  badge = 'Expertise',
  expertiseCards,
  projects,
  services,
  toolStack,
}: ExpertiseTemplateProps) {
  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 50% 60% at 10% 50%, rgba(37,99,235,0.14) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 90% 30%, rgba(74,159,224,0.08) 0%, transparent 65%)',
          ].join(','),
        }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="border-l-4 border-[#2563eb] pl-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-5">
              {badge}
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-[56px] md:text-[72px] tracking-tight leading-none mb-5">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                {heroTitle}
              </span>
            </h1>
            {heroSubtitle && (
              <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[580px]">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── EXPERTISE CARDS ── */}
      {expertiseCards?.length ? (
        <section className="px-6 pb-20">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertiseCards.map((card, i) => (
                <div key={i} className={`${GLASS} p-7 hover:border-[rgba(96,165,250,0.3)] transition-colors duration-200`}>
                  {card.icon && <span className="text-4xl block mb-5">{card.icon}</span>}
                  <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-3">{card.title}</h3>
                  {card.description && <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.7]">{card.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── PROJECTS ── */}
      {projects?.length ? (
        <section className="relative px-6 pb-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
               style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }} />
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-10 flex flex-col gap-3">
              <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block w-fit">
                Projects
              </span>
              <h2 className="font-plus-jakarta font-bold text-[36px] text-white">Built &amp; shipped</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p, i) => (
                <div key={i} className={`${GLASS} p-7 flex flex-col gap-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {p.icon && <span className="text-2xl">{p.icon}</span>}
                      <h3 className="font-plus-jakarta font-bold text-[18px] text-white">{p.title}</h3>
                    </div>
                    {p.status && (
                      <span className={`font-inter text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_COLORS[p.status] || STATUS_COLORS.WIP}`}>
                        {p.status}
                      </span>
                    )}
                  </div>
                  {p.description && <p className="font-inter text-[14px] text-[#94a3b8] leading-[1.7]">{p.description}</p>}
                  {p.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t, j) => (
                        <span key={j} className="font-inter text-[11px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-2.5 py-1 rounded-full">
                          {t.tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                       className="font-inter text-[13px] text-[#60a5fa] hover:underline mt-auto inline-flex items-center gap-1.5">
                      View project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── SERVICES ── */}
      {services?.length ? (
        <section className="px-6 pb-20">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-10 flex flex-col gap-3">
              <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block w-fit">
                Services
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s, i) => (
                <div key={i} className={`${GLASS} p-6`}>
                  <h3 className="font-plus-jakarta font-bold text-[18px] text-white mb-2">{s.title}</h3>
                  {s.description && <p className="font-inter text-[14px] text-[#94a3b8] leading-[1.7]">{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── TOOL STACK ── */}
      {toolStack?.length ? (
        <section className="px-6 pb-24">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-plus-jakarta font-bold text-[24px] text-white mb-6">Tools &amp; Stack</h2>
            <div className="flex flex-wrap gap-3">
              {toolStack.map((t, i) => (
                <span key={i} className="font-inter text-[13px] text-[#94a3b8] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] px-4 py-2 rounded-full">
                  {t.tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

    </main>
  )
}
