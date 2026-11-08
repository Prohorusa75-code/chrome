"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useReducedMotion } from "motion/react";

/* Шейдер жидкого металла (@paper-design/shaders-react) — только на клиенте и не раньше,
   чем браузер освободится после первой отрисовки. Пока он грузится, виден CSS-фолбэк под ним.
   При «меньше движения» шейдер не запускается вовсе. */

const LiquidMetal = dynamic(() => import("@paper-design/shaders-react").then((m) => m.LiquidMetal), { ssr: false });

type Props = ComponentProps<typeof LiquidMetal> & {
  /** монтировать только пока элемент виден на экране */
  onlyInView?: boolean;
};

export function MetalShader({ onlyInView = false, className, ...props }: Props) {
  const reduce = useReducedMotion();
  const [idle, setIdle] = useState(false);
  const [inView, setInView] = useState(!onlyInView);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // в Safari нет requestIdleCallback — там просто небольшая пауза
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!onlyInView || !box.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [onlyInView]);

  return (
    <div ref={box} className={className} aria-hidden="true">
      {idle && inView && !reduce && <LiquidMetal {...props} style={{ width: "100%", height: "100%", ...props.style }} />}
    </div>
  );
}
