import styles from "./gallery.module.scss";
import fryzjer from "../../../assets/images/fryzjer.jpg?w=900";
import maszynka from "../../../assets/images/maszynka.jpg?w=900";
import wlosy from "../../../assets/images/wlosy.jpg?w=900";
import broda from "../../../assets/images/broda.jpg?w=900";
import { useInView } from "../../../hooks/useInView";

const items = [
  { num: "01", label: "Skin Fade", img: fryzjer },
  { num: "02", label: "Beard Shaping", img: broda },
  { num: "03", label: "Classic Cut", img: wlosy },
  { num: "04", label: "Fade Detail", img: maszynka },
];

export function Gallery() {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  return (
    <section
      className={styles.section}
      id="galeria"
      aria-label="Galeria prac"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            Galeria
          </p>
          <h2 className={styles.title}>Realizacje.</h2>
          <p className={styles.subtitle}>
            Prawdziwe cięcia z naszych foteli.
          </p>
        </header>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <article
              key={item.num}
              className={styles.item}
              data-reveal={rv}
              style={{ "--reveal-delay": `${60 + i * 100}ms` } as React.CSSProperties}
            >
              <div className={styles.imgWrap}>
                <img
                  src={item.img}
                  alt={item.label}
                  className={styles.img}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className={styles.metaLabel}>{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
