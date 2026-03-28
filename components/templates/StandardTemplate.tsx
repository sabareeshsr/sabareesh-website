import RichText from '@/components/RichText'
import FeatureTilesSection, { type FeatureTilesSectionBlock } from '@/components/sections/FeatureTilesSection'

export interface StandardTemplateProps {
  heroTitle: string
  heroSubtitle?: string
  badge?: string
  aboutTitle?: string
  body?: object | null
  achievements?: Array<{ label: string; icon?: string }>
  stats?: Array<{ value: string; label?: string }>
  pageSections?: FeatureTilesSectionBlock[]
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

export default function StandardTemplate({
  heroTitle,
  heroSubtitle,
  badge = 'Page',
  aboutTitle,
  body,
  achievements,
  stats,
  pageSections,
}: StandardTemplateProps) {
  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 80% 40%, rgba(74,159,224,0.07) 0%, transparent 65%)',
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
              <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[560px]">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── PAGE SECTIONS (CMS blocks) ── */}
      {pageSections?.map((section, i) => {
        if (section.blockType === 'feature-tiles') {
          return (
            <FeatureTilesSection
              key={i}
              sectionLabel={section.sectionLabel}
              sectionHeading={section.sectionHeading}
              tiles={section.tiles || []}
            />
          )
        }
        return null
      })}

      {/* ── BODY CONTENT ── */}
      {(body || aboutTitle) && (
        <section className="relative px-6 pb-20">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
               style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }} />
          <div className="max-w-[1280px] mx-auto">
            {aboutTitle && (
              <h2 className="font-plus-jakarta font-bold text-[36px] text-white mb-8">{aboutTitle}</h2>
            )}
            {body && (
              <div className={`${GLASS} p-8 md:p-12`}>
                <RichText content={body as any} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── ACHIEVEMENTS ── */}
      {achievements?.length ? (
        <section className="px-6 pb-16">
          <div className="max-w-[1280px] mx-auto flex flex-wrap gap-3">
            {achievements.map((a, i) => (
              <span key={i} className="font-inter text-[13px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-4 py-2 rounded-full">
                {a.icon && <span className="mr-1.5">{a.icon}</span>}{a.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── STATS ── */}
      {stats?.length ? (
        <section className="px-6 pb-24">
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className={`${GLASS} p-6 text-center`}>
                <p className="font-plus-jakarta font-extrabold text-[40px] bg-clip-text text-transparent"
                   style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                  {s.value}
                </p>
                {s.label && <p className="font-inter text-[13px] text-[#64748b] uppercase tracking-wide mt-1">{s.label}</p>}
              </div>
            ))}
          </div>
        </section>
      ) : null}

    </main>
  )
}
