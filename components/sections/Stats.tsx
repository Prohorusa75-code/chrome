import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal } from "@/components/ui/reveal";
import { STATS } from "@/lib/data";
import { WRAP } from "./wrap";

export function Stats() {
  return (
    <section aria-label="Цифры сервиса" className={WRAP}>
      <Reveal>
        <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-9 text-center sm:px-8 lg:py-12 ${i % 2 === 0 ? "border-r border-line" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}
            >
              <dt className="chrome-text text-[clamp(34px,4vw,56px)] leading-none font-light tracking-[-0.05em]">
                <NumberTicker value={s.value} startValue={s.from} delay={0.15 * i} />
                {s.suffix}
              </dt>
              <dd className="mt-3 text-[15px] text-text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
