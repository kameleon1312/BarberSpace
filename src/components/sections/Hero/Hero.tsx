import styles from "./hero.module.scss";
import heroBg from "../../../assets/images/hero.jpg?w=1600";
import heroBgSm from "../../../assets/images/hero.jpg?w=800";
import { useInView } from "../../../hooks/useInView";
import { useCounters } from "../../../hooks/useCounters";
import { useMagnetic } from "../../../hooks/useMagnetic";

type HeroProps = {
  onBook?: () => void;
};

const STAT_CONFIGS = [
  { target: 4.9, duration: 1400, decimals: 1 },
  { target: 30,  duration: 1000 },
  { target: 70,  duration: 1200 },
  { target: 20,  duration: 900  },
] as const;

export function Hero({ onBook }: HeroProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const magnetic = useMagnetic(0.28);

  const [rating, timeMin, timeMax, bookSec] = useCounters(STAT_CONFIGS, inView);

  return (
    <section
      className={styles.hero}
      id="top"
      aria-label="Sekcja główna"
    >
      <picture className={styles.bgPicture} aria-hidden="true">
        <source media="(max-width: 800px)" srcSet={heroBgSm} />
        <img
          src={heroBg}
          alt=""
          className={styles.bgImg}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.inner}>

          <span className={styles.eyebrow}>Twój wygląd — nasza pasja.</span>

          <h1 className={styles.title} aria-label="BarberSpace — Twój wygląd, nasza pasja">
            <span className={styles.titleLine1} aria-hidden="true">Barber</span>
            <span className={styles.titleLine2} aria-hidden="true">Space.</span>
          </h1>

          <div className={styles.ornament} aria-hidden="true" />

          <p className={styles.lead}>
            Precyzyjne strzyżenie, dopracowana broda — bez kompromisów.
            Rezerwacja w 20 sekund, efekt na tygodnie.
          </p>

          <div className={styles.actions}>
            {onBook ? (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onBook}
                onMouseEnter={magnetic.onMouseEnter}
                onMouseMove={magnetic.onMouseMove}
                onMouseLeave={magnetic.onMouseLeave}
              >
                Umów wizytę
              </button>
            ) : (
              <a className={styles.primary} href="#rezerwacja">
                Umów wizytę
              </a>
            )}
            <a className={styles.secondary} href="#cennik">
              Zobacz cennik
            </a>
          </div>

        </div>
      </div>

      <div className={styles.statsBar} ref={ref}>
        <div className={styles.statsInner}>
          <div
            className={styles.stats}
            aria-label="Dane salonu"
            data-reveal={inView ? "visible" : "hidden"}
          >
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>{rating}</span>
                <span className={styles.statUnit}>/5</span>
              </div>
              <span className={styles.statLabel}>Ocena klientów</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>{timeMin}–{timeMax}</span>
                <span className={styles.statUnit}>min</span>
              </div>
              <span className={styles.statLabel}>Czas usługi</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>~{bookSec}</span>
                <span className={styles.statUnit}>sek</span>
              </div>
              <span className={styles.statLabel}>Rezerwacja online</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>84+</span>
              </div>
              <span className={styles.statLabel}>Opinii Google</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
