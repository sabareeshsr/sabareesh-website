import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/getPageBySlug'
import BookTemplate, { type BookEntry } from '@/components/templates/BookTemplate'
import ExpertiseTemplate from '@/components/templates/ExpertiseTemplate'
import StandardTemplate from '@/components/templates/StandardTemplate'
import ContactTemplate from '@/components/templates/ContactTemplate'

export const dynamic = 'force-dynamic'

/* Generate static params: return [] so all slugs are server-rendered on demand */
export async function generateStaticParams() {
  return []
}

interface PageDoc {
  pageTemplate?: string
  heroTitle?: string
  heroSubtitle?: string
  /* standard / profile */
  aboutTitle?: string
  aboutBio?: object | null
  achievements?: Array<{ label: string; icon?: string }>
  stats?: Array<{ value: string; label?: string }>
  /* book */
  books?: Array<{
    bookTitle?: string
    bookCategory?: string
    bookDescription?: object
    bookCover?: { url?: string; filename?: string } | null
    amazonLink?: string
    flipkartLink?: string
    otherStoreLink?: string
    genres?: Array<{ genre: string }>
    aboutTheBook?: object
  }>
  additionalSections?: Array<{ sectionTitle?: string; sectionContent?: object }>
  /* expertise */
  expertise?: Array<{ icon?: string; title: string; description?: string }>
  aiProjects?: Array<{
    icon?: string; title: string; description?: string;
    status?: 'Live' | 'Beta' | 'WIP';
    tags?: Array<{ tag: string }>; link?: string
  }>
  services?: Array<{ title: string; description?: string }>
  toolStack?: Array<{ tool: string }>
  /* contact */
  contactEmail?: string
  contactLinkedin?: string
  contactTwitter?: string
  contactGithub?: string
  availability?: string
  formTitle?: string
  subjectOptions?: Array<{ subject: string }>
  /* seo */
  pageSections?: Array<{ blockType: string; sectionLabel?: string; sectionHeading?: string; tiles?: Array<{ icon?: { url?: string } | null; iconEmoji?: string; title: string; description?: string }> }>
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

function resolveMediaUrl(img: { url?: string; filename?: string } | null | undefined): string | null {
  if (!img) return null
  if (img.url) return img.url
  if (img.filename) return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/media/file/${img.filename}`
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug<PageDoc>(slug)
  if (!page) return { title: 'Not Found' }
  const title = page.seo?.seoTitle || page.heroTitle || slug
  const description = page.seo?.seoDescription || page.heroSubtitle || ''
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page.seo?.ogImage?.url ? [{ url: page.seo.ogImage.url }] : [],
    },
  }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug<PageDoc>(slug)

  if (!page) notFound()

  const template = page.pageTemplate
  const heroTitle    = page.heroTitle    || slug
  const heroSubtitle = page.heroSubtitle || undefined

  /* ── BOOK template ── */
  if (template === 'book') {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const books: BookEntry[] = page.books?.length
      ? page.books.map((b) => ({
          bookTitle:       b.bookTitle,
          bookCategory:    b.bookCategory,
          bookDescription: b.bookDescription,
          coverUrl:        resolveMediaUrl(b.bookCover),
          amazonLink:      b.amazonLink,
          flipkartLink:    b.flipkartLink,
          otherStoreLink:  b.otherStoreLink,
          genres:          b.genres,
          aboutTheBook:    b.aboutTheBook,
        }))
      : [{ bookTitle: heroTitle, fallbackDesc: heroSubtitle }]

    const sections = page.additionalSections?.length
      ? page.additionalSections.map((s) => ({ title: s.sectionTitle, content: s.sectionContent }))
      : null

    return <BookTemplate heroTitle={heroTitle} heroSubtitle={heroSubtitle || ''} books={books} sections={sections} pageSections={page.pageSections as any} />
  }

  /* ── EXPERTISE template ── */
  if (template === 'expertise') {
    return (
      <ExpertiseTemplate
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        expertiseCards={page.expertise}
        projects={page.aiProjects}
        services={page.services}
        toolStack={page.toolStack}
        pageSections={page.pageSections as any}
      />
    )
  }

  /* ── CONTACT template ── */
  if (template === 'contact') {
    return (
      <ContactTemplate
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        email={page.contactEmail}
        linkedin={page.contactLinkedin}
        twitter={page.contactTwitter}
        github={page.contactGithub || null}
        availability={page.availability || null}
        formTitle={page.formTitle}
        subjectOptions={page.subjectOptions?.map((o) => o.subject).filter(Boolean)}
        pageSections={page.pageSections as any}
      />
    )
  }

  /* ── PROFILE template ── */
  if (template === 'profile') {
    return (
      <StandardTemplate
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        badge="Profile"
        aboutTitle={page.aboutTitle}
        body={page.aboutBio || null}
        achievements={page.achievements}
        stats={page.stats}
        pageSections={page.pageSections as any}
      />
    )
  }

  /* ── STANDARD template (default for unrecognised or 'standard') ── */
  return (
    <StandardTemplate
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      badge="Page"
      aboutTitle={page.aboutTitle}
      body={page.aboutBio || null}
      achievements={page.achievements}
      stats={page.stats}
      pageSections={page.pageSections as any}
    />
  )
}
