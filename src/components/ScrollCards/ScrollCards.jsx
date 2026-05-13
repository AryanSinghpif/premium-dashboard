import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SCROLL_CARDS } from '../../data/scrollCardsData';
import styles from './scrollCards.module.css';

export default function ScrollCards() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const tlRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    if (!section || !viewport) return;

    const cards = Array.from(viewport.querySelectorAll('[data-card]'));
    const total = cards.length;

    // Set initial states — first card flat, rest rotated 90deg off-screen to right
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotateY:  i === 0 ? 0 : 90,
        z:        i === 0 ? 0 : -300,
        opacity:  i === 0 ? 1 : 0,
        scale:    i === 0 ? 1 : 0.88,
      });
    });

    // Animate bars in first card
    animateBars(cards[0]);

    // Build the timeline — each card exits left (rotateY -90) while next enters from right (rotateY 90 → 0)
    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    cards.forEach((card, i) => {
      if (i >= total - 1) return;
      // Exit current
      tl.to(card, {
        rotateY: -90, z: -300, opacity: 0, scale: 0.88,
        duration: 1, ease: 'power2.inOut',
      }, i);
      // Enter next
      tl.to(cards[i + 1], {
        rotateY: 0, z: 0, opacity: 1, scale: 1,
        duration: 1, ease: 'power2.inOut',
        onStart: () => {
          setActiveIndex(i + 1);
          animateBars(cards[i + 1]);
        },
      }, i + 0.05);
    });

    // Play when section enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset and replay from start
          setActiveIndex(0);
          cards.forEach((card, i) => {
            gsap.set(card, {
              rotateY: i === 0 ? 0 : 90,
              z: i === 0 ? 0 : -300,
              opacity: i === 0 ? 1 : 0,
              scale: i === 0 ? 1 : 0.88,
            });
          });
          resetBars();
          animateBars(cards[0]);
          tl.restart();
        } else {
          tl.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(section);

    return () => {
      tl.kill();
      observer.disconnect();
    };
  }, []);

  function animateBars(card) {
    if (!card) return;
    card.querySelectorAll('[data-bar-fill]').forEach((fill) => {
      const w = fill.getAttribute('data-bar-fill');
      gsap.fromTo(fill, { width: 0 }, { width: w, duration: 1.2, ease: 'power2.out', delay: 0.3 });
    });
  }

  function resetBars() {
    document.querySelectorAll('[data-bar-fill]').forEach((fill) => {
      gsap.set(fill, { width: 0 });
    });
  }

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Progress dots */}
      <div className={styles.progressDots}>
        {SCROLL_CARDS.map((_, i) => (
          <div key={i} className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`} />
        ))}
      </div>

      {/* Scroll label */}
      <p className={styles.scrollLabel}>Scroll to explore features</p>

      {/* Cards viewport */}
      <div className={styles.viewport} ref={viewportRef}>
        {SCROLL_CARDS.map((card, i) => (
          <div className={styles.card} key={i} data-card={i}>

            {/* Col 1 — vertical number */}
            <div className={styles.colNum}>
              <span className={styles.cardNum}>{card.number}</span>
            </div>

            {/* Col 2 — headline + description */}
            <div className={styles.colTitle}>
              <span className={styles.cardTag}>{card.category}</span>
              <h2 className={styles.cardHeadline}>
                {card.headline}{' '}
                <em>{card.headlineAccent}</em>
              </h2>
              <p className={styles.cardDesc}>{card.description}</p>
            </div>

            {/* Col 3 — feature steps */}
            <div className={styles.colSteps}>
              {card.features.map((f, fi) => (
                <div key={fi} className={styles.step}>
                  <span className={styles.stepArrow}>→</span>
                  <div>
                    <div className={styles.stepTitle}>{f.title}</div>
                    <p className={styles.stepBody}>{f.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Col 4 — spec / label card */}
            <div className={styles.colCard}>
              <div className={styles.specInner}>
                <div className={styles.specTop}>
                  <span className={styles.specProd}>{card.specCard.label}</span>
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
                        data-bar-fill={m.barWidth || `${Math.min(parseInt(m.value) * 10, 100)}%`}
                        style={{ background: m.accent ? 'var(--acc)' : 'rgba(26,22,16,0.25)' }}
                      />
                    </div>
                  </div>
                ))}
                <div className={styles.specFooter}>
                  <button className={styles.specBtn}>{card.specCard.ctaLabel}</button>
                  <p className={styles.specNote}>DATA SOURCE: HMIS · NFHS-5</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
