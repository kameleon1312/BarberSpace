import { useEffect, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { bookingServices } from "../data/content";
import type { BookingService, BookingServiceId } from "../data/content";

export type BarberId = "any" | "marek" | "kuba";

export type DayOption = { iso: string; weekday: string; day: number; month: string; isToday: boolean };

export const barbers: { id: BarberId; name: string; role: string }[] = [
  { id: "any", name: "Dowolny", role: "Najbliższy termin" },
  { id: "marek", name: "Marek", role: "Senior Barber" },
  { id: "kuba", name: "Kuba", role: "Barber" },
];

const WEEKDAYS = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];
const MONTHS = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

function toIso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Next N open days (salon works Mon–Sat)
function buildDays(count = 14): DayOption[] {
  const out: DayOption[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const todayIso = toIso(d);
  while (out.length < count) {
    if (d.getDay() !== 0) {
      out.push({ iso: toIso(d), weekday: WEEKDAYS[d.getDay()], day: d.getDate(), month: MONTHS[d.getMonth()], isToday: toIso(d) === todayIso });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function isPast(dateIso: string, time: string) {
  const [h, m] = time.split(":").map(Number);
  const [y, mo, da] = dateIso.split("-").map(Number);
  return new Date(y, mo - 1, da, h, m).getTime() <= Date.now() + 30 * 60 * 1000;
}

export type FormState = {
  serviceId: BookingServiceId;
  date: string;
  time: string;
  barber: BarberId;
  name: string;
  phone: string;
  note: string;
  website: string; // honeypot — must stay empty
};

export type SendStatus = "idle" | "sending" | "success" | "error";

export type UseBookingFormReturn = {
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  status: SendStatus;
  phoneError: boolean;
  setPhoneError: React.Dispatch<React.SetStateAction<boolean>>;
  isPhoneValid: boolean;
  reset: () => void;
  service: BookingService;
  priceLabel: string;
  canSubmit: boolean;
  today: string;
  days: DayOption[];
  slots: string[];
  isSlotDisabled: (time: string) => boolean;
  serviceSelectRef: React.MutableRefObject<HTMLDivElement | null>;
  submit: (e: React.FormEvent) => Promise<void>;
};

const PHONE_RE = /^(\+?48)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
const MIN_INTERACTION_MS = 3000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function buildTimeSlots(startHour = 10, endHour = 20, stepMin = 30) {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

const CONTACT_KEY = "bs-contact";

function loadContact(): { name: string; phone: string } {
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { name?: string; phone?: string };
      return { name: String(v.name ?? "").slice(0, 80), phone: String(v.phone ?? "").slice(0, 20) };
    }
  } catch { /* storage unavailable */ }
  return { name: "", phone: "" };
}

function saveContact(name: string, phone: string) {
  try { localStorage.setItem(CONTACT_KEY, JSON.stringify({ name, phone })); } catch { /* ignore */ }
}

export function useBookingForm(open: boolean, preselectServiceId?: BookingServiceId): UseBookingFormReturn {
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const slots = useMemo(() => buildTimeSlots(10, 20, 30), []);
  const days = useMemo(() => buildDays(14), []);

  const [form, setForm] = useState<FormState>(() => ({
    serviceId: bookingServices[0].id,
    date: days[0].iso,
    time: "",
    barber: "any",
    ...loadContact(),
    note: "",
    website: "",
  }));

  const [status, setStatus] = useState<SendStatus>("idle");
  const [phoneError, setPhoneError] = useState(false);

  const serviceSelectRef = useRef<HTMLDivElement | null>(null);
  const openedAtRef = useRef<number>(0);

  useEffect(() => {
    if (!open) return;
    openedAtRef.current = Date.now();
    if (!preselectServiceId) return;

    requestAnimationFrame(() => {
      setForm((p) =>
        p.serviceId === preselectServiceId ? p : { ...p, serviceId: preselectServiceId }
      );
      serviceSelectRef.current?.focus();
      serviceSelectRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, [open, preselectServiceId]);

  const reset = () => {
    setStatus("idle");
    setPhoneError(false);
  };

  const service = useMemo(
    () => bookingServices.find((s) => s.id === form.serviceId) ?? bookingServices[0],
    [form.serviceId]
  );

  const priceLabel =
    service.priceFrom === service.priceTo
      ? `${service.priceFrom} zł`
      : `${service.priceFrom}–${service.priceTo} zł`;

  const isSlotDisabled = (time: string) => isPast(form.date, time);

  const isPhoneValid = PHONE_RE.test(form.phone.trim());

  const canSubmit =
    status !== "sending" &&
    form.name.trim().length >= 2 &&
    isPhoneValid &&
    !!form.date &&
    !!form.time;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.website.length > 0) return; // honeypot triggered — silent drop

    if (Date.now() - openedAtRef.current < MIN_INTERACTION_MS) return; // time-gate

    if (!isPhoneValid) {
      setPhoneError(true);
      return;
    }

    if (!canSubmit) return;

    setStatus("sending");

    const templateParams = {
      service_name: service.name,
      booking_date: form.date,
      booking_time: form.time,
      duration: `${service.durationMin} min`,
      price: priceLabel,
      barber: barbers.find((b) => b.id === form.barber)?.name ?? "Dowolny",
      client_name: form.name,
      client_phone: form.phone,
      client_note: form.note || "—",
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      saveContact(form.name.trim(), form.phone.trim());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => {
      const next = { ...p, [key]: value };
      // Drop a chosen time that is already in the past on the newly picked day
      if (key === "date" && next.time && isPast(next.date, next.time)) next.time = "";
      return next;
    });

  return {
    form,
    setField,
    status,
    phoneError,
    setPhoneError,
    isPhoneValid,
    reset,
    service,
    priceLabel,
    canSubmit,
    today,
    days,
    slots,
    isSlotDisabled,
    serviceSelectRef,
    submit,
  };
}
