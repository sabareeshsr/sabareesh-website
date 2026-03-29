import RichText from '@/components/RichText'
import CMSImage from '@/components/CMSImage'
import { getImageUrl } from '@/lib/getImageUrl'

export interface BookShowcaseBlockData {
  blockType: 'book-showcase'
  bookTitle?: string
  bookCover?: { url?: string; filename?: string } | null
  bookCategory?: string
  bookDescription?: object
  genres?: Array<{ genre: string }>
  amazonLink?: string
  flipkartLink?: string
  otherStoreLink?: string
  aboutTitle?: string
  aboutContent?: object
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'
const BTN_GHOST = 'font-plus-jakarta font-bold text-[15px] text-[#60a5fa] px-7 py-3 rounded-[16px] border border-[rgba(96,165,250,0.35)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.08)] transition-all duration-200 inline-flex items-center gap-2'

const LINK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
)

export default function BookShowcase({ data }: { data: BookShowcaseBlockData }) {
  const title = data.bookTitle || 'Untitled Book'
  const coverUrl = getImageUrl(data.bookCover)

  return (
    <section className="px-6 pb-8">
      <div className="max-w-[1280px] mx-auto">
        <div className={`${GLASS} p-8 md:p-12`}>
          <div className="flex flex-col md:flex-row gap-10 items-start">

            {/* Book cover */}
            <div className="shrink-0 self-center md:self-start">
              <div
                className="relative w-[180px] h-[265px] md:w-[210px] md:h-[310px] rounded-[16px] overflow-hidden shadow-[0px_24px_60px_rgba(37,99,235,0.3)]"
                style={{ background: 'linear-gradient(160deg, rgba(96,165,250,0.15) 0%, rgba(37,99,235,0.08) 100%)' }}
              >
                {coverUrl ? (
                  <CMSImage image={data.bookCover} alt={`${title} cover`} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-[rgba(96,165,250,0.2)] rounded-[16px]">
                    <span className="text-5xl">📖</span>
                    <span className="font-inter text-[10px] text-[#64748b] uppercase tracking-widest">Cover Art</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-5">
              {data.bookCategory && (
                <span className="font-inter text-[12px] text-[#94ccff] tracking-[1px] uppercase font-semibold">
                  {data.bookCategory}
                </span>
              )}
              <h2 className="font-plus-jakarta font-extrabold text-[38px] md:text-[48px] text-white leading-tight">
                {title}
              </h2>

              {data.bookDescription
                ? <div className="max-w-[520px]"><RichText content={data.bookDescription as any} /></div>
                : null
              }

              {data.genres && data.genres.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {data.genres.map((g, i) => (
                    <span key={i} className="font-inter text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                      {g.genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-2">
                {data.amazonLink && (
                  <a href={data.amazonLink} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                    {LINK_ICON}Buy on Amazon
                  </a>
                )}
                {data.flipkartLink && (
                  <a href={data.flipkartLink} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                    {LINK_ICON}Buy on Flipkart
                  </a>
                )}
                {data.otherStoreLink && (
                  <a href={data.otherStoreLink} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                    {LINK_ICON}Other Stores
                  </a>
                )}
              </div>
            </div>
          </div>

          {(data.aboutTitle || data.aboutContent) && (
            <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.07)]">
              {data.aboutTitle && (
                <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-4">{data.aboutTitle}</h3>
              )}
              {data.aboutContent && <RichText content={data.aboutContent as any} />}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
