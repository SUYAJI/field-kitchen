import { SOURCES, type Source, type SourceKind } from "../data";
import { PREPARATIONS } from "../preparations";
import { ProvenanceBadge, SourceLink } from "../components";

const KIND_TITLES: Record<SourceKind, string> = {
  nutrition: "Nutrition",
  availability: "Seasonal availability",
  culinary: "Established preparations",
  handling: "Handling and storage",
};

export function SourcesView() {
  const sources = Object.values(SOURCES) as Source[];
  const established = PREPARATIONS.filter((item) => item.basis.kind === "established").length;
  const curated = PREPARATIONS.length - established;

  return (
    <section aria-labelledby="sources-heading" className="w-full min-h-0 px-5 pb-16 pt-6 sm:px-6 lg:h-full lg:overflow-y-auto lg:px-10 lg:pt-8">
      <div className="max-w-3xl">
        <h2 id="sources-heading" className="font-['Playfair_Display'] text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] md:text-5xl">
          How the data works
        </h2>
        <p className="mt-3 text-base leading-relaxed text-black/75">
          Field Kitchen separates public facts from culinary judgement. Information in the app is labelled with one of three levels where it appears.
        </p>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <dt><ProvenanceBadge level="sourced" /></dt>
            <dd className="mt-2 text-sm leading-relaxed text-black/75">Supported by a specific, linked reference: USDA nutrition records, the Oregon availability chart, or a culinary reference for an established dish.</dd>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <dt><ProvenanceBadge level="curated" /></dt>
            <dd className="mt-2 text-sm leading-relaxed text-black/75">A combination or method designed for Field Kitchen, explained in plain culinary terms. No external source vouches for it.</dd>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <dt><ProvenanceBadge level="assumption" /></dt>
            <dd className="mt-2 text-sm leading-relaxed text-black/75">Provisional information. Here, that means only one thing: pantry staples such as butter, salt and vinegar are assumed to be on hand. They are always listed. Other unsupported fields are left out.</dd>
          </div>
        </dl>

        <h3 className="mt-10 font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a1a]">How ideas are suggested</h3>
        <p className="mt-2 text-sm leading-relaxed text-black/75">
          Each of the {PREPARATIONS.length} ideas lists the ingredients it needs, with accepted substitutes and optional extras. An idea appears when one of your ingredients fills one of its main (required) ingredients; optional extras alone do not count. Ideas that need nothing beyond assumed pantry staples come first, then those that need the fewest extra ingredients, then those that use the most of yours. There are no hidden scores. {established} ideas are established preparations with a cited reference; {curated} are Field Kitchen combinations and are labelled as curated. All of them are preparation concepts, not tested recipes with quantities.
        </p>

        <h3 className="mt-10 font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a1a]">Sources</h3>
        {(Object.keys(KIND_TITLES) as SourceKind[]).map((kind) => (
          <div key={kind} className="mt-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">{KIND_TITLES[kind]}</h4>
            <ul className="mt-2 flex flex-col gap-3">
              {sources.filter((source) => source.kind === kind).map((source) => (
                <li key={source.id} className="rounded-xl border border-black/10 bg-white/70 p-3">
                  <SourceLink id={source.id as keyof typeof SOURCES} />
                  <p className="mt-1 text-xs leading-relaxed text-black/65">{source.supports} Accessed {source.accessed}.</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h3 className="mt-10 font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a1a]">Limits</h3>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-black/75">
          <li>Not a source of complete nutrition, allergen, regulatory or food-safety information. Nutrition values describe a single USDA record per ingredient.</li>
          <li>Availability covers Oregon only, comes from a 2017 planning chart, and does not separate fresh harvest from storage.</li>
          <li>Field Kitchen does not identify wild plants or mushrooms. Buy specialty ingredients from reputable suppliers.</li>
          <li>Methods are outlines without tested quantities, yields or costs.</li>
        </ul>

        <h3 className="mt-10 font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a1a]">What changed from the first prototype</h3>
        <p className="mt-2 text-sm leading-relaxed text-black/75">
          The first prototype used eight ingredients with modelled values: nutrient indices, sub-regions, source layers, harvest windows and pairing links. None of these had field-level citations, so they have been removed rather than carried forward.
        </p>
      </div>
    </section>
  );
}
