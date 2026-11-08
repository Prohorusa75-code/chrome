"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* Тахометр марок: шкала-прибор, стрелка плавно переходит от марки к марке,
   в центре — оборудование и типовые работы выбранной марки.
   Сам перебирает марки; наведение останавливает, клик выбирает.
   На экранах уже 480px подписи уходят под прибор сеткой 2×4. */

type Brand = { name: string; tools: string; work: string };

const CX = 300;
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + Math.cos(a) * r, CX + Math.sin(a) * r];
};

const TICKS = Array.from({ length: 120 }, (_, i) => {
  const deg = i * 3;
  const major = i % 15 === 0;
  const mid = i % 5 === 0;
  const [x1, y1] = polar(deg, 248);
  const [x2, y2] = polar(deg, major ? 222 : mid ? 233 : 240);
  return { x1, y1, x2, y2, major, mid };
});

export function RadialOrbitalTimeline({ brands }: { brands: Brand[] }) {
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(0); // накопленный угол, чтобы стрелка шла коротким путём
  const [paused, setPaused] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const step = 360 / brands.length;

  const go = (i: number) => {
    setActive((cur) => {
      let delta = ((i - cur) * step) % 360;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      setTurn((t) => t + delta);
      return i;
    });
  };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || userPicked) return;
    const id = setInterval(() => {
      if (!inView.current) return;
      setActive((cur) => {
        setTurn((t) => t + step);
        return (cur + 1) % brands.length;
      });
    }, 3200);
    return () => clearInterval(id);
  }, [paused, userPicked, brands.length, step]);

  // выбрал вручную — через 10 секунд прибор снова листает сам
  useEffect(() => {
    if (!userPicked) return;
    const id = setTimeout(() => setUserPicked(false), 10000);
    return () => clearTimeout(id);
  }, [userPicked, active]);

  const pick = (i: number) => {
    setUserPicked(true);
    go(i);
  };

  const pill = (i: number, extra = "") =>
    cn(
      "chip-fill inline-flex h-11 items-center justify-center rounded-full border bg-[#0c0c0f] px-4 text-[14px] whitespace-nowrap transition-[border-color,color,transform,box-shadow] duration-[450ms] hover:-translate-y-0.5",
      active === i ? "border-transparent text-[#08080a] shadow-[0_0_26px_rgba(255,255,255,.22)]" : "border-line-strong text-text hover:border-[#4a4a50]",
      extra,
    );
  const cur = brands[active];

  return (
    <div ref={box} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative mx-auto aspect-square w-full max-w-[600px] [container-type:inline-size]">
        <svg viewBox="0 0 600 600" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <radialGradient id="dial-face" cx="50%" cy="42%" r="62%">
              <stop offset="0" stopColor="#17171b" />
              <stop offset="1" stopColor="#08080a" />
            </radialGradient>
            <linearGradient id="dial-needle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#6e6e74" />
            </linearGradient>
            <linearGradient id="dial-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6e6e74" />
              <stop offset=".35" stopColor="#f4f4f6" />
              <stop offset=".65" stopColor="#3a3a40" />
              <stop offset="1" stopColor="#bdbdc3" />
            </linearGradient>
          </defs>

          <circle cx={CX} cy={CX} r="262" fill="url(#dial-face)" stroke="url(#dial-rim)" strokeWidth="1.5" />

          {/* стрелка со шлейфом */}
          <g style={{ transform: `rotate(${turn}deg)`, transformOrigin: "300px 300px", transition: "transform 1.1s cubic-bezier(.34,1.35,.64,1)" }}>
            <path d="M300 300 L300 72 A228 228 0 0 0 228 84 Z" fill="#ffffff" opacity=".05" />
            <path d="M300 300 L300 72 A228 228 0 0 0 266 75 Z" fill="#ffffff" opacity=".07" />
            <polygon points="296,152 304,152 301,70 299,70" fill="url(#dial-needle)" />
            <circle cx="300" cy="70" r="5" fill="#fff" />
            <circle cx="300" cy="70" r="15" fill="#fff" opacity=".14" />
          </g>

          <circle cx={CX} cy={CX} r="150" fill="#0b0b0e" stroke="#26262b" />
        </svg>

        {/* шкала и пунктир — отдельные слои: вращение идёт на видеокарте, без перерисовки страницы */}
        <svg viewBox="0 0 600 600" className="orbit-spin pointer-events-none absolute inset-0 size-full will-change-transform" aria-hidden="true">
          {TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "#bdbdc3" : t.mid ? "#5a5a61" : "#2e2e34"} strokeWidth={t.major ? 2.5 : 1.2} />
          ))}
        </svg>
        <svg viewBox="0 0 600 600" className="orbit-counter pointer-events-none absolute inset-0 size-full will-change-transform" aria-hidden="true">
          <circle cx={CX} cy={CX} r="196" fill="none" stroke="#3a3a40" strokeDasharray="2 9" />
        </svg>

        {/* показания в центре */}
        <div id="brand-card" aria-live={userPicked ? "polite" : "off"} className="absolute top-1/2 left-1/2 w-[46cqw] -translate-x-1/2 -translate-y-1/2 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.36, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <p className="chrome-text text-[clamp(20px,6cqw,34px)] leading-[1.08] font-light tracking-[-0.03em]">{cur.name}</p>
              <p className="mt-[1.6cqw] text-[clamp(12px,2.4cqw,14px)] text-text">{cur.tools}</p>
              <p className="mt-[1cqw] text-[clamp(11px,2.2cqw,13px)] leading-[1.35] text-text-muted">{cur.work}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* подписи вокруг прибора — от 480px */}
        <ul className="absolute inset-0 hidden min-[480px]:block" aria-label="Марки, с которыми работаем">
          {brands.map((b, i) => {
            const a = (((i * step - 90) * Math.PI) / 180);
            return (
              <li key={b.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(a) * 43.5}%`, top: `${50 + Math.sin(a) * 43.5}%` }}>
                <button type="button" aria-pressed={active === i} aria-controls="brand-card" onClick={() => pick(i)} className={pill(i)}>
                  {b.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* подписи сеткой — до 480px */}
      <ul className="mt-6 grid grid-cols-2 gap-2 min-[480px]:hidden" aria-label="Марки, с которыми работаем">
        {brands.map((b, i) => (
          <li key={b.name}>
            <button type="button" aria-pressed={active === i} aria-controls="brand-card" onClick={() => pick(i)} className={pill(i, "w-full")}>
              {b.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
