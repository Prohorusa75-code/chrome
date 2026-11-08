import type { CSSProperties, ReactNode } from "react";
import { LiquidMetalHero } from "@/components/ui/liquid-metal-hero";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { HERO } from "@/lib/data";
import { WRAP } from "./wrap";

/* по очереди снизу вверх, из размытия 10px: задержки 0.1 / 0.3 / 0.5 / 0.7 с (CSS-анимация .rise) */
function Rise({ delay, children, className = "" }: { delay: number; children: ReactNode; className?: string }) {
  return (
    <div className={`rise ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[max(100svh,640px)] items-center overflow-hidden pt-[76px] lg:min-h-[max(100svh,940px)]">
      <LiquidMetalHero />
      <div className={`${WRAP} relative z-10 text-center`}>
        <Rise delay={0.1}>
          <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">{HERO.eyebrow}</p>
        </Rise>
        <Rise delay={0.3}>
          <h1 id="hero-title" className="mt-7 text-[clamp(44px,7.4vw,112px)] leading-[0.98] tracking-[-0.045em]">
            <span className="chrome-text block font-light">{HERO.titleTop}</span>
            <span className="chrome-text block font-medium">{HERO.titleBottom}</span>
          </h1>
        </Rise>
        <Rise delay={0.5}>
          <p className="mx-auto mt-8 max-w-[620px] text-[clamp(17px,1.5vw,19px)] leading-[1.6] text-text-muted">{HERO.text}</p>
        </Rise>
        <Rise delay={0.7} className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
