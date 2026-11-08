"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* Орбита марок (по мотивам «Radial Orbital Timeline» с 21st.dev — компонент не удалось скачать
   из-за лимита аккаунта, собран по описанию задания): хромированная сфера в центре,
   8 пилюль на внешней орбите, полный оборот за 90 с, подписи всегда горизонтальны.
   Клик по марке раскрывает карточку; орбита при этом останавливается.
   На экранах уже 480px орбита превращается в сетку пилюль 2×4. */

type Brand = { name: string; tools: string; work: string };

export function RadialOrbitalTimeline({ brands }: { brands: Brand[] }) {
  const [active, setActive] = useState<number | null>(null);
  const toggle = (i: number) => setActive((a) => (a === i ? null : i));
  const current = active === null ? null : brands[active];

  const pill = (i: number, extra = "") =>
    cn(
      "inline-flex h-11 items-center justify-center rounded-full border px-4 text-[14px] whitespace-nowrap transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5",
      active === i ? "chrome-fill border-transparent" : "border-line-strong bg-[#0c0c0f]/90 text-text hover:border-[#3a3a40]",
      extra,
    );

  return (
    <div className="relative">
      {/* орбита — от 480px */}
      <div className={cn("relative mx-auto hidden aspect-square w-full max-w-[560px] [container-type:inline-size] min-[480px]:block", active !== null && "orbit-paused")}>
        <div className="absolute inset-[9%] rounded-full border border-line-strong" aria-hidden="true" />
        <div className="absolute inset-[27%] rounded-full border border-dashed border-line-strong/80" aria-hidden="true" />
        {/* сфера */}
        <div className="absolute top-1/2 left-1/2 size-[clamp(100px,25%,140px)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" />
          <div className="relative size-full rounded-full shadow-[0_0_60px_rgba(255,255,255,.18)]" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #9a9aa1 40%, #2a2a2e 75%)" }} />
        </div>
        {/* вращающееся кольцо с марками */}
        <ul className="orbit-spin absolute inset-[9%]" aria-label="Марки, с которыми работаем">
          {brands.map((b, i) => {
            const angle = (i / brands.length) * 360 - 90;
            return (
              <li
                key={b.name}
                className="absolute top-1/2 left-1/2"
                style={{ transform: `rotate(${angle}deg) translateX(41cqw) rotate(${-angle}deg)` }}
              >
                <div className="orbit-counter -translate-x-1/2 -translate-y-1/2">
                  <button type="button" aria-pressed={active === i} aria-controls="brand-card" onClick={() => toggle(i)} className={pill(i)}>
                    {b.name}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* сетка пилюль — до 480px */}
      <ul className="grid grid-cols-2 gap-2 min-[480px]:hidden" aria-label="Марки, с которыми работаем">
        {brands.map((b, i) => (
          <li key={b.name}>
            <button type="button" aria-pressed={active === i} aria-controls="brand-card" onClick={() => toggle(i)} className={pill(i, "w-full")}>
              {b.name}
            </button>
          </li>
        ))}
      </ul>

      {/* карточка выбранной марки */}
      <div id="brand-card" aria-live="polite" className="mt-6 min-h-[1px] min-[480px]:absolute min-[480px]:inset-x-0 min-[480px]:bottom-0 min-[480px]:mt-0">
        <AnimatePresence>
          {current && (
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              className="relative mx-auto max-w-[420px] rounded-[24px] border border-line-strong bg-[#0c0c0f]/95 p-6 backdrop-blur-md"
            >
              <button type="button" onClick={() => setActive(null)} aria-label="Закрыть" className="absolute top-2 right-2 grid size-11 place-items-center rounded-full text-text-muted hover:text-text">
                <X className="size-4" strokeWidth={1.5} />
              </button>
              <p className="chrome-text text-2xl font-light tracking-[-0.03em]">{current.name}</p>
              <p className="mt-3 text-[13px] tracking-[0.2em] text-text-muted uppercase">Оборудование</p>
              <p className="text-text">{current.tools}</p>
              <p className="mt-3 text-[13px] tracking-[0.2em] text-text-muted uppercase">Что делаем</p>
              <p className="text-text">{current.work}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
