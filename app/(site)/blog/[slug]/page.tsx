import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'

interface Post {
  id: string; title: string; slug?: string; excerpt?: string
  publishedDate?: string; tags?: Array<{ tag: string }>
  featuredImage?: { url?: string; alt?: string }
  content?: object
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1, depth: 2,
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
      limit: 3, depth: 1,
    })
    return docs as Post[]
  } catch { return [] }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 200, depth: 0,
    })
    return docs.map((p: any) => ({ slug: p.slug ?? p.id }))
  } catch { return [] }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found | Sabareesh' }
  return {
    title: `${post.title} | Sabareesh`,
    description: post.excerpt ?? '',
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      images: post.featuredImage?.url ? [{ url: post.featuredImage.url }] : [],
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

  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }} />
        <div className="max-w-[860px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/blog" className="font-inter text-[14px] text-[#64748b] hover:text-[#60a5fa] transition-colors">
              Blog
            </Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#334155]"><path d="M9 18l6-6-6-6"/></svg>
            <span className="font-inter text-[14px] text-[#94a3b8] truncate max-w-[300px]">{post.title}</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <span key={tag} className="font-inter text-[12px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] border border-[rgba(148,204,255,0.2)] px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-plus-jakarta font-extrabold text-[36px] md:text-[52px] text-white tracking-tight leading-[1.1] mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#64748b]">
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                   style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }}>S</div>
              <span className="font-inter text-white">Sabareesh</span>
            </div>
            {date && <span>{date}</span>}
          </div>
        </div>
      </section>

      {/* ── FEATURED IMAGE ── */}
      {post.featuredImage?.url && (
        <section className="px-6 pb-12">
          <div className="max-w-[860px] mx-auto">
            <div className="relative h-[300px] md:h-[460px] rounded-[24px] overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt ?? post.title}
                fill className="object-cover"
                priority sizes="860px"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CONTENT ── */}
      <section className="px-6 pb-20">
        <div className="max-w-[860px] mx-auto">
          {post.content
            ? <RichText content={post.content as any} />
            : (
              <div className={`${GLASS} p-10 text-center`}>
                <p className="text-4xl mb-4">📝</p>
                <p className="font-inter text-[16px] text-[#64748b]">Content coming soon.</p>
              </div>
            )
          }
        </div>
      </section>

      {/* ── RELATED POSTS ── */}
      {related.length > 0 && (
        <section className="relative px-6 pb-24">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
               style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }} />
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-plus-jakarta font-bold text-[28px] text-white mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug ?? p.id}`}
                      className={`${GLASS} p-5 group hover:border-[rgba(96,165,250,0.35)] transition-all duration-200`}>
                  {p.tags?.[0] && (
                    <span className="font-inter text-[11px] text-[#94ccff] bg-[rgba(148,204,255,0.08)] px-2.5 py-1 rounded-full inline-block mb-3">
                      {p.tags[0].tag}
                    </span>
                  )}
                  <h3 className="font-plus-jakarta font-bold text-[16px] text-white group-hover:text-[#60a5fa] transition-colors leading-snug mb-3">
                    {p.title}
                  </h3>
                  <span className="font-inter text-[13px] text-[#60a5fa] flex items-center gap-1">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BACK LINK ── */}
      <div className="px-6 pb-16">
        <div className="max-w-[860px] mx-auto">
          <Link href="/blog" className="font-plus-jakarta font-semibold text-[15px] text-[#60a5fa] border border-[rgba(96,165,250,0.3)] px-6 py-3 rounded-[12px] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.06)] transition-all inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>
        </div>
      </div>

    </main>
  )
}
