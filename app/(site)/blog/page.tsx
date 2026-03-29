export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPage } from '@/lib/getPage'
import BlogClient from './BlogClient'

interface Post {
  id: string; title: string; slug?: string; excerpt?: string
  publishedDate?: string; tags?: Array<{ tag: string }>
  featuredImage?: { url?: string; alt?: string }
}

interface BlogPageDoc {
  heroTitle?: string
  heroSubtitle?: string
  featuredPost?: Post | string | null
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

async function getPosts(): Promise<Post[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      depth: 2,
      limit: 100,
    })
    return docs as Post[]
  } catch { return [] }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<BlogPageDoc>('blog')
  const title = page?.seo?.seoTitle || 'Blog | Sabareesh'
  const description = page?.seo?.seoDescription || 'Articles on SAP, Gen AI, growth marketing, writing, and agentic systems.'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.seo?.ogImage?.url ? [{ url: page.seo.ogImage.url }] : [],
    },
  }
}

export default async function BlogPage() {
  const [posts, blogPage] = await Promise.all([
    getPosts(),
    getPage<BlogPageDoc>('blog'),
  ])

  const heroTitle = blogPage?.heroTitle    || 'Blogs'
  const heroSub   = blogPage?.heroSubtitle || 'Thoughts on SAP, generative AI, growth marketing, creative writing, and the future of work.'

  return (
    <main className="bg-[#020617] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 80% 40%, rgba(74,159,224,0.08) 0%, transparent 65%)',
          ].join(','),
        }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="border-l-4 border-[#2563eb] pl-8">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block mb-5">
              Writing
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] tracking-tight leading-none mb-5">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
                {heroTitle}
              </span>
            </h1>
            <p className="font-inter text-[18px] text-[#94a3b8] leading-[1.75] max-w-[560px]">
              {heroSub}
            </p>
            {posts.length > 0 && (
              <p className="font-inter text-[14px] text-[#64748b] mt-4">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} published
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── BLOG LIST (client: search + filter) ── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto">
          <BlogClient posts={posts} />
        </div>
      </section>

    </main>
  )
}
