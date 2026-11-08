/* Онлайн-запись: дни, слоты и отправка. */

export type Day = { iso: string; weekday: string; date: string; label: string; isToday: boolean };
export type BookingPayload = { day: string; time: string; pickup: boolean; name: string; phone: string; car: string };

/* 6 ближайших рабочих дней начиная с сегодня, воскресенье пропускаем */
export function nextWorkingDays(count = 6, from = new Date()): Day[] {
  const wd = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
  const dm = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
  const days: Day[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; days.length < count && i < 14; i++) {
    if (d.getDay() !== 0) {
      days.push({
        iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        weekday: i === 0 ? "сегодня" : wd.format(d).replace(".", ""),
        date: String(d.getDate()),
        label: dm.format(d),
        isToday: i === 0,
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/* «занятые» слоты — детерминированно по дате (одинаково при каждом открытии) */
export function isBusy(iso: string, hour: number) {
  let h = 2166136261;
  for (const c of iso + ":" + hour) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100 < 28;
}

/* TODO: подключить реальную отправку — Telegram-бот или API.
   Сейчас заявка никуда не уходит: имитируем ответ сервера. */
export async function submitBooking(payload: BookingPayload): Promise<{ ok: true }> {
  void payload;
  await new Promise((r) => setTimeout(r, 900));
  return { ok: true };
}
