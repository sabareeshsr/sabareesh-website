import RichText from '@/components/RichText'

export interface RichTextBlockData {
  blockType: 'rich-text'
  sectionLabel?: string
  sectionHeading?: string
  content?: object
}

export default function RichTextSection({ data }: { data: RichTextBlockData }) {
  if (!data.content && !data.sectionHeading) return null

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
        {data.content && (
          <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px] p-8 md:p-12">
            <RichText content={data.content as any} />
          </div>
        )}
      </div>
    </section>
  )
}
