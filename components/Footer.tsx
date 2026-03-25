import Link from 'next/link'
import { getSiteSettings } from '@/lib/getSiteSettings'

const DEFAULT_FOOTER_LINKS = [
  { label: 'Privacy Policy', url: '/privacy',                           external: false },
  { label: 'LinkedIn',       url: 'https://linkedin.com/in/sabareesh', external: true  },
  { label: 'GitHub',         url: 'https://github.com/sabareesh',      external: true  },
]

export default async function Footer() {
  const settings    = await getSiteSettings()
  const siteName    = settings?.siteName || 'Sabareesh'
  const footerLinks = settings?.footerLinks?.length ? settings.footerLinks : DEFAULT_FOOTER_LINKS

  return (
    <footer className="bg-[#0e1322] border-t border-[rgba(255,255,255,0.05)] min-h-[125px]">
      <div className="max-w-[1280px] mx-auto w-full px-8 py-[49px] flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-0">

        {/* Left — wordmark */}
        <span className="font-semibold text-[18px] text-white tracking-[0.45px] uppercase font-inter">
          {siteName}
        </span>

        {/* Centre — copyright */}
        <span className="font-medium text-[14px] text-[#64748b] tracking-[0.35px] uppercase font-inter">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </span>

        {/* Right — links from CMS */}
        <div className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="font-medium text-[14px] text-[#64748b] tracking-[0.35px] uppercase hover:text-white transition-colors duration-150 font-inter"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  )
}
