import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

export interface SiteSettings {
  siteName?: string
  siteTitle?: string
  siteDescription?: string
  seoDescription?: string
  favicon?: { url?: string } | null
  ogImage?: { url?: string } | null
  profileImage?: { url?: string; alt?: string } | null
  socialLinks?: { linkedin?: string; twitter?: string; github?: string; email?: string }
  navLinks?: Array<{ label: string; href: string }>
  footerLinks?: Array<{ label: string; url: string; external?: boolean }>
}

/** Fetch the site-settings global. Returns null on error or timeout. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  noStore() // opt out of Next.js static caching — always read live data
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await Promise.race([
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
    ])
    return data as SiteSettings
  } catch {
    return null
  }
}
