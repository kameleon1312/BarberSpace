import { useEffect, useRef, useState } from "react";
import { useTween } from "../../../hooks/useTween";
import { salon } from "../../../data/content";
import styles from "./quick-booking-drawer.module.scss";
import { bookingServices } from "../../../data/content";
import type { BookingServiceId } from "../../../data/content";
import { barbers, useBookingForm } from "../../../hooks/useBookingForm";
import type { BarberId } from "../../../hooks/useBookingForm";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

type Props = {
  open: boolean;
  onClose: () => void;
  preselectServiceId?: BookingServiceId;
};

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function calendarUrl(dateIso: string, time: string, durationMin: number, title: string) {
  const [y, mo, d] = dateIso.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}T${String(dt.getHours()).padStart(2, "0")}${String(dt.getMinutes()).padStart(2, "0")}00`;
  const start = new Date(y, mo - 1, d, h, mi);
  const end = new Date(start.getTime() + durationMin * 60000);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `BarberSpace — ${title}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    ctz: "Europe/Warsaw",
    location: salon.address,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

export function QuickBookingDrawer({ open, onClose, preselectServiceId }: Props) {
  useLockBodyScroll(open);

  const panelRef = useRef<HTMLElement>(null);

  // 3 short steps. A service picked from the price list skips straight to the date.
  const [pickedStep, setPickedStep] = useState<number | null>(null);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const step = pickedStep ?? (preselectServiceId ? 2 : 1);
  const go = (n: number) => {
    setDir(n > step ? "fwd" : "back");
    setPickedStep(n);
  };

  const {
    form,
    setField,
    status,
    phoneError,
    setPhoneError,
    isPhoneValid,
    reset,
    service,
    priceLabel,
    days,
    slots,
    isSlotDisabled,
    serviceSelectRef,
    submit,
  } = useBookingForm(open, preselectServiceId);

  const handleClose = () => {
    setPickedStep(null);
    setDir("fwd");
    reset();
    onClose();
  };

  useFocusTrap(open, panelRef, handleClose);

  const successCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (status === "success") successCloseRef.current?.focus();
  }, [status]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Swipe the header down to dismiss (phones, bottom-sheet layout)
  const drag = useRef({ id: -1, startY: 0, dy: 0 });
  const isSheet = () => window.matchMedia("(max-width: 639px)").matches;
  const onDragStart = (e: React.PointerEvent<HTMLElement>) => {
    if (!isSheet() || (e.target as HTMLElement).closest("button")) return;
    drag.current = { id: e.pointerId, startY: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    panelRef.current?.setAttribute("data-dragging", "true");
  };
  const onDragMove = (e: React.PointerEvent<HTMLElement>) => {
    if (drag.current.id !== e.pointerId) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.startY);
    panelRef.current?.style.setProperty("--drag", `${drag.current.dy}px`);
  };
  const onDragEnd = (e: React.PointerEvent<HTMLElement>) => {
    if (drag.current.id !== e.pointerId) return;
    const dy = drag.current.dy;
    drag.current.id = -1;
    panelRef.current?.removeAttribute("data-dragging");
    panelRef.current?.style.removeProperty("--drag");
    if (dy > 90) handleClose();
  };

  const priceFromAnim = useTween(service.priceFrom);
  const priceToAnim = useTween(service.priceTo);
  const animatedPrice = priceFromAnim === priceToAnim ? `${priceFromAnim} zł` : `${priceFromAnim}–${priceToAnim} zł`;

  const STEP_TITLES = ["Usługa i barber", "Termin", "Twoje dane"];
  const stepValid = step === 1 ? true : step === 2 ? !!form.time : form.name.trim().length >= 2 && isPhoneValid;

  const selectedDay = days.find((d) => d.iso === form.date);
  const barberName = barbers.find((b) => b.id === form.barber)?.name;
  const sending = status === "sending";

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onMouseDown={onBackdropClick}
      />

      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Rezerwacja wizyty"
        ref={panelRef}
      >
        <header
          className={styles.top}
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <span className={styles.grab} aria-hidden="true" />
          <div>
            <div className={styles.title}>Rezerwacja wizyty</div>
            <div className={styles.sub}>
              {status === "success" ? "Gotowe" : `Krok ${step} z 3 · ${STEP_TITLES[step - 1]}`}
            </div>
          </div>
          <button type="button" className={styles.close} onClick={handleClose} aria-label="Zamknij">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className={styles.progress} role="progressbar" aria-label="Postęp rezerwacji" aria-valuemin={1} aria-valuemax={3} aria-valuenow={status === "success" ? 3 : step}>
          <span style={{ width: `${((status === "success" ? 3 : step) / 3) * 100}%` }} />
        </div>

        {status === "success" ? (
          <div className={styles.successState}>
            <div className={styles.successIcon} aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>Rezerwacja wysłana</h3>
            <p className={styles.successDesc}>
              Potwierdzimy termin telefonicznie. Do zobaczenia w salonie.
            </p>
            <dl className={styles.ticket}>
              <div><dt>Usługa</dt><dd>{service.name}</dd></div>
              <div><dt>Termin</dt><dd>{selectedDay?.weekday} {selectedDay?.day} {selectedDay?.month} · {form.time}</dd></div>
              <div><dt>Barber</dt><dd>{barberName}</dd></div>
              <div><dt>Cena</dt><dd>{priceLabel}</dd></div>
            </dl>
            <div className={styles.successActions}>
              <a
                className={styles.primary}
                href={calendarUrl(form.date, form.time, service.durationMin, service.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Dodaj do kalendarza
              </a>
              <a className={styles.ghost} href={salon.mapsUrl} target="_blank" rel="noopener noreferrer">
                Wyznacz trasę
              </a>
              <button type="button" className={styles.textBtn} onClick={handleClose} ref={successCloseRef}>
                Zamknij
              </button>
            </div>
          </div>
        ) : (
          <form
            className={styles.form}
            onSubmit={(e) => {
              if (step < 3) {
                e.preventDefault();
                if (stepValid) go(step + 1);
                return;
              }
              void submit(e);
            }}
            noValidate
          >
            <div className={styles.body} key={step} data-dir={dir}>
              {/* honeypot — hidden from real users, bots fill it */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                className={styles.honeypot}
              />

              {step === 1 && (
                <>
                  <fieldset className={styles.group}>
                    <legend className={styles.legend}>Usługa</legend>
                    <div className={styles.services} ref={serviceSelectRef} role="radiogroup" aria-label="Usługa">
                      {bookingServices.map((s) => {
                        const active = s.id === form.serviceId;
                        return (
                          <label key={s.id} className={`${styles.serviceCard} ${active ? styles.active : ""}`}>
                            <input
                              type="radio"
                              name="service"
                              className={styles.srOnly}
                              checked={active}
                              onChange={() => setField("serviceId", s.id)}
                            />
                            <span className={styles.serviceName}>{s.name}</span>
                            <span className={styles.serviceMeta}>{s.durationMin} min</span>
                            <span className={styles.servicePrice}>od {s.priceFrom} zł</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className={styles.group}>
                    <legend className={styles.legend}>Barber</legend>
                    <div className={styles.barbers} role="radiogroup" aria-label="Barber">
                      {barbers.map((b) => {
                        const active = b.id === form.barber;
                        return (
                          <label key={b.id} className={`${styles.chip} ${active ? styles.active : ""}`}>
                            <input
                              type="radio"
                              name="barber"
                              className={styles.srOnly}
                              checked={active}
                              onChange={() => setField("barber", b.id as BarberId)}
                            />
                            {b.name}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 2 && (
                <>
                  <fieldset className={styles.group}>
                    <legend className={styles.legend}>Dzień</legend>
                    <div className={styles.days} role="radiogroup" aria-label="Dzień">
                      {days.map((d) => {
                        const active = d.iso === form.date;
                        return (
                          <label key={d.iso} className={`${styles.day} ${active ? styles.active : ""}`}>
                            <input
                              type="radio"
                              name="day"
                              className={styles.srOnly}
                              checked={active}
                              onChange={() => setField("date", d.iso)}
                            />
                            <span className={styles.dayWd}>{d.isToday ? "Dziś" : d.weekday}</span>
                            <span className={styles.dayNum}>{d.day}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className={styles.group}>
                    <legend className={styles.legend}>Godzina</legend>
                    <div className={styles.slots} role="radiogroup" aria-label="Godzina">
                      {slots.map((t) => {
                        const disabled = isSlotDisabled(t);
                        const active = t === form.time;
                        return (
                          <label
                            key={t}
                            className={`${styles.slot} ${active ? styles.active : ""} ${disabled ? styles.slotOff : ""}`}
                          >
                            <input
                              type="radio"
                              name="time"
                              className={styles.srOnly}
                              checked={active}
                              disabled={disabled}
                              onChange={() => setField("time", t)}
                            />
                            {t}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 3 && (
                <>
                  <div className={styles.recapCard}>
                    <div className={styles.recapMain}>
                      <span className={styles.recapName}>{service.name} · {barberName}</span>
                      <span className={styles.recapWhen}>
                        {selectedDay?.weekday} {selectedDay?.day} {selectedDay?.month} · {form.time} · {service.durationMin} min
                      </span>
                    </div>
                    <span className={styles.recapPriceVal}>{animatedPrice}</span>
                  </div>

                  <div className={styles.fields}>
                    <label className={styles.field}>
                      <span className={styles.label}>Imię</span>
                      <input
                        className={styles.control}
                        type="text"
                        placeholder="Np. Szymon"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        autoComplete="name"
                        maxLength={80}
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.label}>Telefon</span>
                      <input
                        className={`${styles.control} ${phoneError ? styles.controlError : ""}`}
                        type="tel"
                        inputMode="tel"
                        placeholder="600 000 000"
                        value={form.phone}
                        onChange={(e) => {
                          setPhoneError(false);
                          setField("phone", e.target.value);
                        }}
                        onBlur={() => {
                          if (form.phone.trim().length > 0) setPhoneError(!isPhoneValid);
                        }}
                        autoComplete="tel"
                        maxLength={20}
                        aria-describedby={phoneError ? "phone-error" : undefined}
                        aria-invalid={phoneError}
                      />
                      {phoneError && (
                        <span id="phone-error" className={styles.fieldError} role="alert">
                          Podaj numer w formacie 600 000 000
                        </span>
                      )}
                    </label>

                    <label className={styles.field}>
                      <span className={styles.label}>Uwagi <em>(opcjonalnie)</em></span>
                      <input
                        className={styles.control}
                        type="text"
                        placeholder="Np. broda 2 cm"
                        value={form.note}
                        onChange={(e) => setField("note", e.target.value)}
                        maxLength={300}
                      />
                    </label>
                  </div>

                  {status === "error" && (
                    <p className={styles.errorMsg} role="alert">
                      Nie udało się wysłać. Spróbuj ponownie lub zadzwoń: <a href={salon.phoneHref}>{salon.phone}</a>
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Sticky nav: one clear action per step */}
            <footer className={styles.footer}>
              {step === 1 && (
                <div className={styles.priceLine}>
                  <span>{service.name} · {service.durationMin} min</span>
                  <strong>{animatedPrice}</strong>
                </div>
              )}
              {step === 2 && (
                <div className={styles.priceLine}>
                  <span>{selectedDay?.weekday} {selectedDay?.day} {selectedDay?.month}{form.time ? ` · ${form.time}` : ""}</span>
                  <strong>{animatedPrice}</strong>
                </div>
              )}
              <div className={styles.navRow}>
                {step > 1 && (
                  <button type="button" className={styles.back} onClick={() => go(step - 1)} aria-label="Wstecz">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                <button type="submit" className={styles.primary} disabled={!stepValid || sending} aria-busy={sending}>
                  {sending ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      Wysyłanie…
                    </>
                  ) : step === 3 ? (
                    "Potwierdź rezerwację"
                  ) : step === 2 && !form.time ? (
                    "Wybierz godzinę"
                  ) : (
                    <>
                      Dalej
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
              {step === 3 && <div className={styles.hint}>Płatność na miejscu · <a href={salon.phoneHref}>{salon.phone}</a></div>}
            </footer>
          </form>
        )}
      </aside>
    </>
  );
}

