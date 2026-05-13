import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { SCROLL_CARDS } from '../../data/scrollCardsData';
import styles from './scrollCards.module.css';

export default function ScrollCards() {
  const viewportRef = useRef(null);
  const [active, setActive] = useState(0);
  const isAnimating = useRef(false);
  const total = SCROLL_CARDS.length;

  useEffect(() => {
    const cards = viewportRef.current?.querySelectorAll('[data-card]');
    if (!cards) return;
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotateY: i === 0 ? 0 : 90,
        z:       i === 0 ? 0 : -200,
        opacity: i === 0 ? 1 : 0,
        scale:   i === 0 ? 1 : 0.92,
      });
    });
    animateBars(cards[0]);
  }, []);

  const flip = useCallback((direction) => {
    if (isAnimating.current) return;
    const cards = viewportRef.current?.querySelectorAll('[data-card]');
    if (!cards) return;

    const next = direction === 'next'
      ? (active + 1) % total
      : (active - 1 + total) % total;

    const exitY  = direction === 'next' ? -90 : 90;
    const enterY = direction === 'next' ?  90 : -90;

    isAnimating.current = true;

    // Pre-position incoming card
    gsap.set(cards[next], { rotateY: enterY, z: -200, opacity: 0, scale: 0.92 });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setActive(next);
        animateBars(cards[next]);
      },
    });

    // Exit current
    tl.to(cards[active], {
      rotateY: exitY, z: -200, opacity: 0, scale: 0.92,
      duration: 0.55, ease: 'power2.in',
    });
    // Enter next (slight overlap)
    tl.to(cards[next], {
      rotateY: 0, z: 0, opacity: 1, scale: 1,
      duration: 0.55, ease: 'power2.out',
    }, '-=0.20');
  }, [active, total]);

  function animateBars(card) {
    if (!card) return;
    // Reset all first
    document.querySelectorAll('[data-bar-fill]').forEach(f => gsap.set(f, { width: 0 }));
    // Animate this card's bars
    card.querySelectorAll('[data-bar-fill]').forEach(fill => {
      gsap.fromTo(fill,
        { width: 0 },
        { width: fill.getAttribute('data-bar-fill'), duration: 1.1, ease: 'power2.out', delay: 0.4 }
      );
    });
  }

  return (
    <section className={styles.section}>
      {/* Progress dots */}
      <div className={styles.progressDots}>
        {SCROLL_CARDS.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.activeDot : ''}`}
            onClick={() => {
              if (i > active) flip('next');
              else if (i < active) flip('prev');
            }}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className={styles.counter}>
        <span className={styles.counterActive}>{String(active + 1).padStart(2, '0')}</span>
        <span className={styles.counterSep}>/</span>
        <span className={styles.counterTotal}>{String(total).padStart(2, '0')}</span>
      </div>

      {/* Cards + arrow buttons */}
      <div className={styles.stageWrap}>

        {/* Prev button */}
        <button
          className={`${styles.arrowBtn} ${styles.arrowLeft}`}
          onClick={() => flip('prev')}
          aria-label="Previous card"
          disabled={isAnimating.current}
        >
          ←
        </button>

        {/* Perspective viewport */}
        <div className={styles.viewport} ref={viewportRef}>
          {SCROLL_CARDS.map((card, i) => (
            <div className={styles.card} key={i} data-card={i}>

              {/* Col 1 — vertical number */}
              <div className={styles.colNum}>
                <span className={styles.cardNum}>{card.number}</span>
              </div>

              {/* Col 2 — division info */}
              <div className={styles.colTitle}>
                <span className={styles.cardTag}>{card.category}</span>
                <h2 className={styles.cardHeadline}>
                  {card.headline} <em>{card.headlineAccent}</em>
                </h2>
                <p className={styles.cardDesc}>{card.description}</p>
                <div className={styles.statusRow}>
                  <span className={styles.badge + ' ' + styles.badgeRed}>{card.specCard.metrics[1].value} Critical</span>
                  <span className={styles.badge + ' ' + styles.badgeYel}>{card.specCard.metrics[2].value} Caution</span>
                  <span className={styles.badge + ' ' + styles.badgeGrn}>{card.specCard.metrics[3].value} On Track</span>
                </div>
              </div>

              {/* Col 3 — findings */}
              <div className={styles.colSteps}>
                <div className={styles.stepsLabel}>KEY FINDINGS</div>
                {card.features.map((f, fi) => (
                  <div key={fi} className={styles.step}>
                    <span className={styles.stepNum}>{String(fi + 1).padStart(2, '0')}</span>
                    <div>
                      <div className={styles.stepTitle}>{f.title}</div>
                      <p className={styles.stepBody}>{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Col 4 — spec card */}
              <div className={styles.colCard}>
                <div className={styles.specInner}>
                  <div className={styles.specTop}>
                    <span className={styles.specProd}>DIVISION SUMMARY</span>
                    <div className={styles.specName}>{card.specCard.title}</div>
                    <span className={styles.specRef}>{card.specCard.ref}</span>
                  </div>
                  {card.specCard.metrics.map((m, mi) => (
                    <div key={mi} className={styles.barRow}>
                      <div className={styles.barHeader}>
                        <span className={styles.barKey}>{m.label}</span>
                        <span className={styles.barVal}>{m.value}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          data-bar-fill={m.barWidth}
                          style={{ background: m.accent ? 'var(--acc)' : 'rgba(26,22,16,0.20)' }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className={styles.specFooter}>
                    <button className={styles.specBtn}>{card.specCard.ctaLabel}</button>
                    <p className={styles.specNote}>HMIS 2023–24 · NFHS-5</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          className={`${styles.arrowBtn} ${styles.arrowRight}`}
          onClick={() => flip('next')}
          aria-label="Next card"
          disabled={isAnimating.current}
        >
          →
        </button>

      </div>
    </section>
  );
}
