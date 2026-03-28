export interface SkillsGridBlockData {
  blockType: 'skills-grid'
  sectionLabel?: string
  sectionHeading?: string
  skills?: Array<{
    category: string
    items?: Array<{ item: string }>
  }>
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

export default function SkillsGrid({ data }: { data: SkillsGridBlockData }) {
  if (!data.skills?.length) return null

  return (
    <section className="relative px-6 pb-20">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }}
      />
      <div className="max-w-[1280px] mx-auto">
        {(data.sectionLabel || data.sectionHeading) && (
          <div className="mb-10 flex flex-col gap-3">
            {data.sectionLabel && (
              <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block w-fit">
                {data.sectionLabel}
              </span>
            )}
            {data.sectionHeading && (
              <h2 className="font-plus-jakarta font-bold text-[36px] text-white">{data.sectionHeading}</h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((skill, i) => (
            <div key={i} className={`${GLASS} p-6`}>
              <h3 className="font-plus-jakarta font-bold text-[16px] text-white mb-4">{skill.category}</h3>
              {skill.items && skill.items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((it, j) => (
                    <span key={j} className="font-inter text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                      {it.item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
