"use client";

import { useMemo, useState } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal } from "@/components/ui/reveal";
import { CALC_BRANDS, CALC_DEFAULT, CALC_WORKS, CURRENCY, type CalcBrandId } from "@/lib/data";
import { hours, money, plural } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SECTION, WRAP } from "./wrap";

/* цена работы для марки: round(базовая × коэффициент / 10) × 10 */
export const priceFor = (base: number, k: number) => Math.round((base * k) / 10) * 10;

export function Calculator() {
  const [brand, setBrand] = useState<CalcBrandId>(CALC_DEFAULT.brand);
  const [works, setWorks] = useState<string[]>(CALC_DEFAULT.works);
  const k = CALC_BRANDS.find((b) => b.id === brand)!.k;

  const { total, time, count } = useMemo(() => {
    const chosen = CALC_WORKS.filter((w) => works.includes(w.id));
    return {
      total: chosen.reduce((s, w) => s + priceFor(w.base, k), 0),
      time: chosen.reduce((s, w) => s + w.hours, 0),
      count: chosen.length,
    };
  }, [works, k]);

  const [startTotal] = useState(total); // начальное значение счётчика — один раз, дальше он «докручивается»
  const toggle = (id: string) => setWorks((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  return (
    <section id="calc" aria-labelledby="calc-title" className={`${WRAP} ${SECTION}`}>
      <Reveal>
        <div className="grid overflow-hidden rounded-[32px] border border-line bg-[linear-gradient(180deg,#0f0f12,#08080a)] lg:grid-cols-[2fr_1fr]">
          <div className="p-6 sm:p-10 lg:p-12">
            <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Калькулятор</p>
            <h2 id="calc-title" className="chrome-text mt-5 text-[clamp(36px,4.8vw,68px)] leading-[1.02] font-light tracking-[-0.04em]">
              Предварительная смета
            </h2>

            <div className="mt-10 inline-flex max-w-full flex-wrap gap-1 rounded-[28px] border border-line-strong p-1" role="radiogroup" aria-label="Марка автомобиля">
              {CALC_BRANDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  role="radio"
                  aria-checked={brand === b.id}
                  onClick={() => setBrand(b.id)}
                  className={cn(
                    "h-11 rounded-full px-5 text-[15px] transition-[background-color,color] duration-300",
                    brand === b.id ? "chrome-fill font-medium" : "text-text-muted hover:text-text",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <ul className="mt-8 divide-y divide-line border-y border-line" aria-label="Работы">
              {CALC_WORKS.map((w) => {
                const on = works.includes(w.id);
                return (
                  <li key={w.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(w.id)}
                      className="flex min-h-14 w-full items-center gap-4 py-4 text-left transition-colors duration-300 hover:bg-white/[0.02]"
                    >
                      <span
                        className={cn(
                          "grid size-[18px] shrink-0 place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-300",
                          on ? "border-transparent bg-[linear-gradient(180deg,#f4f4f6,#bdbdc3)] shadow-[0_0_14px_rgba(255,255,255,.35)]" : "border-line-strong",
                        )}
                        aria-hidden="true"
                      >
                        {on && <span className="size-1.5 rounded-full bg-[#08080a]" />}
                      </span>
                      <span className={cn("flex-1 text-[16px] transition-colors sm:text-[17px]", on ? "text-text" : "text-text-muted")}>{w.label}</span>
                      <span className={cn("text-[16px] tabular-nums transition-colors sm:text-[17px]", on ? "text-text" : "text-text-muted")}>{money(priceFor(w.base, k))}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-10 border-t border-line p-6 sm:p-10 lg:border-t-0 lg:border-l lg:p-12">
            <div aria-live="polite" aria-atomic="true">
              <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Итого, предварительно</p>
              <p className="chrome-text mt-5 text-[clamp(56px,5.6vw,84px)] leading-none font-light tracking-[-0.05em] whitespace-nowrap">
                <NumberTicker value={total} startValue={startTotal} />
                <span className="ml-2 text-[0.42em] tracking-[-0.02em]">{CURRENCY}</span>
              </p>
              <p className="mt-4 text-[17px] text-text-muted">
                {count} {plural(count, ["работа", "работы", "работ"])} · ≈ {hours(time)} ч
              </p>
              <span className="sr-only">Итого {money(total)}</span>
            </div>
            <div>
              <p className="mb-6 text-[14px] leading-[1.6] text-text-dim">Окончательная стоимость утверждается после осмотра и фиксируется в заказ-наряде.</p>
              <LiquidMetalButton href="#booking" variant="light" full>
                Записаться с этой сметой
              </LiquidMetalButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
