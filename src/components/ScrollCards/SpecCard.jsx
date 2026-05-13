import styles from './scrollCards.module.css';

export default function SpecCard({ data }) {
  return (
    <div className={styles.rightPanel}>
      <div className={styles.specCard}>
        <p className={styles.specLabel}>{data.label}</p>
        <h3 className={styles.specTitle}>{data.title}</h3>
        <p className={styles.specRef}>{data.ref}</p>
        <hr className={styles.specDivider} />
        {data.metrics.map((m, i) => (
          <div key={i} className={styles.metricRow}>
            <span className={styles.metricLabel}>{m.label}</span>
            <span className={`${styles.metricValue} ${m.accent ? styles.accentValue : ''}`}>
              {m.value}
            </span>
          </div>
        ))}
        <hr className={styles.specDivider} />
        <button className={styles.ctaButton}>{data.ctaLabel}</button>
        <p style={{ fontSize: '0.6rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', marginTop: '-0.5rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
          DATA SOURCE: HMIS · NFHS-5
        </p>
      </div>
    </div>
  );
}
