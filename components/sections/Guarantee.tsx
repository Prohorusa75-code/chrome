import { Reveal } from "@/components/ui/reveal";
import { GUARANTEE } from "@/lib/data";
import { SECTION, WRAP } from "./wrap";

export function Guarantee() {
  return (
    <section aria-labelledby="guarantee-title" className={`${WRAP} ${SECTION}`}>
      <h2 id="guarantee-title" className="sr-only">Гарантия</h2>
      <Reveal>
        <div className="grid items-center gap-10 rounded-[32px] border border-line p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* значок: вращается только кольцо, цифра неподвижна */}
          <div className="relative mx-auto size-[180px]" aria-hidden="true">
            <div className="ring-spin absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 210deg, #3a3a40, #f4f4f6, #6e6e74, #ffffff, #3a3a40)" }} />
            <div className="absolute inset-[2px] flex flex-col items-center justify-center rounded-full bg-bg">
              <span className="chrome-text text-[64px] leading-none font-light tracking-[-0.05em]">12</span>
              <span className="mt-2 text-[12px] tracking-[0.24em] text-text-muted uppercase">месяцев</span>
            </div>
          </div>
          <ul className="grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {GUARANTEE.map((g, i) => (
              <li key={g.title} className="md:px-8 first:md:pl-0">
                <Reveal delay={0.06 * i}>
                  <p className="text-[20px] font-medium tracking-[-0.02em] text-text">{g.title}</p>
                  <p className="mt-3 text-[16px] leading-[1.6] text-text-muted">{g.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
