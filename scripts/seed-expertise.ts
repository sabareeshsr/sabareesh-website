/**
 * Seeds the growth, sap, and agentic-ai pages with initial content blocks.
 * Run with: npm run seed:expertise
 *
 * Uses dynamic imports so .env.local is loaded BEFORE payload.config is evaluated.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

/** Minimal Lexical rich text document wrapping a plain string. */
function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../payload.config.js')
  const payload = await getPayload({ config: configPromise })

  /** Upsert a page document by slug. Creates if missing, updates if found. */
  async function upsertPageBySlug(data: Record<string, unknown>) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (docs.length > 0) {
      await payload.update({ collection: 'pages', id: docs[0].id, data })
      console.log(`✅ Updated: /${data.slug}`)
    } else {
      await payload.create({ collection: 'pages', data })
      console.log(`✅ Created: /${data.slug}`)
    }
  }

  /* ══════════════════════════════════════════
     GROWTH PAGE
  ══════════════════════════════════════════ */
  await upsertPageBySlug({
    pageName: 'Growth Marketer',
    slug: 'growth',
    pageTemplate: 'expertise',
    heroTitle: 'Growth Marketer',
    heroSubtitle: 'Driving measurable growth through content strategy, email campaigns, social media, and website optimisation.',
    contentBlocks: [
      /* ── Experience ── */
      {
        blockType: 'experience',
        sectionLabel: 'EXPERIENCE',
        sectionHeading: 'Where I\'ve Made an Impact',
        experiences: [
          {
            company: 'Ktern.ai',
            role: 'Growth Marketer',
            duration: '2023 – Present',
            description: richText('Led growth marketing initiatives including content strategy, email campaigns, social media management, and website optimisation — driving pipeline and brand awareness for an enterprise AI SaaS product.'),
          },
        ],
      },
      /* ── Skills Grid ── */
      {
        blockType: 'skills-grid',
        sectionLabel: 'EXPERTISE',
        sectionHeading: 'What I Bring to the Table',
        skills: [
          {
            category: 'Content Marketing',
            items: [
              { item: 'Blog Writing' },
              { item: 'SEO Copywriting' },
              { item: 'Content Strategy' },
            ],
          },
          {
            category: 'Email Marketing',
            items: [
              { item: 'Campaign Sequencing' },
              { item: 'Marketing Automation' },
              { item: 'A/B Testing' },
            ],
          },
          {
            category: 'Social Media',
            items: [
              { item: 'LinkedIn Growth' },
              { item: 'Twitter / X' },
              { item: 'Community Building' },
            ],
          },
          {
            category: 'Website Marketing',
            items: [
              { item: 'Landing Page CRO' },
              { item: 'Analytics & Reporting' },
              { item: 'Web Copywriting' },
            ],
          },
          {
            category: 'Design',
            items: [
              { item: 'Canva' },
              { item: 'Figma' },
              { item: 'Brand Consistency' },
            ],
          },
        ],
      },
      /* ── Feature Tiles ── */
      {
        blockType: 'feature-tiles',
        sectionLabel: 'APPROACH',
        sectionHeading: 'How I Drive Growth',
        tiles: [
          {
            iconEmoji: '📊',
            title: 'Data-Driven',
            description: 'Every campaign backed by analytics and measurable KPIs. No guesswork — just results.',
          },
          {
            iconEmoji: '✍️',
            title: 'Content First',
            description: 'Quality content that attracts, nurtures, and converts. SEO-optimised for long-term compounding.',
          },
          {
            iconEmoji: '🚀',
            title: 'Growth Mindset',
            description: 'Constant experimentation, rapid iteration, and scaling what works.',
          },
        ],
      },
      /* ── CTA ── */
      {
        blockType: 'cta',
        heading: 'Let\'s Grow Together',
        subtext: 'Looking for a growth marketer who delivers results? Let\'s talk.',
        buttons: [
          { label: 'Get in Touch', url: '/contact', style: 'primary' },
        ],
      },
    ],
  })

  /* ══════════════════════════════════════════
     SAP PAGE
  ══════════════════════════════════════════ */
  await upsertPageBySlug({
    pageName: 'SAP Gen AI Developer',
    slug: 'sap',
    pageTemplate: 'expertise',
    heroTitle: 'SAP Certified Gen AI Developer',
    heroSubtitle: 'Bridging enterprise SAP ecosystems with the power of generative AI and intelligent automation.',
    contentBlocks: [
      /* ── Feature Tiles — Core Capabilities ── */
      {
        blockType: 'feature-tiles',
        sectionLabel: 'CAPABILITIES',
        sectionHeading: 'What I Build in the SAP Ecosystem',
        tiles: [
          {
            iconEmoji: '🏅',
            title: 'SAP Certified Gen AI Developer',
            description: 'Officially certified in building generative AI solutions within SAP BTP — covering LLM integration, prompt engineering, and enterprise deployment patterns.',
          },
          {
            iconEmoji: '✍️',
            title: 'SAP Community Contributor',
            description: 'Published technical blog posts on the SAP Community covering RAG pipelines, AI Core, Joule, and LLM fine-tuning for ERP data.',
          },
          {
            iconEmoji: '⚡',
            title: 'Rapid Prototyping',
            description: 'Business requirement to working prototype in days using SAP AI Core, Joule, and custom multi-agent pipelines.',
          },
          {
            iconEmoji: '🔗',
            title: 'Integration First',
            description: 'AI solutions designed to slot natively into S/4HANA, BTP, and SuccessFactors — without disrupting existing workflows.',
          },
        ],
      },
      /* ── Certifications ── */
      {
        blockType: 'certifications',
        sectionLabel: 'CREDENTIALS',
        sectionHeading: 'Certifications',
        certifications: [
          {
            title: 'SAP Certified Associate – Generative AI Developer',
            issuer: 'SAP SE',
            date: '2024',
          },
        ],
      },
      /* ── CTA ── */
      {
        blockType: 'cta',
        heading: 'Want to Discuss an SAP AI Project?',
        subtext: 'From scoping to deployment — let\'s explore what\'s possible together.',
        buttons: [
          { label: 'Let\'s Discuss SAP', url: '/contact', style: 'primary' },
        ],
      },
    ],
  })

  /* ══════════════════════════════════════════
     AGENTIC AI PAGE
  ══════════════════════════════════════════ */
  await upsertPageBySlug({
    pageName: 'Agentic AI',
    slug: 'agentic-ai',
    pageTemplate: 'expertise',
    heroTitle: 'Agentic AI',
    heroSubtitle: 'Building autonomous AI systems that think, plan, and act — turning complex workflows into self-driving pipelines.',
    contentBlocks: [
      /* ── Feature Tiles — What I Build ── */
      {
        blockType: 'feature-tiles',
        sectionLabel: 'EXPERTISE',
        sectionHeading: 'What I Build',
        tiles: [
          {
            iconEmoji: '🔍',
            title: 'RAG Systems',
            description: 'Retrieval-Augmented Generation pipelines that ground LLMs in proprietary data — vector databases, chunking strategies, and re-ranking for precision.',
          },
          {
            iconEmoji: '🎵',
            title: 'Vibe Coding',
            description: 'AI-assisted development where natural language drives the build loop — prompt-first engineering with Claude, GPT-4, and Cursor.',
          },
          {
            iconEmoji: '🎨',
            title: 'Vibe Designing',
            description: 'AI-native design workflows: generating UI prototypes, iterating on brand assets, and shipping polished visuals at 10× speed.',
          },
          {
            iconEmoji: '🏢',
            title: 'Enterprise AI Solutions',
            description: 'End-to-end AI roadmaps — from use-case identification and build-vs-buy decisions to change management and ROI measurement.',
          },
        ],
      },
      /* ── Projects Grid ── */
      {
        blockType: 'projects-grid',
        sectionLabel: 'PORTFOLIO',
        sectionHeading: 'AI Projects & Solutions',
        projects: [
          {
            title: 'SAP BTP AI Agent',
            description: 'Autonomous agent handling SAP S/4HANA queries via natural language — connected to procurement, finance, and HR modules.',
            tags: [{ tag: 'SAP BTP' }, { tag: 'LangGraph' }, { tag: 'Live' }],
          },
          {
            title: 'Knowledge RAG Pipeline',
            description: 'Enterprise knowledge base with semantic search — ingests PDFs, Confluence pages, and Notion docs; returns precise answers with source citations.',
            tags: [{ tag: 'RAG' }, { tag: 'Pinecone' }, { tag: 'Live' }],
          },
          {
            title: 'Content Automation Engine',
            description: 'Multi-agent workflow: research agent → writer agent → editor agent. Produces publication-ready posts from a single keyword prompt.',
            tags: [{ tag: 'Multi-Agent' }, { tag: 'Claude' }, { tag: 'Live' }],
          },
          {
            title: 'AI Market Research Tool',
            description: 'Agentic system monitoring industry trends and competitor moves — delivers structured weekly intelligence briefings.',
            tags: [{ tag: 'Agents' }, { tag: 'n8n' }, { tag: 'Beta' }],
          },
        ],
      },
      /* ── CTA ── */
      {
        blockType: 'cta',
        heading: 'Have an AI Automation Idea?',
        subtext: 'Let\'s scope it, prototype it, and ship it — fast.',
        buttons: [
          { label: 'Build with Me', url: '/contact', style: 'primary' },
        ],
      },
    ],
  })

  console.log('\n🎉 Expertise pages seeded successfully.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
