"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MetalShader } from "./metal-shader";

/* Кнопка с металлической обводкой. Обводка видна всегда (CSS-хром),
   поверх неё — живой жидкий металл, пока кнопка на экране.
   (Замена компонента 21st.dev «Liquid Metal Button» на том же шейдере @paper-design.) */

type Variant = "light" | "dark" | "outline";

type Common = { children: ReactNode; variant?: Variant; className?: string; full?: boolean; size?: "md" | "lg" };
type AsLink = Common & { href: string; external?: boolean; onClick?: () => void };
type AsButton = Common & { href?: undefined; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean };

const fills: Record<Variant, string> = {
  light: "chrome-fill",
  dark: "bg-[#0c0c0f] text-text",
  outline: "bg-bg text-text",
};

export function LiquidMetalButton(props: AsLink | AsButton) {
  const { children, variant = "light", className, full, size = "lg" } = props;
  const inner = (
    <>
      <span className="metal-ring absolute inset-0 rounded-full" aria-hidden="true" />
      <MetalShader
        onlyInView
        className="absolute inset-0 overflow-hidden rounded-full opacity-90"
        shape="none"
        colorBack="#9a9aa1"
        colorTint="#ffffff"
        repetition={3}
        softness={0.2}
        shiftRed={0}
        shiftBlue={0}
        distortion={0.12}
        contour={0.3}
        angle={90}
        scale={1.6}
        speed={0.6}
        maxPixelCount={240 * 80}
      />
      <span className={cn("absolute inset-[1.5px] rounded-full", fills[variant])} aria-hidden="true" />
      <span className={cn("relative z-10 flex items-center justify-center gap-2", variant === "light" ? "text-[#08080a]" : "text-text")}>{children}</span>
    </>
  );
  const cls = cn(
    "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-transform duration-300 ease-chrome hover:-translate-y-0.5 active:translate-y-0",
    size === "lg" ? "h-14 px-8 text-[16px]" : "h-11 px-6 text-[15px]",
    full && "w-full",
    className,
  );

  if (props.href !== undefined) {
    return (
      <a href={props.href} onClick={props.onClick} className={cls} {...(props.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled} className={cn(cls, "disabled:cursor-wait disabled:opacity-80")}>
      {inner}
    </button>
  );
}
