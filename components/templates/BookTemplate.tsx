import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'

export interface BookEntry {
  bookTitle?: string
  bookDescription?: object
  coverUrl?: string | null
  amazonLink?: string
  flipkartLink?: string
  otherStoreLink?: string
  aboutTheBook?: object
  fallbackDesc?: string
}

export interface BookTemplateProps {
  heroTitle: string
  heroSubtitle: string
  books: BookEntry[]
  sections?: Array<{ title?: string; content?: object }> | null
  badge?: string
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'
const BTN_GHOST = 'font-plus-jakarta font-bold text-[15px] text-[#60a5fa] px-7 py-3 rounded-[16px] border border-[rgba(96,165,250,0.35)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.08)] transition-all duration-200 inline-flex items-center gap-2'
const BTN_PRIMARY = 'font-plus-jakarta font-bold text-[15px] text-[#020617] px-8 py-4 rounded-[16px] shadow-[0px_8px_24px_rgba(96,165,250,0.3)] transition-opacity hover:opacity-90'

const LINK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
)

const DEFAULT_FEATURES = [
  { icon: '🎭', title: 'Authentic Voice', description: 'Raw, honest storytelling that reflects real experiences and emotions many readers recognise.' },
  { icon: '🌏', title: 'Indian Context', description: 'Stories rooted in the Indian cultural fabric — relationships, ambition, and identity.' },
  { icon: '💡', title: 'Thought-Provoking', description: 'Narratives that linger long after the last page, prompting reflection and conversation.' },
]

function BuyButtons({ amazon, flipkart, other }: { amazon?: string; flipkart?: string; other?: string }) {
  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {amazon && amazon !== '#' ? (
        <a href={amazon} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>{LINK_ICON}Buy on Amazon</a>
      ) : (
        <a href="#" className={BTN_GHOST}>Buy on Amazon</a>
      )}
      {flipkart && flipkart !== '#' ? (
        <a href={flipkart} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>{LINK_ICON}Buy on Flipkart</a>
      ) : (
        <a href="#" className={BTN_GHOST}>Buy on Flipkart</a>
      )}
      {other && (
        <a href={other} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>{LINK_ICON}Other Stores</a>
      )}
    </div>
  )
}

function BookShowcase({ book, index }: { book: BookEntry; index: number }) {
  const isFirst = index === 0
  const title = book.bookTitle || 'Untitled Book'

  return (
    <div className={`${GLASS} p-8 md:p-12 mb-8`}>
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Book cover */}
        <div className="shrink-0 self-center md:self-start">
          <div
            className="relative w-[180px] h-[265px] md:w-[210px] md:h-[310px] rounded-[16px] overflow-hidden shadow-[0px_24px_60px_rgba(37,99,235,0.3)]"
            style={{ background: 'linear-gradient(160deg, rgba(96,165,250,0.15) 0%, rgba(37,99,235,0.08) 100%)' }}
          >
            {book.coverUrl ? (
              <Image src={book.coverUrl} alt={`${title} cover`} fill className="object-cover" sizes="210px" />
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
          <span className="font-inter text-[12px] text-[#94ccff] tracking-[1px] uppercase font-semibold">
            {isFirst ? 'Debut Novel · Fiction' : 'Novel · Fiction'}
          </span>
          <h2 className="font-plus-jakarta font-extrabold text-[38px] md:text-[48px] text-white leading-tight">
            {title}
          </h2>

          {book.bookDescription
            ? <div className="max-w-[520px]"><RichText content={book.bookDescription as any} /></div>
            : <p className="font-inter text-[17px] text-[#94a3b8] leading-[1.8] max-w-[520px]">{book.fallbackDesc || ''}</p>
          }

          <div className="flex flex-wrap gap-3">
            {['Literary Fiction', 'Coming of Age', 'Indian Author'].map((tag) => (
              <span key={tag} className="font-inter text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <BuyButtons amazon={book.amazonLink} flipkart={book.flipkartLink} other={book.otherStoreLink} />
        </div>
      </div>

      {book.aboutTheBook && (
        <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.07)]">
          <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-4">About the Book</h3>
          <RichText content={book.aboutTheBook as any} />
        </div>
      )}
    </div>
  )
}

export default function BookTemplate({ heroTitle, heroSubtitle, books, sections, badge = 'Creative Writing' }: BookTemplateProps) {
  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 55% 60% at 15% 50%, rgba(37,99,235,0.14) 0%, transparent 70%)',
        }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(148,204,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,204,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
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
            <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[560px]">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── BOOKS SHOWCASE ── */}
      <section className="px-6 pb-8">
        <div className="max-w-[1280px] mx-auto">
          {books.map((book, i) => (
            <BookShowcase key={i} book={book} index={i} />
          ))}
        </div>
      </section>

      {/* ── ADDITIONAL SECTIONS ── */}
      <section className="relative px-6 pb-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
             style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }} />
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12 flex flex-col gap-3">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block w-fit">
              About the Book
            </span>
            <h2 className="font-plus-jakarta font-bold text-[36px] text-white">
              What makes it special
            </h2>
          </div>

          {sections?.length ? (
            <div className="flex flex-col gap-10">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.title && (
                    <h3 className="font-plus-jakarta font-bold text-[22px] text-white mb-4">{section.title}</h3>
                  )}
                  {section.content && <RichText content={section.content as any} />}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEFAULT_FEATURES.map((s, i) => (
                <div key={i} className={`${GLASS} p-7 hover:border-[rgba(96,165,250,0.3)] transition-colors duration-200`}>
                  <span className="text-4xl block mb-5">{s.icon}</span>
                  <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-3">{s.title}</h3>
                  <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.7]">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="px-6 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="backdrop-blur-[16px] bg-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] rounded-[24px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-plus-jakarta font-bold text-[30px] text-white leading-tight">
                Interested in collaborating?
              </h3>
              <p className="font-inter text-[16px] text-[#94a3b8] mt-2 max-w-[440px]">
                Book reviews, interviews, co-authoring, or writing workshops — let&apos;s connect.
              </p>
            </div>
            <Link href="/contact"
              className={`${BTN_PRIMARY} shrink-0`}
              style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              Get in Touch →
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
