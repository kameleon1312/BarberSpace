import styles from "./hero.module.scss";
import heroBg from "../../../assets/images/hero.jpg?w=1600";
import heroBgSm from "../../../assets/images/hero.jpg?w=800";
import { useMagnetic } from "../../../hooks/useMagnetic";
import { salon } from "../../../data/content";

type HeroProps = {
  onBook?: () => void;
};

export function Hero({ onBook }: HeroProps) {
  const magnetic = useMagnetic(0.28);

  return (
    <section className={styles.hero} id="top" aria-label="BarberSpace">
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
        <h1 className={styles.title} aria-label="BarberSpace">
          <span className={styles.line} aria-hidden="true"><span>Barber</span></span>
          <span className={`${styles.line} ${styles.lineRed}`} aria-hidden="true"><span>Space.</span></span>
        </h1>

        <p className={styles.lead}>
          Strzyżenie, broda, skin fade. Wizyta na konkretną godzinę, bez kolejki.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={onBook}
            onMouseEnter={magnetic.onMouseEnter}
            onMouseMove={magnetic.onMouseMove}
            onMouseLeave={magnetic.onMouseLeave}
          >
            Umów wizytę
          </button>
          <a className={styles.secondary} href="#cennik">Cennik</a>
        </div>

        <a className={styles.where} href={salon.mapsUrl} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
            <path d="M7 0C3.7 0 1 2.6 1 5.9 1 10 7 16 7 16s6-6 6-10.100C13 2.600 10.300 0 7 0Zm0 8.100a2.200 2.200 0 1 1 0-4.400 2.200 2.200 0 0 1 0 4.400Z" fill="currentColor" />
          </svg>
          {salon.address} · {salon.hoursLabel}
        </a>
      </div>

      <dl className={styles.facts}>
        <div><dt>Ocena Google</dt><dd>4,9<small>/5</small></dd></div>
        <div><dt>Opinie</dt><dd>84+</dd></div>
        <div><dt>Wizyta</dt><dd>30–70<small> min</small></dd></div>
      </dl>
    </section>
  );
}
