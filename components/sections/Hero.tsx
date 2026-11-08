import type { CSSProperties, ReactNode } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { SpinningWheel } from "@/components/ui/spinning-wheel";
import { HERO } from "@/lib/data";
import { WRAP } from "./wrap";

/* по очереди снизу вверх, из размытия: задержки 0.1 / 0.3 / 0.5 / 0.7 с (CSS-анимация .rise) */
function Rise({ delay, children, className = "" }: { delay: number; children: ReactNode; className?: string }) {
  return (
    <div className={`rise ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[max(100svh,680px)] items-end overflow-hidden pt-[76px] pb-12 lg:min-h-[max(100svh,860px)] lg:items-center lg:pb-0">
      {/* диск: на компьютере справа и уходит за край, на телефоне сверху за текстом */}
      <div className="wheel-in pointer-events-none absolute top-[1%] left-1/2 w-[116vw] max-w-[620px] -translate-x-1/2 opacity-70 lg:top-1/2 lg:right-[-9vw] lg:left-auto lg:w-[min(62vw,102vh,1040px)] lg:max-w-none lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-100">
        <SpinningWheel />
      </div>
      {/* затемнение: снизу на телефоне, слева на компьютере — чтобы текст читался */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,rgba(8,8,10,.86)_52%,#08080a_78%)] lg:bg-[linear-gradient(90deg,#08080a_30%,rgba(8,8,10,.72)_50%,transparent_72%)]" aria-hidden="true" />

      <div className={`${WRAP} relative z-10`}>
        <Rise delay={0.1}>
          <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">{HERO.eyebrow}</p>
        </Rise>
        <Rise delay={0.3}>
          <h1 id="hero-title" className="mt-7 text-[clamp(44px,6.2vw,104px)] leading-[0.98] tracking-[-0.045em]">
            <span className="chrome-text block font-light">{HERO.titleTop}</span>
            <span className="chrome-text block font-medium">{HERO.titleBottom}</span>
          </h1>
        </Rise>
        <Rise delay={0.5}>
          <p className="mt-8 max-w-[540px] text-[clamp(17px,1.5vw,19px)] leading-[1.6] text-text-muted">{HERO.text}</p>
        </Rise>
        <Rise delay={0.7} className="mt-11 flex flex-col gap-3 sm:flex-row">
          <LiquidMetalButton href="#booking" variant="light" className="w-full sm:w-auto">
            {HERO.primary}
          </LiquidMetalButton>
          <LiquidMetalButton href="#calc" variant="dark" className="w-full sm:w-auto">
            {HERO.secondary}
          </LiquidMetalButton>
        </Rise>
      </div>
    </section>
  );
}
