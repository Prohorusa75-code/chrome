"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";

/* Шейдер жидкого металла (@paper-design/shaders-react) — только на клиенте и не раньше,
   чем браузер освободится после первой отрисовки. Пока он грузится, виден CSS-фолбэк под ним.
 */

const LiquidMetal = dynamic(() => import("@paper-design/shaders-react").then((m) => m.LiquidMetal), { ssr: false });

type Props = ComponentProps<typeof LiquidMetal> & {
  /** монтировать только пока элемент виден на экране */
  onlyInView?: boolean;
};

export function MetalShader({ onlyInView = false, className, ...props }: Props) {
  const [idle, setIdle] = useState(false);
  const [inView, setInView] = useState(!onlyInView);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // шейдеры компилируются тяжело: запускаем, когда страница уже отрисовалась и отвечает.
    // Пока их нет, видна такая же CSS-обводка.
    let idleId = 0;
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      else setIdle(true);
    }, 3500);
    return () => {
      clearTimeout(timer);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, []);

  useEffect(() => {
    if (!onlyInView || !box.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [onlyInView]);

  return (
    <div ref={box} className={className} aria-hidden="true">
      {idle && inView && <LiquidMetal {...props} style={{ width: "100%", height: "100%", ...props.style }} />}
    </div>
  );
}
