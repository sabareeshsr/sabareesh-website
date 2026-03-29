import CMSImage from '@/components/CMSImage'

export interface FeatureTile {
  icon?: { url?: string; filename?: string } | null
  iconEmoji?: string
  title: string
  description?: string
}

export interface FeatureTilesSectionBlock {
  blockType: 'feature-tiles'
  sectionLabel?: string
  sectionHeading?: string
  tiles?: FeatureTile[]
}

interface Props {
  sectionLabel?: string
  sectionHeading?: string
  tiles: FeatureTile[]
}

export default function FeatureTilesSection({ sectionLabel, sectionHeading, tiles }: Props) {
  if (!tiles.length) return null

  return (
    <section className="relative px-6 pb-20">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)' }}
      />
      <div className="max-w-[1280px] mx-auto">

        {(sectionLabel || sectionHeading) && (
          <div className="mb-12 flex flex-col gap-3">
            {sectionLabel && (
              <span className="font-inter font-semibold text-[12px] text-[#94ccff] tracking-[1.2px] uppercase bg-[rgba(148,204,255,0.1)] px-3 py-1 rounded-full inline-block w-fit">
                {sectionLabel}
              </span>
            )}
            {sectionHeading && (
              <h2 className="font-plus-jakarta font-bold text-[36px] text-white">
                {sectionHeading}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, i) => (
            <div
              key={i}
              className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px] p-7 hover:border-[rgba(96,165,250,0.3)] transition-colors duration-200"
            >
              <div className="mb-5">
                {tile.icon ? (
                  <CMSImage image={tile.icon} alt={tile.title} width={48} height={48} className="object-contain" />
                ) : (
                  <span className="text-4xl">{tile.iconEmoji || '✦'}</span>
                )}
              </div>
              <h3 className="font-plus-jakarta font-bold text-[20px] text-white mb-3">
                {tile.title}
              </h3>
              {tile.description && (
                <p className="font-inter text-[15px] text-[#94a3b8] leading-[1.7]">
                  {tile.description}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
