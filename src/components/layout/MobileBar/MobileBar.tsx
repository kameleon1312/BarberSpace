import { useEffect, useState } from "react";
import styles from "./mobile-bar.module.scss";
import { salon } from "../../../data/content";
import { useOpenStatus } from "../../../hooks/useOpenStatus";

type Props = {
  onBook: () => void;
  hidden?: boolean;
};

// Thumb-zone action bar, phones only. Appears once the hero's own button has scrolled away.
export function MobileBar({ onBook, hidden = false }: Props) {
  const [past, setPast] = useState(false);
  const status = useOpenStatus();

  useEffect(() => {
    const onScroll = () => {
      const cta = document.getElementById("rezerwacja");
      const ctaVisible = !!cta && cta.getBoundingClientRect().top < window.innerHeight * 0.85;
      setPast(window.scrollY > window.innerHeight * 0.55 && !ctaVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = past && !hidden;

  return (
    <div className={styles.bar} data-show={show} aria-hidden={!show}>
      <a className={styles.call} href={salon.phoneHref} aria-label={`Zadzwoń: ${salon.phone}`} tabIndex={show ? 0 : -1}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </a>
      <button type="button" className={styles.book} onClick={onBook} tabIndex={show ? 0 : -1}>
        <span className={styles.bookLabel}>Umów wizytę</span>
        <span className={styles.bookStatus} data-open={status.open}>{status.label}</span>
      </button>
    </div>
  );
}
