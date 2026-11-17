import styles from "./cta.module.scss";
import { useInView } from "../../../hooks/useInView";
import { useMagnetic } from "../../../hooks/useMagnetic";
import { SalonMap } from "./SalonMap";
import { useOpenStatus } from "../../../hooks/useOpenStatus";
import { salon } from "../../../data/content";

type Props = {
  onBook?: () => void;
};

export function CTA({ onBook }: Props) {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";
  const magnetic = useMagnetic(0.25);
  const status = useOpenStatus();

  return (
    <section className={styles.section} id="kontakt" aria-label="Kontakt i rezerwacja" ref={ref}>
      <div className={styles.inner}>
        <div className={styles.card} data-reveal={rv}>
          <div className={styles.left}>
            <h2 className={styles.title}>Umów się na wizytę</h2>
            <p className={styles.status} data-open={status.open}>
              <span className={styles.dot} aria-hidden="true" />
              {status.label}
            </p>

            <div className={styles.actions} id="rezerwacja">
              <button
                type="button"
                className={styles.primary}
                onClick={onBook}
                onMouseEnter={magnetic.onMouseEnter}
                onMouseMove={magnetic.onMouseMove}
                onMouseLeave={magnetic.onMouseLeave}
              >
                Rezerwuj online
              </button>
              <a className={styles.secondary} href={salon.phoneHref}>Zadzwoń</a>
              <a className={styles.secondary} href={salon.mapsUrl} target="_blank" rel="noopener noreferrer">
                Wyznacz trasę
              </a>
            </div>

            <dl className={styles.meta}>
              <div className={styles.item}>
                <dt className={styles.key}>Adres</dt>
                <dd className={styles.val}>{salon.address}</dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.key}>Godziny</dt>
                <dd className={styles.val}>{salon.hoursLabel}</dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.key}>Telefon</dt>
                <dd className={styles.val}><a href={salon.phoneHref}>{salon.phone}</a></dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.key}>E-mail</dt>
                <dd className={styles.val}><a href={`mailto:${salon.email}`}>{salon.email}</a></dd>
              </div>
            </dl>
          </div>

          <div className={styles.right}>
            <SalonMap />
          </div>
        </div>
      </div>
    </section>
  );
}
