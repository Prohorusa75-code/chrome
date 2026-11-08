"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

/* Animated Testimonials (Aceternity UI, адаптирован под CHROME):
   без фото — хромированный круг с инициалами; крупная цитата с пословным появлением;
   автопрокрутка каждые 7 секунд, пауза при наведении и фокусе; точки и стрелки. */

type Testimonial = { quote: string; name: string; car: string };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .replace(/\./g, "")
    .slice(0, 2);

export function AnimatedTestimonials({ testimonials, autoplay = true, interval = 7000 }: { testimonials: Testimonial[]; autoplay?: boolean; interval?: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = testimonials.length;

  const next = useCallback(() => setActive((p) => (p + 1) % n), [n]);
  const prev = useCallback(() => setActive((p) => (p - 1 + n) % n), [n]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoplay, paused, next, interval]);

  const t = testimonials[active];

  return (
    <div
      className="mx-auto max-w-[1000px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid items-start gap-10 md:grid-cols-[120px_1fr] md:gap-14">
        {/* хромированный круг с инициалами вместо фото */}
        <div className="relative mx-auto size-[96px] md:size-[120px]" aria-hidden="true">
          <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 210deg, #3a3a40, #f4f4f6, #6e6e74, #ffffff, #3a3a40)" }} />
          <div className="absolute inset-[2px] grid place-items-center rounded-full bg-[#0c0c0f]">
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="chrome-text text-3xl font-light tracking-[-0.02em] md:text-4xl"
              >
                {initials(t.name)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="min-h-[260px] text-center md:min-h-[230px] md:text-left">
          <AnimatePresence mode="wait">
            <motion.figure
              key={active}
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <blockquote className="text-[clamp(26px,3.2vw,44px)] leading-[1.22] font-light tracking-[-0.03em] text-text">
                <span aria-hidden="true">«</span>
                {t.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={reduce ? { opacity: 0 } : { filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={reduce ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: reduce ? 0 : 0.02 * i }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
                <span aria-hidden="true">»</span>
              </blockquote>
              <figcaption className="mt-8 text-[17px] text-text-muted">
                {t.name} · {t.car}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-6">
        <button type="button" onClick={prev} aria-label="Предыдущий отзыв" className="grid size-11 place-items-center rounded-full border border-line-strong text-text-muted transition-[transform,color,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#3a3a40] hover:text-text">
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-1" role="tablist" aria-label="Отзывы">
          {testimonials.map((r, i) => (
            <button
              key={r.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Отзыв ${i + 1}: ${r.name}`}
              onClick={() => setActive(i)}
              className="grid h-11 w-11 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-[width,background-color] duration-500 ${i === active ? "w-9 bg-chrome-light" : "w-2 bg-line-strong"}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Следующий отзыв" className="grid size-11 place-items-center rounded-full border border-line-strong text-text-muted transition-[transform,color,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#3a3a40] hover:text-text">
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
