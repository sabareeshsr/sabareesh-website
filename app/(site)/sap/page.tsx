import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import ExpertiseTemplate from '@/components/templates/ExpertiseTemplate'
import type { ContentBlock } from '@/components/sections/ContentBlocks'

interface SAPPage {
  heroTitle?: string
  heroSubtitle?: string
  contentBlocks?: ContentBlock[]
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<SAPPage>('sap')
  const title = page?.seo?.seoTitle || 'SAP Gen AI Developer | Sabareesh'
  const description = page?.seo?.seoDescription || 'Bridging enterprise SAP ecosystems with the power of generative AI and intelligent automation.'
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

export default async function SAPPage() {
  const page = await getPage<SAPPage>('sap')
  return (
    <ExpertiseTemplate
      heroTitle={page?.heroTitle || 'SAP Certified Gen AI Developer'}
      heroSubtitle={page?.heroSubtitle || 'Bridging enterprise SAP ecosystems with the power of generative AI and intelligent automation.'}
      badge="Enterprise AI"
      contentBlocks={page?.contentBlocks}
    />
  )
}
