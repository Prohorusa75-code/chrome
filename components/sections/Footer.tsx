import { BRAND, CONTACTS, FOOTER } from "@/lib/data";
import { WRAP } from "./wrap";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className={`${WRAP} flex flex-col items-center gap-3 py-9 text-[13px] text-text-dim sm:flex-row sm:justify-between`}>
        <a href="#top" className="chrome-text text-[15px] font-medium tracking-[0.3em]">
          {BRAND}
        </a>
        <p>{FOOTER} · концепт для портфолио</p>
        <a href={CONTACTS.phoneHref} className="hover:text-text">
          {CONTACTS.phone}
        </a>
      </div>
    </footer>
  );
}
