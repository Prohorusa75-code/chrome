/* Весь контент сайта CHROME — в одном месте. Меняйте тексты и цены здесь, вёрстку трогать не нужно.
   Сервис вымышленный (концепт для портфолио). Цены в белорусских рублях. */

export const BRAND = "CHROME";
export const CURRENCY = "BYN";

export const CONTACTS = {
  phone: "+375 29 123-45-67",
  phoneHref: "tel:+375291234567",
  address: "Минск, ул. Моторная, 12",
  hours: "Пн–Сб 9:00–21:00 · Вс 10:00–18:00",
  perks: "Закрытая парковка и лаунж-зона",
  routeHref: `https://yandex.by/maps/?text=${encodeURIComponent("Минск, ул. Моторная, 12")}`,
};

export const NAV_LEFT = [
  { href: "#services", label: "Услуги" },
  { href: "#calc", label: "Калькулятор" },
  { href: "#prices", label: "Цены" },
  { href: "#brands", label: "Марки" },
];
export const NAV_RIGHT = [
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export const HERO = {
  eyebrow: "BMW · Mercedes-Benz · Audi · Porsche",
  titleTop: "Сервис уровня",
  titleBottom: "вашего автомобиля",
  text: "Дилерское оборудование, оригинальные запчасти и персональный мастер. Без очередей и без сюрпризов в смете.",
  primary: "Записаться на сервис",
  secondary: "Рассчитать стоимость",
};

/* value — число для анимированного счётчика, from — с чего начинается отсчёт */
export const STATS = [
  { value: 12, from: 0, suffix: " мес", label: "гарантия на работы" },
  { value: 1, from: 0, suffix: " мастер", label: "закреплён за вашей машиной" },
  { value: 0, from: 90, suffix: " BYN", label: "доплат вне сметы" },
  { value: 24, from: 0, suffix: "/7", label: "эвакуатор и забор авто" },
];

export const SERVICES = [
  { n: "01", title: "Техническое обслуживание", text: "Оригинальные масла и фильтры, сброс сервисного интервала", price: 180 },
  { n: "02", title: "Дилерская диагностика", text: "ISTA+, Xentry, ODIS — полный отчёт о состоянии", price: 80 },
  { n: "03", title: "Пневмоподвеска", text: "Airmatic, Adaptive Air Suspension, компрессоры", price: 130 },
  { n: "04", title: "Кодирование и ПО", text: "Активация функций, обновление блоков управления", price: 100 },
  { n: "05", title: "Двигатель и трансмиссия", text: "Цепи ГРМ, течи, ZF 8HP, 9G-Tronic, S tronic", price: 290 },
  { n: "06", title: "Шины и геометрия", text: "Монтаж RunFlat до R22, 3D-развал, хранение", price: 120 },
];

/* Калькулятор: цена = round(базовая × коэффициент / 10) × 10 BYN */
export const CALC_BRANDS = [
  { id: "bmw", label: "BMW", k: 1.0 },
  { id: "mb", label: "Mercedes-Benz", k: 1.08 },
  { id: "audi", label: "Audi", k: 0.96 },
  { id: "porsche", label: "Porsche", k: 1.4 },
] as const;
export type CalcBrandId = (typeof CALC_BRANDS)[number]["id"];

export const CALC_WORKS = [
  { id: "to", label: "ТО: масло, фильтры, сброс интервала", base: 180, hours: 1.5 },
  { id: "diag", label: "Дилерская диагностика", base: 80, hours: 1 },
  { id: "brake", label: "Колодки и диски, ось", base: 160, hours: 1.5 },
  { id: "air", label: "Пневмоподвеска: диагностика", base: 130, hours: 1 },
  { id: "code", label: "Кодирование функций", base: 100, hours: 1 },
  { id: "atf", label: "Обслуживание АКПП", base: 290, hours: 2 },
  { id: "tires", label: "Шиномонтаж RunFlat", base: 120, hours: 1 },
];
export const CALC_DEFAULT = { brand: "bmw" as CalcBrandId, works: ["to", "diag"] };

export const PRICES = {
  columns: ["BMW", "Mercedes-Benz", "Audi"],
  rows: [
    { work: "Замена масла и фильтра", values: ["80 BYN", "85 BYN", "75 BYN"] },
    { work: "Дилерская диагностика", values: ["80 BYN", "80 BYN", "80 BYN"] },
    { work: "Колодки и диски, ось", values: ["160 BYN", "170 BYN", "155 BYN"] },
    { work: "Обслуживание АКПП", values: ["от 290 BYN", "от 310 BYN", "от 320 BYN"] },
    { work: "Пневмобаллон, 1 шт.", values: ["130 BYN", "145 BYN", "135 BYN"] },
    { work: "Кодирование, функция", values: ["от 100 BYN", "от 115 BYN", "от 100 BYN"] },
  ],
};

/* Только текстовые названия марок — без логотипов (это товарные знаки) */
export const ORBIT_BRANDS = [
  { name: "BMW", tools: "ISTA+, ICOM Next", work: "кодирование, xDrive, ZF 8HP, течи N47/B47" },
  { name: "Mercedes-Benz", tools: "Xentry, Star Diagnosis C6", work: "Airmatic, 7G/9G-Tronic, SBC" },
  { name: "Audi", tools: "ODIS Service", work: "quattro, S tronic, цепи TFSI" },
  { name: "Porsche", tools: "PIWIS", work: "PDK, PASM, обслуживание Cayenne и Macan" },
  { name: "Volkswagen", tools: "ODIS, VCDS", work: "DSG, мехатроники, EA888" },
  { name: "MINI", tools: "ISTA+", work: "двигатели Prince, кодирование" },
  { name: "Land Rover", tools: "Pathfinder", work: "пневмоподвеска, Terrain Response" },
  { name: "Volvo", tools: "VIDA", work: "обслуживание Geartronic, системы безопасности" },
];

export const BOOKING = {
  firstHour: 9,
  lastHour: 20,
  pickupTitle: "Заберём автомобиль",
  pickupText: "Водитель приедет по адресу и вернёт машину после сервиса",
  success: "Персональный мастер свяжется с вами в течение 10 минут.",
};

export const REVIEWS = [
  { quote: "Сделали адаптацию ZF 8HP — коробка переключается как новая. Машину забрали из дома и вернули вымытой.", name: "Алексей М.", car: "BMW X5 G05" },
  { quote: "Пневмоподвеску на GLE у дилера оценили вдвое дороже. Здесь сделали за день и дали гарантию на год.", name: "Ирина Т.", car: "Mercedes-Benz GLE" },
  { quote: "Персональный мастер на связи в мессенджере, фото каждой детали. Наконец-то сервис, которому доверяю.", name: "Павел Р.", car: "Audi Q7" },
];

export const GUARANTEE = [
  { title: "Гарантия на работы", text: "12 месяцев или 20 000 км — что наступит раньше" },
  { title: "Оригинальные запчасти", text: "С гарантией производителя и чеком поставщика" },
  { title: "Сохранение гарантии дилера", text: "Работы по регламенту с отметкой в сервисной книжке" },
];

export const FOOTER = "© 2026 Премиальный автосервис";
