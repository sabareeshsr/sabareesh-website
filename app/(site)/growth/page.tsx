import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import ExpertiseTemplate from '@/components/templates/ExpertiseTemplate'
import type { ContentBlock } from '@/components/sections/ContentBlocks'

interface GrowthPage {
  heroTitle?: string
  heroSubtitle?: string
  contentBlocks?: ContentBlock[]
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<GrowthPage>('growth')
  const title = page?.seo?.seoTitle || 'Growth Marketer | Sabareesh'
  const description = page?.seo?.seoDescription || 'Driving measurable growth through content strategy, email campaigns, social media, and website optimisation.'
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

export default async function GrowthPage() {
  const page = await getPage<GrowthPage>('growth')
  return (
    <ExpertiseTemplate
      heroTitle={page?.heroTitle || 'Growth Marketer'}
      heroSubtitle={page?.heroSubtitle || 'Driving measurable growth through content strategy, campaigns, and creativity.'}
      badge="Growth Marketing"
      contentBlocks={page?.contentBlocks}
    />
  )
}
