import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { getPage } from '@/lib/getPage'

/* ─── Payload field types ─── */
interface WriterPage {
  heroTitle?: string
  heroSubtitle?: string
  bookTitle?: string
  bookDescription?: object
  bookCover?: { url?: string; filename?: string; alt?: string } | null
  amazonLink?: string
  flipkartLink?: string
  otherStoreLink?: string
  writerSections?: Array<{ title?: string; content?: object }>
}

/* ─── Fallback content ─── */
const FB = {
  heroTitle: 'Writer',
  heroSubtitle: 'Stories that move people. Books that shape minds.',
  bookTitle: 'Five Days Forever',
  bookDesc:
    'A coming-of-age story set against the backdrop of modern India — five days that rewrite a lifetime. Part love story, part identity quest, this debut novel explores what happens when ambition and emotion collide.',
  amazonLink: '#',
  flipkartLink: '#',
  features: [
    { icon: '🎭', title: 'Authentic Voice', description: 'Raw, honest storytelling that reflects real experiences and emotions many readers recognise.' },
    { icon: '🌏', title: 'Indian Context', description: 'Stories rooted in the Indian cultural fabric — relationships, ambition, and identity.' },
    { icon: '💡', title: 'Thought-Provoking', description: 'Narratives that linger long after the last page, prompting reflection and conversation.' },
  ],
}

/* ─── Design tokens ─── */
const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'
const BTN_GHOST = 'font-plus-jakarta font-bold text-[15px] text-[#60a5fa] px-7 py-3 rounded-[16px] border border-[rgba(96,165,250,0.35)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.08)] transition-all duration-200 inline-flex items-center gap-2'
const BTN_PRIMARY = 'font-plus-jakarta font-bold text-[15px] text-[#020617] px-8 py-4 rounded-[16px] shadow-[0px_8px_24px_rgba(96,165,250,0.3)] transition-opacity hover:opacity-90'

export default async function WriterPage() {
  const page = await getPage<WriterPage>('writer')

  const heroTitle  = page?.heroTitle   || FB.heroTitle
  const heroSub    = page?.heroSubtitle || FB.heroSubtitle
  const bookTitle  = page?.bookTitle   || FB.bookTitle
  const amazonLink = page?.amazonLink  || FB.amazonLink
  const flipkartLink = page?.flipkartLink || FB.flipkartLink
  const serverUrl  = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const coverUrl   = page?.bookCover?.url
    || (page?.bookCover?.filename ? `${serverUrl}/media/${page.bookCover.filename}` : null)

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
              Creative Writing
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-[56px] md:text-[72px] tracking-tight leading-none mb-5">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                {heroTitle}
              </span>
            </h1>
            <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[560px]">
              {heroSub}
            </p>
          </div>
        </div>
      </section>

      {/* ── BOOK SHOWCASE ── */}
      <section className="px-6 pb-20">
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
                    <Image src={coverUrl} alt={page?.bookCover?.alt || `${bookTitle} cover`} fill className="object-cover" sizes="210px" />
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
                  Debut Novel · Fiction
                </span>
                <h2 className="font-plus-jakarta font-extrabold text-[38px] md:text-[48px] text-white leading-tight">
                  {bookTitle}
                </h2>

                {/* Book description — rich text from CMS or text fallback */}
                {page?.bookDescription
                  ? <div className="max-w-[520px]"><RichText content={page.bookDescription as any} /></div>
                  : <p className="font-inter text-[17px] text-[#94a3b8] leading-[1.8] max-w-[520px]">{FB.bookDesc}</p>
                }

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  {['Literary Fiction', 'Coming of Age', 'Indian Author'].map((tag) => (
                    <span key={tag} className="font-inter text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Buy buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {amazonLink && amazonLink !== '#' && (
                    <a href={amazonLink} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                      Buy on Amazon
                    </a>
                  )}
                  {flipkartLink && flipkartLink !== '#' && (
                    <a href={flipkartLink} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                      Buy on Flipkart
                    </a>
                  )}
                  {page?.otherStoreLink && (
                    <a href={page.otherStoreLink} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                      Other Stores
                    </a>
                  )}
                  {/* Fallback buttons when no CMS links */}
                  {!amazonLink || amazonLink === '#' ? (
                    <a href="#" className={BTN_GHOST}>Buy on Amazon</a>
                  ) : null}
                  {!flipkartLink || flipkartLink === '#' ? (
                    <a href="#" className={BTN_GHOST}>Buy on Flipkart</a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT THE BOOK / WRITER SECTIONS ── */}
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

          {page?.writerSections?.length ? (
            <div className="flex flex-col gap-10">
              {page.writerSections.map((section, i) => (
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
              {FB.features.map((s, i) => (
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
                Book reviews, interviews, co-authoring, or writing workshops — let's connect.
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
