import { salon } from "../data/content";

export type OpenStatus = { open: boolean; label: string };

const DAYS = ["niedz.", "pn", "wt", "śr", "czw", "pt", "sb"];

// Salon works Mon–Sat. All calculations use Warsaw time, whatever the visitor's timezone.
function warsawParts(now: Date) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const p = Object.fromEntries(f.formatToParts(now).map((x) => [x.type, x.value]));
  const dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return { day: dayIdx, minutes: (Number(p.hour) % 24) * 60 + Number(p.minute) };
}

export function getOpenStatus(now = new Date()): OpenStatus {
  const { day, minutes } = warsawParts(now);
  const open = salon.openHour * 60;
  const close = salon.closeHour * 60;
  const worksToday = day !== 0;

  if (worksToday && minutes >= open && minutes < close) {
    const left = close - minutes;
    return { open: true, label: left <= 60 ? `Otwarte jeszcze ${left} min` : `Otwarte do ${salon.closeHour}:00` };
  }
  if (worksToday && minutes < open) {
    return { open: false, label: `Zamknięte · otwieramy dziś o ${salon.openHour}:00` };
  }
  const next = (day + 1) % 7 === 0 ? 1 : (day + 1) % 7;
  const when = next === (day + 1) % 7 ? "jutro" : DAYS[next];
  return { open: false, label: `Zamknięte · otwieramy ${when} o ${salon.openHour}:00` };
}
