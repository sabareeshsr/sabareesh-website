import Image from 'next/image'
import RichText from '@/components/RichText'

export interface ExperienceBlockData {
  blockType: 'experience'
  sectionLabel?: string
  sectionHeading?: string
  experiences?: Array<{
    company: string
    role?: string
    duration?: string
    description?: object
    logo?: { url?: string; filename?: string } | null
  }>
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

function resolveUrl(img: { url?: string; filename?: string } | null | undefined): string | null {
  if (!img) return null
  if (img.url) return img.url
  if (img.filename) return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/media/file/${img.filename}`
  return null
}

export default function ExperienceSection({ data }: { data: ExperienceBlockData }) {
  if (!data.experiences?.length) return null

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

        <div className="flex flex-col gap-6">
          {data.experiences.map((exp, i) => {
            const logoUrl = resolveUrl(exp.logo)
            return (
              <div key={i} className={`${GLASS} p-7 flex gap-6 items-start`}>
                {logoUrl && (
                  <div className="shrink-0 w-14 h-14 rounded-[12px] overflow-hidden bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                    <Image src={logoUrl} alt={exp.company} width={56} height={56} className="object-contain" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-plus-jakarta font-bold text-[18px] text-white">{exp.company}</h3>
                      {exp.role && (
                        <p className="font-inter text-[14px] text-[#60a5fa] mt-0.5">{exp.role}</p>
                      )}
                    </div>
                    {exp.duration && (
                      <span className="font-inter text-[12px] text-[#64748b] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full shrink-0">
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <div className="mt-3 font-inter text-[14px] text-[#94a3b8] leading-[1.7]">
                      <RichText content={exp.description as any} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
