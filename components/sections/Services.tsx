import { Reveal, SectionHead } from "@/components/ui/reveal";
import { SERVICES } from "@/lib/data";
import { money } from "@/lib/format";
import { SECTION, WRAP } from "./wrap";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className={`${WRAP} ${SECTION}`}>
      <SectionHead id="services-title" eyebrow="Услуги" title="Каждая деталь — по регламенту" />
      {/* линии 1px между карточками: сетка с gap 1px на фоне линии */}
      <ul className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <li key={s.n} className="bg-bg">
            <Reveal delay={i * 0.06} className="h-full">
              <a
                href="#calc"
                className="group relative flex h-full min-h-[300px] flex-col overflow-hidden p-8 outline-offset-[-2px] transition-colors duration-500 hover:bg-[#0c0c0f] focus-visible:bg-[#0c0c0f] lg:p-10"
              >
                <span className="card-glint pointer-events-none absolute inset-y-0 left-0 w-1/2" aria-hidden="true" />
                <span className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-[#2e2e34]" aria-hidden="true" />
                <span className="text-[64px] leading-none font-extralight tracking-[-0.04em] text-numeral" aria-hidden="true">
                  {s.n}
                </span>
                <span className="mt-auto pt-10">
                  <span className="block text-[24px] font-medium tracking-[-0.02em] text-text">{s.title}</span>
                  <span className="mt-3 block text-[16px] leading-[1.55] text-text-muted">{s.text}</span>
                  <span className="chrome-text mt-6 inline-block text-[22px] font-light tracking-[-0.03em]">от {money(s.price)}</span>
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
