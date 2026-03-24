"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/writer", label: "Writer" },
  { href: "/growth", label: "Growth Marketer" },
  { href: "/sap", label: "SAP" },
  { href: "/agentic-ai", label: "Agentic AI" },
  { href: "/blog", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ── Desktop & Mobile header bar ── */}
      <header
        className="
          sticky top-0 z-50 w-full
          h-[65px]
          backdrop-blur-[10px]
          bg-[rgba(2,6,23,0.6)]
          border-b border-[rgba(255,255,255,0.1)]
          shadow-[0px_25px_50px_-12px_rgba(30,58,138,0.2)]
        "
      >
        <div className="max-w-[1280px] mx-auto w-full h-full px-8 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="
              font-extrabold text-[24px] tracking-[-0.6px] not-italic
              bg-gradient-to-r from-[#60a5fa] to-[#2563eb]
              bg-clip-text text-transparent
              font-plus-jakarta
            "
          >
            Sabareesh
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  font-bold text-[16px] text-[#cbd5e1] tracking-[-0.4px]
                  hover:text-white transition-colors duration-150
                  font-plus-jakarta
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#cbd5e1] hover:text-white transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              /* X icon */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile dropdown menu (rendered outside header to avoid clipping) ── */}
      {menuOpen && (
        <div
          className="
            md:hidden fixed top-[65px] left-0 right-0 z-40
            backdrop-blur-[10px] bg-[rgba(2,6,23,0.95)]
            border-b border-[rgba(255,255,255,0.1)]
            py-2
          "
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="
                block px-8 py-3
                font-bold text-[16px] text-[#cbd5e1] tracking-[-0.4px]
                hover:text-white transition-colors duration-150
                font-plus-jakarta
              "
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
