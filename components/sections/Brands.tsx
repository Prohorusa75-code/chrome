import { RadialOrbitalTimeline } from "@/components/ui/radial-orbital-timeline";
import { Reveal } from "@/components/ui/reveal";
import { ORBIT_BRANDS } from "@/lib/data";
import { SECTION, WRAP } from "./wrap";

/* бегущая линия телеметрии: узор повторяется дважды и сдвигается на половину ширины */
function wave(amp: number, mid: number, seed: number) {
  let d = `M0 ${mid}`;
  for (let k = 0; k < 2; k++) {
    for (let i = 1; i <= 20; i++) {
      const x = k * 600 + i * 30;
      const v = Math.sin(i * 0.9 + seed) * 0.6 + Math.sin(i * 2.3 + seed * 2) * 0.4;
      const y = i === 20 ? mid : mid + v * amp;
      d += ` L${x} ${y.toFixed(1)}`;
    }
  }
  return d;
}

function Telemetry() {
  return (
    <div className="mt-10 max-w-[520px] overflow-hidden rounded-[24px] border border-line bg-bg-raised" aria-hidden="true">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 text-[11px] tracking-[0.12em] sm:text-[12px] sm:tracking-[0.18em] text-text-muted uppercase">
        <span>Скан блоков управления</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="live-dot size-1.5 rounded-full bg-chrome-light" />
          2008–2026
        </span>
      </div>
      <div className="relative mt-2 h-[92px] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <svg viewBox="0 0 600 92" preserveAspectRatio="none" className="absolute inset-0 size-full">
          {[23, 46, 69].map((y) => (
            <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#1c1c20" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <svg viewBox="0 0 1200 92" preserveAspectRatio="none" className="signal-run absolute inset-y-0 left-0 h-full w-[200%]">
          <path d={wave(14, 56, 2.1)} fill="none" stroke="#3a3a40" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d={wave(26, 44, 0.4)} fill="none" stroke="#e6e6ea" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

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
          <Telemetry />
          <p className="mt-5 text-[15px] text-text-dim">Нажмите на марку, чтобы увидеть оборудование и типовые работы.</p>
        </Reveal>
        <Reveal delay={0.12}>
          <RadialOrbitalTimeline brands={ORBIT_BRANDS} />
        </Reveal>
      </div>
    </section>
  );
}
