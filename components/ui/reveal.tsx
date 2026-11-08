"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/* Появление при прокрутке: снизу вверх, из размытия. При «меньше движения» — только проявление. */
export function Reveal({ children, delay = 0, className, y = 30, blur = 8, duration = 0.8, once = true }: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  blur?: number;
  duration?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0, y: 0, filter: "blur(0px)" } : { opacity: 0, y, filter: `blur(${blur}px)` }}
      // конечное состояние всегда без сдвига и размытия — даже если сервер отдал блок «размытым»
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: reduce ? 0.3 : duration, delay: reduce ? 0 : delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Заголовок секции: надзаголовок + хромированный H2 */
export function SectionHead({ id, eyebrow, title, align = "center", className }: { id: string; eyebrow: string; title: ReactNode; align?: "center" | "left"; className?: string }) {
  return (
    <Reveal className={className}>
      <div className={align === "center" ? "text-center" : ""}>
        <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">{eyebrow}</p>
        <h2 id={id} className="chrome-text mt-5 text-[clamp(36px,4.8vw,68px)] leading-[1.02] font-light tracking-[-0.04em]">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
