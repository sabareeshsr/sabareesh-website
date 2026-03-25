/**
 * Seed script — populates all 7 page documents and the site-settings global.
 * Run with: npm run seed
 *
 * Uses dynamic imports so .env.local is loaded BEFORE payload.config is evaluated.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

async function seed() {
  // Dynamic imports after env is loaded so process.env.PAYLOAD_SECRET is set
  // before payload.config.ts calls buildConfig({ secret: process.env.PAYLOAD_SECRET })
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../payload.config.js')
  const payload = await getPayload({ config: configPromise })

  /* ─── Helper: upsert a page by pageType ─── */
  async function upsertPage(data: Record<string, unknown>) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { pageType: { equals: data.pageType } },
      limit: 1,
    })
    if (docs.length > 0) {
      await payload.update({ collection: 'pages', id: docs[0].id, data })
      console.log(`✅ Updated page: ${data.pageType}`)
    } else {
      await payload.create({ collection: 'pages', data })
      console.log(`✅ Created page: ${data.pageType}`)
    }
  }

  /* ══════════════════════════════════════════
     HOME PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'home',
    heroGreeting: "Hi, It's Me",
    heroName: 'Sabareesh',
    heroBio: 'SAP Gen AI Developer · Growth Marketer · Author · Agentic AI Builder',
    skillTiles: [
      { label: 'Writer',      icon: 'book',    link: '/writer' },
      { label: 'SAP Gen AI',  icon: 'sap',     link: '/sap' },
      { label: 'Growth',      icon: 'chart',   link: '/growth' },
      { label: 'Agentic AI',  icon: 'robot',   link: '/agentic-ai' },
    ],
    aboutTitle: 'About Me',
    achievements: [
      { label: 'SAP Certified',    icon: '🏅' },
      { label: 'Published Author', icon: '📚' },
      { label: 'AI Builder',       icon: '🤖' },
      { label: 'Growth Marketer',  icon: '📈' },
    ],
    stats: [
      { value: '50+',  label: 'Blogs Written' },
      { value: '20+',  label: 'Enterprise Clients' },
      { value: '4×',   label: 'LinkedIn Growth' },
      { value: '1',    label: 'Novel Published' },
    ],
  })

  /* ══════════════════════════════════════════
     WRITER PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'writer',
    heroTitle: 'Writer',
    heroSubtitle: 'Stories that move people. Books that shape minds.',
    bookTitle: 'Five Days Forever',
    amazonLink: '#',
    flipkartLink: '#',
  })

  /* ══════════════════════════════════════════
     SAP PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'sap',
    heroTitle: 'SAP Certified Gen AI Developer',
    heroSubtitle: 'Bridging enterprise SAP ecosystems with the power of generative AI and intelligent automation.',
    certifications: [
      {
        title: 'SAP Certified Associate',
        issuer: 'SAP SE',
        date: '2024',
      },
    ],
    communityBlogs: [
      { title: 'Bridging SAP and Generative AI: What Enterprises Need to Know', url: 'https://community.sap.com', platform: 'SAP Community', date: 'Jan 2024', tags: [{ tag: 'Gen AI' }, { tag: 'SAP BTP' }] },
      { title: 'Building RAG Pipelines on SAP AI Core', url: 'https://community.sap.com', platform: 'SAP Community', date: 'Feb 2024', tags: [{ tag: 'RAG' }, { tag: 'LLM' }] },
      { title: 'SAP Joule: A Deep Dive Under the Hood', url: 'https://community.sap.com', platform: 'SAP Community', date: 'Mar 2024', tags: [{ tag: 'Joule' }, { tag: 'Copilot' }] },
      { title: 'LLM Fine-tuning for ERP Data Patterns', url: 'https://community.sap.com', platform: 'SAP Community', date: 'Apr 2024', tags: [{ tag: 'Fine-tuning' }] },
      { title: 'Multi-Agent Frameworks in SAP Contexts', url: 'https://community.sap.com', platform: 'SAP Community', date: 'May 2024', tags: [{ tag: 'Agents' }, { tag: 'SAP' }] },
      { title: 'Prompt Engineering for Structured ERP Data', url: 'https://community.sap.com', platform: 'SAP Community', date: 'Jun 2024', tags: [{ tag: 'Prompts' }] },
    ],
    approachTitle: 'My Approach',
    sapSections: [
      { icon: '🔗', title: 'Integration First', description: 'Design AI solutions that slot natively into SAP — S/4HANA, BTP, SuccessFactors — without disrupting existing workflows.' },
      { icon: '🧠', title: 'Right-Sized Models', description: 'Select the correct model (GPT-4, Gemini, open-source) based on data sensitivity, latency, and cost constraints.' },
      { icon: '⚡', title: 'Rapid Prototyping', description: 'Business requirement to working prototype in days using SAP AI Core, Joule, and custom agent pipelines.' },
      { icon: '🔒', title: 'Enterprise Security', description: 'Data stays within enterprise boundaries. Auth, RBAC, and audit logging built in from day one.' },
    ],
  })

  /* ══════════════════════════════════════════
     GROWTH PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'growth',
    heroTitle: 'Growth Marketer',
    heroSubtitle: 'Driving measurable growth through content, campaigns, and creativity — from zero to enterprise scale.',
    experiences: [
      {
        company: 'KTern.AI',
        role: 'Growth Marketer',
        duration: '2022 – Present',
        description: 'Leading growth marketing for an intelligent SAP digital transformation platform. Responsible for pipeline generation, brand positioning, and marketing-attributed revenue across enterprise accounts in 20+ countries.',
        highlights: [
          { item: 'Built and scaled content engine from 0 → 50+ published blogs' },
          { item: 'Managed B2B email campaigns with 35%+ open rates' },
          { item: 'Led product marketing for 3 major feature launches' },
          { item: 'Grew LinkedIn following 4× in 18 months organically' },
        ],
      },
    ],
    skills: [
      { icon: '✉️', category: 'Email Marketing', description: 'Lifecycle campaigns, drip sequences, and newsletters that convert. A/B testing, segmentation, and deliverability optimisation.' },
      { icon: '✍️', category: 'Content Marketing', description: 'Long-form content, SEO-optimised blogs, and thought-leadership articles that attract and nurture high-intent audiences.' },
      { icon: '🌐', category: 'Website Marketing', description: 'CRO, landing page design, analytics setup (GA4, Hotjar), and performance tracking aligned to pipeline goals.' },
      { icon: '📱', category: 'Social Media', description: 'LinkedIn, Twitter/X, and Instagram — building organic reach through consistent voice, community engagement, and strategic posting.' },
      { icon: '🎨', category: 'Design', description: 'Figma-based design for marketing assets: banners, social creatives, pitch decks, and product UI mockups.' },
    ],
    growthStats: [
      { metric: '50+', label: 'Blogs Published' },
      { metric: '35%', label: 'Avg Email Open Rate' },
      { metric: '20+', label: 'Enterprise Clients' },
      { metric: '4×',  label: 'LinkedIn Growth' },
    ],
  })

  /* ══════════════════════════════════════════
     AGENTIC AI PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'agentic-ai',
    heroTitle: 'Agentic AI',
    heroSubtitle: 'Building autonomous AI systems that think, plan, and act — turning complex workflows into self-driving pipelines.',
    expertise: [
      { icon: '🔍', title: 'RAG Systems', description: 'Retrieval-Augmented Generation pipelines that ground LLMs in proprietary data — vector databases, chunking strategies, and re-ranking for precision.' },
      { icon: '🎵', title: 'Vibe Coding', description: 'AI-assisted software development where natural language drives the build loop — prompt-first engineering with Claude, GPT-4, and Cursor.' },
      { icon: '🎨', title: 'Vibe Designing', description: 'AI-native design workflows: generating UI prototypes, iterating on brand assets, and shipping polished visuals at 10× speed with Figma AI + Midjourney.' },
      { icon: '🏢', title: 'Enterprise AI Solutions', description: 'End-to-end AI roadmaps for mid-to-large organisations — from use-case identification and build-vs-buy decisions to change management and ROI measurement.' },
    ],
    aiProjects: [
      { icon: '🤖', title: 'SAP BTP AI Agent', status: 'Live', description: 'Autonomous agent that handles SAP S/4HANA queries via natural language — connected to procurement, finance, and HR modules.' },
      { icon: '📚', title: 'Knowledge RAG Pipeline', status: 'Live', description: 'Enterprise knowledge base with semantic search — ingests PDFs, Confluence pages, and Notion docs; returns precise answers with source citations.' },
      { icon: '✍️', title: 'Content Automation Engine', status: 'Live', description: 'Multi-agent content workflow: research agent → writer agent → editor agent. Produces publication-ready blog posts from a single keyword prompt.' },
      { icon: '🔎', title: 'AI Market Research Tool', status: 'Beta', description: 'Agentic system that monitors industry trends, competitor moves, and analyst reports — delivers weekly structured intelligence briefings.' },
    ],
    toolStack: [
      { tool: 'LangChain' }, { tool: 'LangGraph' }, { tool: 'OpenAI API' },
      { tool: 'Anthropic Claude' }, { tool: 'Pinecone' }, { tool: 'Chroma' },
      { tool: 'SAP AI Core' }, { tool: 'Cursor' }, { tool: 'n8n' },
      { tool: 'Zapier' }, { tool: 'Vercel AI SDK' }, { tool: 'Python' }, { tool: 'TypeScript' },
    ],
  })

  /* ══════════════════════════════════════════
     BLOG PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'blog',
    heroTitle: 'Blogs',
    heroSubtitle: 'Thoughts on SAP, generative AI, growth marketing, creative writing, and the future of work.',
  })

  /* ══════════════════════════════════════════
     CONTACT PAGE
  ══════════════════════════════════════════ */
  await upsertPage({
    pageType: 'contact',
    heroTitle: "Let's Connect",
    heroSubtitle: "Whether it's an SAP AI project, a growth challenge, a writing collaboration, or just a conversation — I'd love to hear from you.",
    contactEmail: 'hello@sabareesh.com',
    contactLinkedin: 'https://linkedin.com/in/sabareesh',
    contactTwitter: 'https://twitter.com/sabareesh',
    availability: 'Open to freelance, consulting & full-time roles. I typically respond within 1–2 business days.',
    formTitle: 'Send a Message',
    subjectOptions: [
      { subject: 'SAP Gen AI Project' },
      { subject: 'Growth Marketing' },
      { subject: 'Book / Writing' },
      { subject: 'Agentic AI Build' },
      { subject: 'Speaking / Podcast' },
      { subject: 'General Enquiry' },
    ],
  })

  /* ══════════════════════════════════════════
     SITE SETTINGS GLOBAL
  ══════════════════════════════════════════ */
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Sabareesh',
      seoDescription: 'SAP Gen AI Developer, Growth Marketer, Published Author, and Agentic AI Builder.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sabareesh',
        twitter: 'https://twitter.com/sabareesh',
        github: 'https://github.com/sabareesh',
        email: 'hello@sabareesh.com',
      },
      navLinks: [
        { label: 'Writer',           href: '/writer' },
        { label: 'Growth Marketer',  href: '/growth' },
        { label: 'SAP',              href: '/sap' },
        { label: 'Agentic AI',       href: '/agentic-ai' },
        { label: 'Blogs',            href: '/blog' },
        { label: 'Contact',          href: '/contact' },
      ],
      footerLinks: [
        { label: 'Privacy Policy', url: '/privacy',                          external: false },
        { label: 'LinkedIn',       url: 'https://linkedin.com/in/sabareesh', external: true  },
        { label: 'GitHub',         url: 'https://github.com/sabareesh',      external: true  },
      ],
    },
  })
  console.log('✅ Updated global: site-settings')

  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
