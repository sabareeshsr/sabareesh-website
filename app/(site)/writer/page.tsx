import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import BookTemplate from '@/components/templates/BookTemplate'
import type { ContentBlock } from '@/components/sections/ContentBlocks'

interface WriterPage {
  heroTitle?: string
  heroSubtitle?: string
  contentBlocks?: ContentBlock[]
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

const FB = {
  heroTitle:    'Writer',
  heroSubtitle: 'Stories that move people. Books that shape minds.',
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<WriterPage>('writer')
  const title = page?.seo?.seoTitle || 'Writer | Sabareesh'
  const description = page?.seo?.seoDescription || FB.heroSubtitle
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

export default async function WriterPage() {
  const page = await getPage<WriterPage>('writer')

  return (
    <BookTemplate
      heroTitle={page?.heroTitle || FB.heroTitle}
      heroSubtitle={page?.heroSubtitle || FB.heroSubtitle}
      badge="Creative Writing"
      contentBlocks={page?.contentBlocks as ContentBlock[] | undefined}
    />
  )
}
