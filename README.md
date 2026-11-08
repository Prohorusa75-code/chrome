# CHROME — премиальный автосервис (концепт для портфолио)

Одностраничный сайт сервиса немецких автомобилей. Монохром: графит и хром, Inter Tight, вращающийся диск.
Цены в BYN, телефон +375, Минск. Бэкенда нет: формы работают в браузере.

**Стек:** Next.js 16 (App Router, статический экспорт) · TypeScript · Tailwind 4 · shadcn/ui · motion · lucide-react · @paper-design/shaders-react.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # статическая сборка в out/
npm run lint
```

Публикация — GitHub Actions (`.github/workflows/pages.yml`) → GitHub Pages, подпапка `/chrome`.

## Где что

- `lib/data.ts` — **все** тексты, цены, услуги, марки, отзывы, контакты.
- `lib/format.ts` — цены (`toLocaleString('ru-RU')`), склонения, маска телефона +375.
- `lib/booking.ts` — дни и слоты записи; `submitBooking()` с TODO для Telegram-бота или API.
- `components/sections/` — 12 секций по порядку.
- `components/ui/` — жидкий металл, металлическая кнопка, орбита марок, отзывы, счётчик цифр, появление при скролле.

## Компоненты

Компоненты 21st.dev не скачались: у аккаунта исчерпан бесплатный лимит (`retrieval_limit_reached`).
Использованы первоисточники и запасной вариант из задания:

| По заданию (21st.dev) | Что стоит |
|---|---|
| Liquid Metal Hero | заменён по просьбе владельца: вращающийся кованый диск на canvas (`components/ui/spinning-wheel.tsx`) |
| Liquid Metal Button | своя кнопка на том же шейдере `LiquidMetal` + CSS-хром обводки |
| Radial Orbital Timeline | заменён по просьбе владельца: тахометр со стрелкой (идея — gauge/dial с 21st.dev) и линия телеметрии |
| Animated Testimonials | оригинал из Aceternity UI, адаптирован (без фото) |
| Number Ticker | оригинал из Magic UI, адаптирован (ru-RU) |

Шейдер кнопок подключается через `next/dynamic` (`ssr: false`) после первой отрисовки. При `prefers-reduced-motion` анимации остаются, но спокойнее и без размытия.
