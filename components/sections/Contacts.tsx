import { Reveal } from "@/components/ui/reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { CONTACTS } from "@/lib/data";
import { SECTION, WRAP } from "./wrap";

/* тёмная стилизованная карта — SVG, без внешних iframe */
function DarkMap() {
  return (
    <svg viewBox="0 0 1320 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" role="img" aria-label={`Схема расположения: ${CONTACTS.address}`}>
      <rect width="1320" height="480" fill="#0b0b0e" />
      <g fill="#131316">
        {[60, 170, 300, 410].map((y) => (
          <rect key={`h${y}`} x="0" y={y} width="1320" height="10" />
        ))}
        {[120, 260, 420, 560, 980, 1120, 1240].map((x) => (
          <rect key={`v${x}`} x={x} y="0" width="10" height="480" />
        ))}
      </g>
      <g fill="#17171b">
        <rect x="0" y="228" width="1320" height="26" />
        <rect x="760" y="0" width="26" height="480" />
        <path d="M-40 520 L1360 -40 L1380 -12 L-20 548 Z" />
      </g>
      <g fill="#0f0f12">
        <rect x="880" y="280" width="70" height="110" rx="6" />
        <rect x="610" y="90" width="120" height="70" rx="6" />
        <rect x="1000" y="80" width="90" height="120" rx="6" />
      </g>
      <text x="800" y="220" fill="#3a3a40" fontSize="13" fontFamily="var(--font-inter-tight)" letterSpacing="2">УЛ. МОТОРНАЯ</text>
    </svg>
  );
}

export function Contacts() {
  return (
    <section id="contacts" aria-labelledby="contacts-title" className={`${WRAP} ${SECTION}`}>
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-line">
          <div className="relative h-[320px] md:h-[480px]">
            <DarkMap />
            {/* пин справа от центра */}
            <div className="absolute top-[48%] left-[60%]" aria-hidden="true">
              <span className="pin-pulse absolute -inset-2 rounded-full border border-white/50" />
              <span className="relative block size-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#9a9aa1_55%,#3a3a40)] shadow-[0_0_24px_rgba(255,255,255,.55)]" />
            </div>
          </div>
          {/* стеклянная плашка: на широких экранах поверх карты, на телефоне — под ней */}
          <div className="border-t border-line p-4 md:absolute md:top-1/2 md:left-8 md:w-[400px] md:-translate-y-1/2 md:border-0 md:p-0">
            <ContactCard />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactCard() {
  return (
    <div className="rounded-[24px] border border-line-strong bg-[rgba(8,8,10,.86)] p-7 backdrop-blur-[16px]">
      <p className="text-[13px] tracking-[0.3em] text-text-muted uppercase">Контакты</p>
      <h2 id="contacts-title" className="chrome-text mt-4 text-[28px] leading-[1.15] font-light tracking-[-0.03em]">
        {CONTACTS.address}
      </h2>
      <p className="mt-4 text-[15px] text-text-muted">{CONTACTS.hours}</p>
      <p className="mt-1 text-[15px] text-text-muted">{CONTACTS.perks}</p>
      <a href={CONTACTS.phoneHref} className="mt-5 inline-block text-[20px] font-light tracking-[-0.02em] text-text hover:text-white">
        {CONTACTS.phone}
      </a>
      <div className="mt-6">
        <LiquidMetalButton href={CONTACTS.routeHref} external variant="outline" size="md">
          Построить маршрут
        </LiquidMetalButton>
      </div>
    </div>
  );
}
