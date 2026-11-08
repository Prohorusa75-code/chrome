"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Reveal, SectionHead } from "@/components/ui/reveal";
import { isBusy, nextWorkingDays, submitBooking, type Day } from "@/lib/booking";
import { BOOKING } from "@/lib/data";
import { belarusDigits, formatBelarusPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SECTION, WRAP } from "./wrap";

const HOURS = Array.from({ length: BOOKING.lastHour - BOOKING.firstHour + 1 }, (_, i) => BOOKING.firstHour + i);
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

/* слот недоступен: занят по расписанию или уже прошёл (для сегодняшнего дня) */
const slotBusy = (cur: Day | undefined, now: Date | null, h: number) =>
  !cur || isBusy(cur.iso, h) || (cur.isToday && now !== null && h <= now.getHours());

export function Booking() {
  const reduce = useReducedMotion();
  const uid = useId();
  // даты считаем в браузере — на опубликованном сайте не должно застыть «сегодня» дня сборки
  const [days, setDays] = useState<Day[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [pickup, setPickup] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [state, setState] = useState<"form" | "sending" | "done">("form");

  useEffect(() => {
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- дата известна только в браузере
    setNow(d);
    setDays(nextWorkingDays(6, d));
  }, []);

  const busy = (h: number) => slotBusy(days[day], now, h);

  // если выбранное время недоступно в новом дне — берём первое свободное
  useEffect(() => {
    if (!days.length) return;
    if (hour === null || slotBusy(days[day], now, hour)) {
      const free = HOURS.find((h) => !slotBusy(days[day], now, h));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- подбор свободного слота после смены дня
      setHour(free ?? null);
    }
  }, [days, day, now, hour]);

  const when = days[day] && hour !== null ? `${days[day].label}, ${hh(hour)}` : "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Напишите, как к вам обращаться";
    if (belarusDigits(phone).length !== 12) next.phone = "Нужен номер из 12 цифр: +375 (29) 123-45-67";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(next.name ? `${uid}-name` : `${uid}-phone`)?.focus();
      return;
    }
    if (!when) return;
    setState("sending");
    await submitBooking({ day: days[day].iso, time: hh(hour!), pickup, name: name.trim(), phone, car: car.trim() });
    setState("done");
  }

  const field = "h-14 w-full rounded-2xl border border-line-strong bg-[#08080a] px-5 text-[16px] text-text placeholder:text-text-dim transition-colors focus:border-[#4a4a50]";
  const chip = (on: boolean, disabled = false) =>
    cn(
      "chip-fill rounded-full border transition-[border-color,color,transform] duration-[450ms]",
      on ? "border-transparent text-[#08080a]" : "border-line-strong text-text hover:border-[#3a3a40]",
      disabled && "cursor-not-allowed opacity-30 hover:border-line-strong",
    );

  return (
    <section id="booking" aria-labelledby="booking-title" className={`${WRAP} ${SECTION}`}>
      <SectionHead id="booking-title" eyebrow="Онлайн-запись" title="Персональный визит" />
      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 max-w-[920px] rounded-[32px] border border-line bg-bg-raised p-6 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {state === "done" ? (
              <motion.div
                key="done"
                role="status"
                initial={{ opacity: 0, y: 20, filter: reduce ? "blur(0px)" : "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                className="py-10 text-center"
              >
                <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Вы записаны</p>
                <p className="chrome-text mt-5 text-[clamp(40px,6vw,76px)] leading-none font-light tracking-[-0.045em]">{when}</p>
                <p className="mx-auto mt-6 max-w-[460px] text-[17px] leading-[1.6] text-text-muted">{BOOKING.success}</p>
                <p className="mt-2 text-[14px] text-text-dim">Это концепт для портфолио: заявка никуда не отправлена.</p>
                <div className="mt-9">
                  <LiquidMetalButton variant="outline" onClick={() => setState("form")}>
                    Изменить время
                  </LiquidMetalButton>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <fieldset>
                  <legend className="text-[13px] tracking-[0.3em] text-text-muted uppercase">День</legend>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {days.length === 0
                      ? Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[84px] rounded-[20px] border border-line" aria-hidden="true" />)
                      : days.map((d, i) => (
                          <button key={d.iso} type="button" aria-pressed={day === i} aria-label={d.label} onClick={() => setDay(i)} className={cn(chip(day === i), "flex h-[84px] flex-col items-center justify-center rounded-[20px]")}>
                            <span className={cn("text-[12px]", day === i ? "text-[#08080a]/70" : "text-text-muted")}>{d.weekday}</span>
                            <span className="mt-1 text-[24px] leading-none font-light">{d.date}</span>
                          </button>
                        ))}
                  </div>
                </fieldset>

                <fieldset className="mt-8">
                  <legend className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Время</legend>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {HOURS.map((h) => {
                      const off = busy(h);
                      return (
                        <button
                          key={h}
                          type="button"
                          disabled={off}
                          aria-pressed={hour === h}
                          aria-label={off ? `${hh(h)} — занято` : hh(h)}
                          onClick={() => setHour(h)}
                          className={cn(chip(hour === h, off), "h-11 text-[15px] tabular-nums")}
                        >
                          {hh(h)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8 flex items-center justify-between gap-6 rounded-[20px] border border-line p-5">
                  <div>
                    <p id={`${uid}-pickup`} className="text-[17px] text-text">{BOOKING.pickupTitle}</p>
                    <p className="mt-1 text-[14px] text-text-muted">{BOOKING.pickupText}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pickup}
                    aria-labelledby={`${uid}-pickup`}
                    onClick={() => setPickup((p) => !p)}
                    className={cn("relative h-8 w-14 shrink-0 rounded-full border transition-colors duration-300", pickup ? "border-transparent bg-[linear-gradient(180deg,#f4f4f6,#bdbdc3)]" : "border-line-strong bg-[#08080a]")}
                  >
                    <span className={cn("absolute top-1/2 left-1 size-6 -translate-y-1/2 rounded-full transition-transform duration-300 ease-chrome", pickup ? "translate-x-6 bg-[#08080a]" : "bg-text-muted")} />
                  </button>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-name`} className="mb-2 block text-[14px] text-text-muted">Имя</label>
                    <input id={`${uid}-name`} value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((x) => ({ ...x, name: undefined })); }} autoComplete="name" placeholder="Как к вам обращаться" className={field} aria-invalid={!!errors.name} aria-describedby={`${uid}-name-err`} />
                    <p id={`${uid}-name-err`} aria-live="polite" className="mt-2 min-h-5 text-[14px] text-text">{errors.name}</p>
                  </div>
                  <div>
                    <label htmlFor={`${uid}-phone`} className="mb-2 block text-[14px] text-text-muted">Телефон</label>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => { setPhone(formatBelarusPhone(e.target.value)); if (errors.phone) setErrors((x) => ({ ...x, phone: undefined })); }}
                      onFocus={() => !phone && setPhone("+375 (")}
                      onBlur={() => belarusDigits(phone) === "375" && setPhone("")}
                      placeholder="+375 (__) ___-__-__"
                      className={field}
                      aria-invalid={!!errors.phone}
                      aria-describedby={`${uid}-phone-err`}
                    />
                    <p id={`${uid}-phone-err`} aria-live="polite" className="mt-2 min-h-5 text-[14px] text-text">{errors.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`${uid}-car`} className="mb-2 block text-[14px] text-text-muted">Автомобиль</label>
                    <input id={`${uid}-car`} value={car} onChange={(e) => setCar(e.target.value)} placeholder="Модель и VIN" className={field} />
                  </div>
                </div>

                <div className="mt-8">
                  <LiquidMetalButton type="submit" variant="light" full disabled={state === "sending" || !when}>
                    {state === "sending" ? "Отправляем…" : when ? `Подтвердить · ${when}` : "Выберите день и время"}
                  </LiquidMetalButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
