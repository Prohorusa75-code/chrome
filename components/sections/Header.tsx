"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { BRAND, CONTACTS, NAV_LEFT, NAV_RIGHT } from "@/lib/data";
import { cn } from "@/lib/utils";
import { WRAP } from "./wrap";

const link = "rounded-full px-3 py-2.5 text-[14px] text-text-muted transition-colors hover:text-text";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
          scrolled ? "border-line bg-[rgba(8,8,10,.8)] backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <div className={cn(WRAP, "grid h-[76px] grid-cols-[1fr_auto_1fr] items-center")}>
          <nav aria-label="Разделы" className="hidden items-center gap-1 lg:flex">
            {NAV_LEFT.map((l) => (
              <a key={l.href} href={l.href} className={link}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#top" className="chrome-text col-start-1 justify-self-start text-[22px] font-medium tracking-[0.32em] lg:col-start-2 lg:justify-self-center">
            {BRAND}
          </a>
          <div className="col-start-3 flex items-center justify-end gap-1">
            <nav aria-label="Разделы" className="hidden items-center gap-1 lg:flex">
              {NAV_RIGHT.map((l) => (
                <a key={l.href} href={l.href} className={link}>
                  {l.label}
                </a>
              ))}
            </nav>
            <LiquidMetalButton href="#booking" variant="outline" size="md" className="ml-3 hidden lg:inline-flex">
              Записаться
            </LiquidMetalButton>
            <button
              type="button"
              aria-label="Открыть меню"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-line-strong text-text lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-[rgba(8,8,10,.96)] backdrop-blur-xl"
          >
            <div className={cn(WRAP, "flex h-[76px] items-center justify-between")}>
              <span className="chrome-text text-[22px] font-medium tracking-[0.32em]">{BRAND}</span>
              <button type="button" aria-label="Закрыть меню" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-line-strong">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Меню" className={cn(WRAP, "my-auto flex flex-col gap-1")}>
              {[...NAV_LEFT, ...NAV_RIGHT, { href: "#booking", label: "Запись" }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
                  className="py-2 text-[clamp(34px,9vw,48px)] font-light tracking-[-0.04em] text-text"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className={cn(WRAP, "pb-10")}>
              <LiquidMetalButton href="#booking" variant="light" full onClick={() => setOpen(false)}>
                Записаться на сервис
              </LiquidMetalButton>
              <a href={CONTACTS.phoneHref} className="mt-4 block text-center text-text-muted">
                {CONTACTS.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
