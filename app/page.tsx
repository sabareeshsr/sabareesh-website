import Image from "next/image";
import Link from "next/link";
import Typewriter from "@/components/Typewriter";

/* ─────────────────────────────────────────────
   Design tokens (from Figma node 4:58)
───────────────────────────────────────────── */
const TILE_BASE =
  "backdrop-blur-[8px] bg-[rgba(26,31,47,0.6)] border border-[rgba(222,225,247,0.2)] " +
  "rounded-[24px] flex flex-col items-center justify-center gap-[6px] w-[160px] h-[80px]";

const TILE_LABEL =
  "font-inter font-medium text-[10px] text-[#c0c7d1] tracking-[0.3px] uppercase text-center leading-tight px-2";

/* ─────────────────────────────────────────────
   Inline SVG icons
───────────────────────────────────────────── */
function BookIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 3C1 1.9 1.9 1 3 1H15C16.1 1 17 1.9 17 3V19C17 20.1 16.1 21 15 21H3C1.9 21 1 20.1 1 19V3Z" stroke="#94ccff" strokeWidth="1.5"/>
      <path d="M5 7H13M5 11H11" stroke="#94ccff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function CircuitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="7" width="8" height="8" rx="1" stroke="#94ccff" strokeWidth="1.5"/>
      <path d="M11 1V7M11 15V21M1 11H7M15 11H21M4 4L7 7M15 15L18 18M4 18L7 15M15 7L18 4" stroke="#94ccff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 21H21" stroke="#94ccff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 21V13M9 21V8M13 21V11M17 21V5" stroke="#94ccff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function RobotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="16" height="11" rx="2" stroke="#94ccff" strokeWidth="1.5"/>
      <circle cx="11" cy="3" r="2" stroke="#94ccff" strokeWidth="1.5"/>
      <path d="M11 5V8" stroke="#94ccff" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="13" r="1.5" fill="#94ccff"/>
      <circle cx="14" cy="13" r="1.5" fill="#94ccff"/>
      <path d="M8 17H14M1 12H3M19 12H21" stroke="#94ccff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* Social icons */
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const STATS = [
  { value: "3+",  label: "Years Experience" },
  { value: "50+", label: "Blogs Written" },
  { value: "20+", label: "Enterprises Served" },
];

const BADGES = [
  "SAP Certified GenAI Developer",
  "Published Author — Five Days Forever",
  "Growth Marketer @ KTern.AI",
];

const SOCIALS = [
  { href: "https://linkedin.com/in/sabareesh", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://twitter.com/sabareesh",     label: "Twitter / X", Icon: XIcon },
  { href: "https://github.com/sabareesh",      label: "GitHub", Icon: GitHubIcon },
];

/* ─────────────────────────────────────────────
   Profile photo (shared between breakpoints)
───────────────────────────────────────────── */
function ProfilePhoto({ size }: { size: number }) {
  return (
    <div
      className="relative rounded-full p-[4px] shadow-[0px_0px_48px_12px_rgba(96,165,250,0.35)]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #60a5fa 0%, #94ccff 50%, #2563eb 100%)",
      }}
    >
      <div className="relative size-full rounded-full overflow-hidden border-[5px] border-[#070d1f]">
        <Image
          src="/profile.jpg"
          alt="Sabareesh profile photo"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      {/* inset glow ring */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0px_0px_24px_4px_rgba(148,204,255,0.2)] pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Satellite skill tile — clickable Link
───────────────────────────────────────────── */
function SkillTile({
  icon,
  label,
  href,
  floatClass,
  posClass,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  floatClass: string;
  posClass: string;
}) {
  return (
    <Link
      href={href}
      className={
        `${TILE_BASE} ${floatClass} ${posClass} absolute ` +
        "hover:scale-110 hover:border-[rgba(96,165,250,0.5)] " +
        "hover:bg-[rgba(96,165,250,0.12)] hover:shadow-[0px_0px_24px_4px_rgba(96,165,250,0.25)] " +
        "transition-all duration-200 cursor-pointer"
      }
    >
      {icon}
      <span className={TILE_LABEL}>{label}</span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO  —  two-column split layout
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-65px)] flex items-center overflow-hidden bg-[#020617]">

        {/* ── Background: right-biased radial glow ── */}
        <div
          className="pointer-events-none absolute inset-0 mesh-pulse"
          style={{
            background: [
              "radial-gradient(ellipse 55% 65% at 78% 50%, rgba(74,159,224,0.18) 0%, transparent 70%)",
              "radial-gradient(ellipse 30% 40% at 75% 48%, rgba(96,165,250,0.10) 0%, transparent 55%)",
              "radial-gradient(ellipse 20% 25% at 20% 80%, rgba(37,99,235,0.07) 0%, transparent 60%)",
            ].join(", "),
          }}
        />

        {/* ── Grid mesh overlay (very subtle) ── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,204,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,204,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* ── Two-column container ── */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-0">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex-1 flex flex-col items-start gap-6 lg:pr-8">

            {/* Label */}
            <span className="font-inter font-medium text-[14px] text-[#64748b] tracking-[0.5px]">
              Hi, It&apos;s Me
            </span>

            {/* Name */}
            <h1
              className="font-plus-jakarta font-extrabold text-[56px] md:text-[68px] lg:text-[76px] leading-none tracking-[-2px]"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" }}
              >
                Sabareesh
              </span>
            </h1>

            {/* Typewriter role */}
            <div className="h-[44px] flex items-center">
              <Typewriter />
            </div>

            {/* Bio */}
            <p className="font-inter text-[17px] text-[#94a3b8] leading-[1.75] max-w-[480px]">
              Crafting stories, building AI solutions, and driving growth —
              one idea at a time.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href="#about"
                className="font-plus-jakarta font-bold text-[15px] text-[#020617] px-7 py-3 rounded-[10px] transition-opacity hover:opacity-90 shadow-[0px_8px_24px_rgba(96,165,250,0.3)]"
                style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" }}
              >
                View My Work
              </a>
              <Link
                href="/contact"
                className="font-plus-jakarta font-bold text-[15px] text-[#60a5fa] px-7 py-3 rounded-[10px] border border-[rgba(96,165,250,0.35)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.06)] transition-all"
              >
                Get in Touch
              </Link>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#475569] hover:text-[#60a5fa] transition-colors duration-200 p-2 rounded-lg hover:bg-[rgba(96,165,250,0.08)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex-1 flex items-center justify-center">

            {/* DESKTOP: orbital canvas (visible ≥ lg) */}
            <div className="relative hidden lg:flex items-center justify-center w-[520px] h-[520px]">

              {/* Outer halo ring (purely decorative) */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 420,
                  height: 420,
                  background: "transparent",
                  boxShadow:
                    "0 0 0 1px rgba(96,165,250,0.12), 0 0 80px 20px rgba(96,165,250,0.08)",
                }}
              />

              {/* Profile photo — centred */}
              <ProfilePhoto size={350} />

              {/* Satellite tiles at diagonal corners */}
              <SkillTile
                icon={<BookIcon />}
                label="Writer"
                href="/writer"
                floatClass="float-tile-1"
                posClass="top-[22px] left-[8px]"
              />
              <SkillTile
                icon={<CircuitIcon />}
                label="SAP Gen AI Dev"
                href="/sap"
                floatClass="float-tile-2"
                posClass="top-[22px] right-[8px]"
              />
              <SkillTile
                icon={<ChartIcon />}
                label="Growth Marketer"
                href="/growth"
                floatClass="float-tile-3"
                posClass="bottom-[22px] left-[8px]"
              />
              <SkillTile
                icon={<RobotIcon />}
                label="AI Agent Manager"
                href="/agentic-ai"
                floatClass="float-tile-4"
                posClass="bottom-[22px] right-[8px]"
              />
            </div>

            {/* MOBILE / TABLET: photo + 2×2 tile grid (hidden ≥ lg) */}
            <div className="lg:hidden flex flex-col items-center gap-8">
              <ProfilePhoto size={220} />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <BookIcon />,    label: "Writer",           href: "/writer",      floatClass: "float-tile-1" },
                  { icon: <CircuitIcon />, label: "SAP Gen AI Dev",   href: "/sap",         floatClass: "float-tile-2" },
                  { icon: <ChartIcon />,   label: "Growth Marketer",  href: "/growth",      floatClass: "float-tile-3" },
                  { icon: <RobotIcon />,   label: "AI Agent Manager", href: "/agentic-ai",  floatClass: "float-tile-4" },
                ].map((t) => (
                  <Link
                    key={t.label}
                    href={t.href}
                    className={
                      `${TILE_BASE} ${t.floatClass} ` +
                      "hover:scale-105 hover:border-[rgba(96,165,250,0.5)] " +
                      "hover:bg-[rgba(96,165,250,0.12)] hover:shadow-[0px_0px_20px_rgba(96,165,250,0.2)] " +
                      "transition-all duration-200"
                    }
                  >
                    {t.icon}
                    <span className={TILE_LABEL}>{t.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT ME — unchanged
      ══════════════════════════════════════════════ */}
      <section id="about" className="relative bg-[#020617] py-24 px-6">

        {/* subtle section separator glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)",
          }}
        />

        <div className="max-w-[1280px] mx-auto">

          {/* Section heading */}
          <div className="mb-16 flex flex-col items-start gap-3">
            <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full">
              About Me
            </span>
            <h2 className="font-plus-jakarta font-bold text-[36px] md:text-[42px] text-white tracking-tight leading-tight">
              Building at the intersection of<br className="hidden md:block" /> enterprise, creativity &amp; AI
            </h2>
          </div>

          {/* 2-column body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

            {/* Left — bio */}
            <div className="flex flex-col gap-5">
              <p className="font-inter text-[18px] text-[#c0c7d1] leading-[1.75]">
                I&apos;m Sabareesh — a writer, SAP GenAI Developer, growth strategist,
                and agentic AI practitioner. I sit at the crossroads of enterprise
                technology and creative storytelling, helping organisations and
                individuals move faster with intelligence.
              </p>
              <p className="font-inter text-[18px] text-[#c0c7d1] leading-[1.75]">
                From architecting SAP BTP workflows powered by large language models,
                to writing books and building content engines that scale, I bring
                a rare blend of left-brain rigour and right-brain creativity to
                every project I take on.
              </p>
            </div>

            {/* Right — achievement badges */}
            <div className="flex flex-col gap-4 justify-center">
              <p className="font-inter font-semibold text-[13px] text-[#64748b] tracking-[1px] uppercase mb-2">
                Highlights
              </p>
              {BADGES.map((badge) => (
                <div
                  key={badge}
                  className="backdrop-blur-[8px] bg-[rgba(26,31,47,0.5)] border border-[rgba(222,225,247,0.15)] rounded-[9999px] px-5 py-3 flex items-center gap-3"
                >
                  <span className="shrink-0 size-[8px] rounded-full bg-[#4a9fe0]" />
                  <span className="font-inter font-medium text-[15px] text-[#dee1f7]">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="backdrop-blur-[8px] bg-[rgba(26,31,47,0.5)] border border-[rgba(222,225,247,0.15)] rounded-[24px] p-8 flex flex-col items-center gap-2 text-center"
              >
                <span
                  className="font-plus-jakarta font-extrabold text-[48px] leading-none bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #94ccff 0%, #60a5fa 100%)" }}
                >
                  {stat.value}
                </span>
                <span className="font-inter font-medium text-[15px] text-[#64748b] tracking-[0.3px] uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
