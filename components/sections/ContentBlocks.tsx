import FeatureTilesSection, { type FeatureTilesSectionBlock } from './FeatureTilesSection'
import BookShowcase, { type BookShowcaseBlockData } from './BookShowcase'
import RichTextSection, { type RichTextBlockData } from './RichTextSection'
import ExperienceSection, { type ExperienceBlockData } from './ExperienceSection'
import SkillsGrid, { type SkillsGridBlockData } from './SkillsGrid'
import Certifications, { type CertificationsBlockData } from './Certifications'
import ProjectsGrid, { type ProjectsGridBlockData } from './ProjectsGrid'
import StatsSection, { type StatsBlockData } from './StatsSection'
import CTASection, { type CTABlockData } from './CTASection'

export type ContentBlock =
  | FeatureTilesSectionBlock
  | BookShowcaseBlockData
  | RichTextBlockData
  | ExperienceBlockData
  | SkillsGridBlockData
  | CertificationsBlockData
  | ProjectsGridBlockData
  | StatsBlockData
  | CTABlockData

export default function ContentBlocks({ blocks }: { blocks?: ContentBlock[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'feature-tiles':
            return (
              <FeatureTilesSection
                key={i}
                sectionLabel={block.sectionLabel}
                sectionHeading={block.sectionHeading}
                tiles={block.tiles || []}
              />
            )
          case 'book-showcase':
            return <BookShowcase key={i} data={block} />
          case 'rich-text':
            return <RichTextSection key={i} data={block} />
          case 'experience':
            return <ExperienceSection key={i} data={block} />
          case 'skills-grid':
            return <SkillsGrid key={i} data={block} />
          case 'certifications':
            return <Certifications key={i} data={block} />
          case 'projects-grid':
            return <ProjectsGrid key={i} data={block} />
          case 'stats':
            return <StatsSection key={i} data={block} />
          case 'cta':
            return <CTASection key={i} data={block} />
          default:
            return null
        }
      })}
    </>
  )
}
