export interface ProjectsGridBlockData {
  blockType: 'projects-grid'
  sectionLabel?: string
  sectionHeading?: string
  projects?: Array<{
    title: string
    description?: string
    tags?: Array<{ tag: string }>
    link?: string
    image?: { url?: string; filename?: string } | null
  }>
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

function resolveUrl(img: { url?: string; filename?: string } | null | undefined): string | null {
  if (!img) return null
  if (img.url) return img.url
  if (img.filename) return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/media/file/${img.filename}`
  return null
}

export default function ProjectsGrid({ data }: { data: ProjectsGridBlockData }) {
  if (!data.projects?.length) return null

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.projects.map((project, i) => {
            const imgUrl = resolveUrl(project.image)
            return (
              <div key={i} className={`${GLASS} flex flex-col overflow-hidden hover:border-[rgba(96,165,250,0.3)] transition-colors duration-200`}>
                {imgUrl && (
                  <div className="relative h-[180px] w-full bg-[rgba(255,255,255,0.03)]">
                    <img src={imgUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="font-plus-jakarta font-bold text-[18px] text-white">{project.title}</h3>
                  {project.description && (
                    <p className="font-inter text-[14px] text-[#94a3b8] leading-[1.7]">{project.description}</p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {project.tags.map((t, j) => (
                        <span key={j} className="font-inter text-[11px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-2.5 py-1 rounded-full">
                          {t.tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                       className="font-inter text-[13px] text-[#60a5fa] hover:underline inline-flex items-center gap-1.5 mt-1">
                      View project →
                    </a>
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
