import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

/** Fetch the site-settings global. Returns null on error. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    return data as SiteSettings
  } catch {
    return null
  }
}
