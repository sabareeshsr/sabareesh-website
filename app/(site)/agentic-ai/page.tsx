import type { Metadata } from 'next'
import { getPage } from '@/lib/getPage'
import ExpertiseTemplate from '@/components/templates/ExpertiseTemplate'
import type { ContentBlock } from '@/components/sections/ContentBlocks'

interface AgenticAIPage {
  heroTitle?: string
  heroSubtitle?: string
  contentBlocks?: ContentBlock[]
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: { url?: string } | null }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<AgenticAIPage>('agentic-ai')
  const title = page?.seo?.seoTitle || 'Agentic AI | Sabareesh'
  const description = page?.seo?.seoDescription || 'Building autonomous AI systems that think, plan, and act — turning complex workflows into self-driving pipelines.'
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

export default async function AgenticAIPage() {
  const page = await getPage<AgenticAIPage>('agentic-ai')
  return (
    <ExpertiseTemplate
      heroTitle={page?.heroTitle || 'Agentic AI'}
      heroSubtitle={page?.heroSubtitle || 'Building autonomous AI systems that think, plan, and act — turning complex workflows into self-driving pipelines.'}
      badge="AI Automation"
      contentBlocks={page?.contentBlocks}
    />
  )
}
