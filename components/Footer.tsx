import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  {
    href: "https://linkedin.com/in/sabareesh",
    label: "LinkedIn",
    external: true,
  },
  {
    href: "https://github.com/sabareesh",
    label: "GitHub",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer
      className="
        bg-[#0e1322]
        border-t border-[rgba(255,255,255,0.05)]
        min-h-[125px]
      "
    >
      <div
        className="
          max-w-[1280px] mx-auto w-full
          px-8 py-[49px]
          flex flex-col gap-6
          md:flex-row md:items-center md:justify-between md:gap-0
        "
      >
        {/* Left — wordmark */}
        <span
          className="
            font-semibold text-[18px] text-white
            tracking-[0.45px] uppercase
            font-inter
          "
        >
          Sabareesh
        </span>

        {/* Centre — copyright */}
        <span
          className="
            font-medium text-[14px] text-[#64748b]
            tracking-[0.35px] uppercase
            font-inter
          "
        >
          © {new Date().getFullYear()} Sabareesh. All rights reserved.
        </span>

        {/* Right — links */}
        <div className="flex flex-wrap gap-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="
                font-medium text-[14px] text-[#64748b]
                tracking-[0.35px] uppercase
                hover:text-white transition-colors duration-150
                font-inter
              "
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
