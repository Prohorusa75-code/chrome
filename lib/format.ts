import { CURRENCY } from "./data";

/* 1 280 BYN — разделители по-русски, неразрывный пробел перед валютой */
export const money = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ${CURRENCY}`;

/* часы: 2,5 */
export const hours = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

/* склонение: plural(5, ["работа", "работы", "работ"]) → «работ» */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/* Белорусский номер: +375 (XX) XXX-XX-XX. Принимаем и «80 29 …», и просто «29 …». */
export function belarusDigits(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("80")) d = "375" + d.slice(2);
  else if (!d.startsWith("375") && d.length > 0 && !"375".startsWith(d)) d = "375" + d;
  return d.slice(0, 12);
}
export function formatBelarusPhone(raw: string) {
  const d = belarusDigits(raw);
  if (!d) return "";
  const r = d.slice(3);
  let out = "+" + d.slice(0, 3);
  if (r.length) out += " (" + r.slice(0, 2);
  if (r.length >= 2) out += ")";
  if (r.length > 2) out += " " + r.slice(2, 5);
  if (r.length > 5) out += "-" + r.slice(5, 7);
  if (r.length > 7) out += "-" + r.slice(7, 9);
  return out;
}
