import { RadialOrbitalTimeline } from "@/components/ui/radial-orbital-timeline";
import { Reveal } from "@/components/ui/reveal";
import { ORBIT_BRANDS } from "@/lib/data";
import { SECTION, WRAP } from "./wrap";

export function Brands() {
  return (
    <section id="brands" aria-labelledby="brands-title" className={`${WRAP} ${SECTION} overflow-hidden`}>
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Специализация</p>
          <h2 id="brands-title" className="chrome-text mt-5 text-[clamp(36px,4.8vw,68px)] leading-[1.02] font-light tracking-[-0.04em]">
            Только немецкая школа
          </h2>
          <p className="mt-7 max-w-[480px] text-[clamp(17px,1.5vw,19px)] leading-[1.6] text-text-muted">
            Мастера проходили обучение в дилерских центрах. Работаем с моделями 2008–2026 годов, включая гибриды и электромобили.
          </p>
          <p className="mt-5 text-[15px] text-text-dim">Нажмите на марку, чтобы увидеть оборудование и типовые работы.</p>
        </Reveal>
        <Reveal delay={0.12}>
          <RadialOrbitalTimeline brands={ORBIT_BRANDS} />
        </Reveal>
      </div>
    </section>
  );
}
