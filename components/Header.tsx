import Link from 'next/link'
import { getHeader } from '@/lib/getHeader'
import MobileMenu from './MobileMenu'

type NavLink = {
  label: string
  url: string
  openInNewTab?: boolean
  subLinks?: Array<{ label: string; url: string }>
}

const DEFAULT_NAV: NavLink[] = [
  { label: 'Writer',          url: '/writer' },
  { label: 'Growth Marketer', url: '/growth' },
  { label: 'SAP',             url: '/sap' },
  { label: 'Agentic AI',      url: '/agentic-ai' },
  { label: 'Blogs',           url: '/blog' },
  { label: 'Contact',         url: '/contact' },
]

export default async function Header() {
  const headerData = await getHeader()
  const logoText  = headerData?.logoText  || 'SABAREESH'
  const logoLink  = headerData?.logoLink  || '/'
  const navLinks  = headerData?.navLinks?.length ? headerData.navLinks : DEFAULT_NAV

  // MobileMenu expects { href, label } — map from the global's { url, label }
  const mobileLinks = navLinks.map((l) => ({ href: l.url, label: l.label }))

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[65px] backdrop-blur-[10px] bg-[rgba(2,6,23,0.6)] border-b border-[rgba(255,255,255,0.1)] shadow-[0px_25px_50px_-12px_rgba(30,58,138,0.2)]">
        <div className="max-w-[1280px] mx-auto w-full h-full px-8 flex items-center justify-between">

          {/* Logo */}
          <Link
            href={logoLink}
            className="font-extrabold text-[24px] tracking-[-0.6px] uppercase bg-gradient-to-r from-[#60a5fa] to-[#2563eb] bg-clip-text text-transparent font-plus-jakarta"
          >
            {logoText}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.url} className="relative group/nav-item">
                <Link
                  href={link.url}
                  {...(link.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="font-bold text-[16px] text-[#cbd5e1] tracking-[-0.4px] hover:text-white transition-colors duration-150 font-plus-jakarta"
                >
                  {link.label}
                </Link>

                {/* Dropdown — only rendered when sub-links exist */}
                {link.subLinks && link.subLinks.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/nav-item:block min-w-[160px] backdrop-blur-[16px] bg-[rgba(2,6,23,0.92)] border border-[rgba(255,255,255,0.12)] rounded-[12px] py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.url}
                        href={sub.url}
                        className="block px-4 py-2 text-[14px] text-[#94a3b8] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-150 font-plus-jakarta"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile hamburger — client component handles toggle state */}
          <MobileMenu links={mobileLinks} />

        </div>
      </header>
    </>
  )
}
