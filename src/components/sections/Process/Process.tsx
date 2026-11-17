import styles from "./process.module.scss";
import { processSteps } from "../../../data/content";
import { useInView } from "../../../hooks/useInView";

export function Process() {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  return (
    <section
      className={styles.section}
      id="proces"
      aria-label="Przebieg wizyty"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            Przebieg wizyty
          </p>
          <h2 className={styles.title}>
            Od rezerwacji<br />do fotela.
          </h2>
        </header>

        <ol className={styles.steps}>
          {processSteps.map((step, i) => (
            <li
              key={step.num}
              className={styles.step}
              data-reveal={rv}
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <div className={styles.stepNum} aria-hidden="true">{step.num}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
