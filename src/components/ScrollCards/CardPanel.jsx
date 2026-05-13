import SpecCard from './SpecCard';
import styles from './scrollCards.module.css';

export default function CardPanel({ card, index }) {
  return (
    <div className={styles.card} data-card-index={index}>
      <div className={styles.leftPanel}>
        <span className={styles.sectionNumber} aria-hidden="true">{card.number}</span>
        <p className={styles.categoryLabel}>{card.category}</p>
        <h2 className={styles.headline}>
          {card.headline}{' '}
          <em className={styles.headlineAccent}>{card.headlineAccent}</em>
        </h2>
        <p className={styles.description}>{card.description}</p>
      </div>

      <div className={styles.centerPanel}>
        {card.features.map((f, fi) => (
          <div key={fi} className={styles.featureRow}>
            <span className={styles.featureArrow} aria-hidden="true">→</span>
            <div>
              <p className={styles.featureTitle}>{f.title}</p>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          </div>
        ))}
      </div>

      <SpecCard data={card.specCard} />
    </div>
  );
}
