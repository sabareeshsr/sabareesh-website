import ContentBlocks, { type ContentBlock } from '@/components/sections/ContentBlocks'

export interface ExpertiseTemplateProps {
  heroTitle: string
  heroSubtitle?: string
  badge?: string
  contentBlocks?: ContentBlock[]
}

export default function ExpertiseTemplate({ heroTitle, heroSubtitle, badge = 'Expertise', contentBlocks }: ExpertiseTemplateProps) {
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

      {/* ── CONTENT BLOCKS ── */}
      <ContentBlocks blocks={contentBlocks} />

    </main>
  )
}
