import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteSettings } from '@/lib/getSiteSettings'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.siteTitle || 'Sabareesh | Writer, SAP GenAI Dev & AI Builder'
  const description = settings?.siteDescription || settings?.seoDescription || 'SAP Gen AI Developer, Growth Marketer, Published Author, and Agentic AI Builder.'
  const faviconUrl = settings?.favicon?.url || null
  const ogImageUrl = settings?.ogImage?.url || null

  return {
    title,
    description,
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  }
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakartaSans.variable} bg-[#020617] min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
