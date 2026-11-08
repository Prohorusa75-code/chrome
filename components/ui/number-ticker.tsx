"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/* Number Ticker (Magic UI, адаптирован): число плавно «докручивается» до значения,
   когда попадает в экран, и при каждом изменении value. Формат — русский (1 280). */

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  delay?: number;
  decimalPlaces?: number;
}

const fmt = (n: number, d: number) =>
  new Intl.NumberFormat("ru-RU", { minimumFractionDigits: d, maximumFractionDigits: d }).format(Number(n.toFixed(d)));

export function NumberTicker({ value, startValue = 0, delay = 0, className, decimalPlaces = 0, ...props }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(startValue);
  const springValue = useSpring(motionValue, { damping: 38, stiffness: 320, restDelta: 0.5 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      motionValue.jump(value);
      springValue.jump(value);
      return;
    }
    const timer = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, springValue, isInView, delay, value, reduce]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = fmt(latest, decimalPlaces);
      }),
    [springValue, decimalPlaces],
  );

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {fmt(startValue, decimalPlaces)}
    </span>
  );
}
