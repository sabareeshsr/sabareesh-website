export interface CertificationsBlockData {
  blockType: 'certifications'
  sectionLabel?: string
  sectionHeading?: string
  certifications?: Array<{
    title: string
    issuer?: string
    date?: string
    badgeImage?: { url?: string; filename?: string } | null
    link?: string
  }>
}

import CMSImage from '@/components/CMSImage'
import { getImageUrl } from '@/lib/getImageUrl'

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

export default function Certifications({ data }: { data: CertificationsBlockData }) {
  if (!data.certifications?.length) return null

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
          {data.certifications.map((cert, i) => {
            const badgeUrl = getImageUrl(cert.badgeImage)
            const inner = (
              <div key={i} className={`${GLASS} p-6 flex gap-4 items-start hover:border-[rgba(96,165,250,0.3)] transition-colors duration-200`}>
                {badgeUrl && (
                  <div className="shrink-0 w-12 h-12 rounded-[10px] overflow-hidden bg-white/5">
                    <CMSImage image={cert.badgeImage} alt={cert.title} width={48} height={48} className="object-contain" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-plus-jakarta font-bold text-[15px] text-white leading-snug">{cert.title}</p>
                  {cert.issuer && (
                    <p className="font-inter text-[13px] text-[#60a5fa] mt-0.5">{cert.issuer}</p>
                  )}
                  {cert.date && (
                    <p className="font-inter text-[12px] text-[#64748b] mt-1">{cert.date}</p>
                  )}
                </div>
              </div>
            )
            return cert.link ? (
              <a key={i} href={cert.link} target="_blank" rel="noopener noreferrer" className="block">
                {inner}
              </a>
            ) : inner
          })}
        </div>
      </div>
    </section>
  )
}
