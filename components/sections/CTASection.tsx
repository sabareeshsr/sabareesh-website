export interface CTABlockData {
  blockType: 'cta'
  heading?: string
  subtext?: string
  buttons?: Array<{ label: string; url?: string; style?: 'primary' | 'ghost' }>
}

const BTN_PRIMARY = 'font-plus-jakarta font-bold text-[15px] text-[#020617] px-8 py-4 rounded-[16px] shadow-[0px_8px_24px_rgba(96,165,250,0.3)] transition-opacity hover:opacity-90 shrink-0'
const BTN_GHOST = 'font-plus-jakarta font-bold text-[15px] text-[#60a5fa] px-7 py-3 rounded-[16px] border border-[rgba(96,165,250,0.35)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.08)] transition-all duration-200 shrink-0'

export default function CTASection({ data }: { data: CTABlockData }) {
  if (!data.heading && !data.buttons?.length) return null

  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1280px] mx-auto">
        <div className="backdrop-blur-[16px] bg-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] rounded-[24px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            {data.heading && (
              <h3 className="font-plus-jakarta font-bold text-[30px] text-white leading-tight">
                {data.heading}
              </h3>
            )}
            {data.subtext && (
              <p className="font-inter text-[16px] text-[#94a3b8] mt-2 max-w-[440px]">{data.subtext}</p>
            )}
          </div>
          {data.buttons && data.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {data.buttons.map((btn, i) => (
                btn.style === 'ghost' ? (
                  <a key={i} href={btn.url || '#'} className={BTN_GHOST}>{btn.label}</a>
                ) : (
                  <a
                    key={i}
                    href={btn.url || '#'}
                    className={BTN_PRIMARY}
                    style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}
                  >
                    {btn.label} →
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
