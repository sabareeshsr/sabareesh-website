import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/getPageBySlug'
import BookTemplate from '@/components/templates/BookTemplate'
import ExpertiseTemplate from '@/components/templates/ExpertiseTemplate'
import StandardTemplate from '@/components/templates/StandardTemplate'
import ContactTemplate from '@/components/templates/ContactTemplate'
import type { ContentBlock } from '@/components/sections/ContentBlocks'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return []
}

interface PageDoc {
  pageTemplate?: string
  heroTitle?: string
  heroSubtitle?: string
  /* standard / profile fixed fields */
  aboutTitle?: string
  aboutBio?: object | null
  achievements?: Array<{ label: string; icon?: string }>
  stats?: Array<{ value: string; label?: string }>
  /* contact fixed fields */
  contactEmail?: string
  contactLinkedin?: string
  contactTwitter?: string
  contactGithub?: string
  availability?: string
  formTitle?: string
  subjectOptions?: Array<{ subject: string }>
  /* unified content blocks */
  contentBlocks?: ContentBlock[]
  /* seo */
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
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
  const contentBlocks = page.contentBlocks as ContentBlock[] | undefined

  /* ── BOOK template ── */
  if (template === 'book') {
    return (
      <BookTemplate
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        contentBlocks={contentBlocks}
      />
    )
  }

  /* ── EXPERTISE template ── */
  if (template === 'expertise') {
    return (
      <ExpertiseTemplate
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        contentBlocks={contentBlocks}
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
        contentBlocks={contentBlocks}
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
        contentBlocks={contentBlocks}
      />
    )
  }

  /* ── STANDARD template (default) ── */
  return (
    <StandardTemplate
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      badge="Page"
      aboutTitle={page.aboutTitle}
      body={page.aboutBio || null}
      achievements={page.achievements}
      stats={page.stats}
      contentBlocks={contentBlocks}
    />
  )
}
