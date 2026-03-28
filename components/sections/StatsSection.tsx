export interface StatsBlockData {
  blockType: 'stats'
  sectionLabel?: string
  stats?: Array<{ value: string; label?: string }>
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

export default function StatsSection({ data }: { data: StatsBlockData }) {
  if (!data.stats?.length) return null

  return (
    <section className="relative px-6 pb-20">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }}
      />
      <div className="max-w-[1280px] mx-auto">
        {data.sectionLabel && (
          <div className="mb-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block w-fit">
              {data.sectionLabel}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.stats.map((s, i) => (
            <div key={i} className={`${GLASS} p-6 text-center`}>
              <p
                className="font-plus-jakarta font-extrabold text-[40px] bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}
              >
                {s.value}
              </p>
              {s.label && (
                <p className="font-inter text-[13px] text-[#64748b] uppercase tracking-wide mt-1">{s.label}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
