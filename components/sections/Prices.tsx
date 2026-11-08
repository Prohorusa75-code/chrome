import { Reveal } from "@/components/ui/reveal";
import { PRICES } from "@/lib/data";
import { SECTION, WRAP } from "./wrap";

export function Prices() {
  return (
    <section id="prices" aria-labelledby="prices-title" className={`${WRAP} ${SECTION}`}>
      <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Цены</p>
          <h2 id="prices-title" className="chrome-text mt-5 text-[clamp(36px,4.8vw,68px)] leading-[1.02] font-light tracking-[-0.04em]">
            Стоимость по маркам
          </h2>
        </div>
        <p className="max-w-[440px] text-[17px] leading-[1.6] text-text-muted lg:justify-self-end">
          Работы без учёта запчастей. Оригинал или сертифицированный аналог — на ваш выбор.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-14 overflow-x-auto rounded-[24px] border border-line" tabIndex={0} role="region" aria-label="Таблица цен, прокручивается по горизонтали">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Стоимость работ по маркам, BYN</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-5 text-[13px] font-normal tracking-[0.14em] text-text-muted uppercase sm:px-8">
                  Работа
                </th>
                {PRICES.columns.map((c) => (
                  <th key={c} scope="col" className="px-6 py-5 text-[13px] font-normal tracking-[0.14em] text-text-muted uppercase sm:px-8">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICES.rows.map((r) => (
                <tr key={r.work} className="border-b border-line transition-colors duration-300 last:border-b-0 hover:bg-white/[0.025]">
                  <th scope="row" className="px-6 py-5 text-[17px] font-normal text-text sm:px-8">
                    {r.work}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="px-6 py-5 text-[17px] text-text-muted tabular-nums sm:px-8">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
