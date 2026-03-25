'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug?: string
  excerpt?: string
  publishedDate?: string
  tags?: Array<{ tag: string }>
  featuredImage?: { url?: string; alt?: string }
  readTime?: number
}

function estimateReadTime(excerpt: string | undefined): number {
  const words = (excerpt ?? '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const GLASS = 'backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]'

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  /* Collect all unique tags */
  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t.tag)))
    return Array.from(set).sort()
  }, [posts])

  /* Filter by search + tag */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((p) => {
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? '').toLowerCase().includes(q)
      const matchTag    = !activeTag || p.tags?.some((t) => t.tag === activeTag)
      return matchSearch && matchTag
    })
  }, [posts, search, activeTag])

  return (
    <div>
      {/* ── Search + Tag Filters ── */}
      <div className="mb-10 flex flex-col gap-5">
        {/* Search bar */}
        <div className="relative max-w-[520px]">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-inter text-[15px] text-white placeholder:text-[#475569] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[16px] pl-12 pr-5 py-3.5 focus:outline-none focus:border-[rgba(96,165,250,0.5)] transition-colors"
          />
        </div>
        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`font-inter text-[13px] px-4 py-1.5 rounded-full border transition-all duration-150 ${
                activeTag === null
                  ? 'text-[#020617] border-[#60a5fa]'
                  : 'text-[#94a3b8] border-[rgba(255,255,255,0.12)] hover:border-[rgba(96,165,250,0.3)]'
              }`}
              style={activeTag === null ? { background: 'linear-gradient(135deg, #60a5fa, #2563eb)' } : {}}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`font-inter text-[13px] px-4 py-1.5 rounded-full border transition-all duration-150 ${
                  activeTag === tag
                    ? 'text-[#020617] border-[#60a5fa]'
                    : 'text-[#94a3b8] border-[rgba(255,255,255,0.12)] hover:border-[rgba(96,165,250,0.3)]'
                }`}
                style={activeTag === tag ? { background: 'linear-gradient(135deg, #60a5fa, #2563eb)' } : {}}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Result count ── */}
      {search || activeTag ? (
        <p className="font-inter text-[14px] text-[#64748b] mb-6">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} found
        </p>
      ) : null}

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className={`${GLASS} p-16 text-center`}>
          <p className="text-5xl mb-5">🔍</p>
          <h3 className="font-plus-jakarta font-bold text-[22px] text-white mb-3">No articles found</h3>
          <p className="font-inter text-[15px] text-[#94a3b8]">
            {posts.length === 0
              ? 'New articles are on their way. Check back soon.'
              : 'Try adjusting your search or clearing the tag filter.'}
          </p>
          {(search || activeTag) && (
            <button onClick={() => { setSearch(''); setActiveTag(null) }}
                    className="mt-6 font-plus-jakarta font-bold text-[14px] text-[#60a5fa] border border-[rgba(96,165,250,0.35)] px-5 py-2 rounded-[12px] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.06)] transition-all">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const slug = post.slug ?? post.id
            const rt   = estimateReadTime(post.excerpt)
            const date = formatDate(post.publishedDate)
            const tag  = post.tags?.[0]?.tag

            return (
              <Link key={post.id} href={`/blog/${slug}`} className={`${GLASS} flex flex-col group hover:border-[rgba(96,165,250,0.35)] hover:bg-[rgba(96,165,250,0.03)] transition-all duration-200`}>
                {/* Featured image */}
                <div className="relative h-[200px] overflow-hidden rounded-t-[24px] bg-[rgba(96,165,250,0.06)]">
                  {post.featuredImage?.url ? (
                    <Image src={post.featuredImage.url} alt={post.featuredImage.alt ?? post.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl opacity-40">📝</span>
                    </div>
                  )}
                  {/* Tag pill on image */}
                  {tag && (
                    <div className="absolute top-4 left-4">
                      <span className="font-inter text-[11px] font-semibold text-[#94ccff] bg-[rgba(2,6,23,0.75)] backdrop-blur-[8px] border border-[rgba(148,204,255,0.25)] px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="flex-1 flex flex-col gap-3 p-6">
                  <h3 className="font-plus-jakarta font-bold text-[18px] text-white leading-snug group-hover:text-[#60a5fa] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="font-inter text-[14px] text-[#64748b] leading-[1.7] line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[13px] text-[#64748b]">
                      {date && <span>{date}</span>}
                      {date && <span>·</span>}
                      <span>{rt} min read</span>
                    </div>
                    <span className="font-plus-jakarta font-semibold text-[13px] text-[#60a5fa] flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
                      Read
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
