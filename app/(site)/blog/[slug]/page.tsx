export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
import CMSImage from '@/components/CMSImage'
import BlogShare from '@/components/BlogShare'
import { getImageUrl } from '@/lib/getImageUrl'

interface Post {
  id: string; title: string; slug?: string; excerpt?: string
  publishedDate?: string; tags?: Array<{ tag: string }>
  featuredImage?: { url?: string; filename?: string; alt?: string }
  content?: object
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1, depth: 3,
    })
    return (docs[0] as Post) ?? null
  } catch { return null }
}

async function getRelatedPosts(currentId: string, tags: string[]): Promise<Post[]> {
  if (!tags.length) return []
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: currentId } },
        ],
      },
      limit: 3, depth: 2,
    })
    return docs as Post[]
  } catch { return [] }
}

export async function generateStaticParams() { return [] }

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found | Sabareesh' }
  const imgUrl = getImageUrl(post.featuredImage)
  return {
    title: `${post.title} | Sabareesh`,
    description: post.excerpt ?? '',
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      images: imgUrl ? [{ url: imgUrl }] : [],
    },
  }
}

function formatDate(str?: string): string {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const tags    = post.tags?.map((t) => t.tag) ?? []
  const related = await getRelatedPosts(post.id, tags)
  const date    = formatDate(post.publishedDate)
  const featuredUrl = getImageUrl(post.featuredImage)
  const shareUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://sabareesh.com'}/blog/${slug}`

  return (
    <article className="bg-[#020617] min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }} />
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 relative z-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Link href="/blog" className="font-inter text-[13px] sm:text-[14px] text-[#64748b] hover:text-[#60a5fa] transition-colors">
              Blog
            </Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#334155] shrink-0"><path d="M9 18l6-6-6-6"/></svg>
            <span className="font-inter text-[13px] sm:text-[14px] text-[#94a3b8] truncate">{post.title}</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
              {tags.map((tag) => (
                <span key={tag} className="font-inter text-[11px] sm:text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-plus-jakarta font-extrabold text-[26px] sm:text-[36px] md:text-[48px] lg:text-[52px] text-white tracking-tight leading-[1.15] mb-5 sm:mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-[13px] sm:text-[14px] text-[#64748b] mb-6 sm:mb-8">
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-3 sm:px-4 py-1.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-white shrink-0"
                   style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }}>S</div>
              <span className="font-inter text-white text-[13px]">Sabareesh</span>
            </div>
            {date && <span>{date}</span>}
          </div>

          {/* Share row */}
          <BlogShare title={post.title} url={shareUrl} />
        </div>
      </section>

      {/* ── FEATURED IMAGE ── */}
      {featuredUrl && (
        <section className="px-4 sm:px-6 pb-8 sm:pb-12">
          <div className="max-w-[860px] mx-auto">
            <div className="relative h-[200px] sm:h-[320px] md:h-[460px] rounded-[20px] sm:rounded-[24px] overflow-hidden">
              <CMSImage
                image={post.featuredImage}
                alt={post.featuredImage?.alt ?? post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CONTENT ── */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="max-w-[860px] mx-auto">
          {post.content
            ? (
              <div className="prose prose-invert prose-headings:text-white prose-p:text-[#94a3b8] prose-a:text-[#60a5fa] prose-strong:text-white prose-code:text-[#94ccff] prose-img:rounded-2xl prose-img:w-full prose-blockquote:border-[#2563eb] prose-blockquote:text-[#64748b] max-w-none">
                <RichText content={post.content as any} />
              </div>
            ) : (
              <div className={`${GLASS} p-10 text-center`}>
                <p className="text-4xl mb-4">📝</p>
                <p className="font-inter text-[16px] text-[#64748b]">Content coming soon.</p>
              </div>
            )
          }
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
        <div className="h-[1px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }} />
      </div>

      {/* ── SHARE (bottom) ── */}
      <section className="px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="max-w-[860px] mx-auto">
          <BlogShare title={post.title} url={shareUrl} />
        </div>
      </section>

      {/* ── RELATED POSTS ── */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-plus-jakarta font-bold text-[22px] sm:text-[28px] text-white mb-6 sm:mb-8">More Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug ?? p.id}`}
                      className={`${GLASS} p-5 group hover:border-[rgba(96,165,250,0.35)] transition-all duration-200`}>
                  {p.tags?.[0] && (
                    <span className="font-inter text-[11px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] px-2.5 py-1 rounded-full inline-block mb-3">
                      {p.tags[0].tag}
                    </span>
                  )}
                  <h3 className="font-plus-jakarta font-bold text-[15px] sm:text-[16px] text-white group-hover:text-[#60a5fa] transition-colors leading-snug mb-3">
                    {p.title}
                  </h3>
                  <span className="font-inter text-[13px] text-[#60a5fa] flex items-center gap-1">Read →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BACK LINK ── */}
      <div className="px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="max-w-[860px] mx-auto">
          <Link href="/blog" className="font-plus-jakarta font-semibold text-[14px] sm:text-[15px] text-[#60a5fa] border border-[rgba(96,165,250,0.3)] px-5 sm:px-6 py-2.5 sm:py-3 rounded-[12px] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.06)] transition-all inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>
        </div>
      </div>

    </article>
  )
}
