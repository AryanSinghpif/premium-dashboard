import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardPanel from './CardPanel';
import { SCROLL_CARDS } from '../../data/scrollCardsData';
import styles from './scrollCards.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCards() {
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = gsap.utils.toArray('[data-card-index]');
    const total = cards.length;

    // Initial states
    cards.forEach((card, i) => {
      if (i === 0) {
        gsap.set(card, { rotationX: 0, z: 0, opacity: 1, transformOrigin: '50% 0%' });
      } else {
        gsap.set(card, { rotationX: 25, z: -400, opacity: 0, transformOrigin: '50% 0%' });
      }
    });

    ctxRef.current = gsap.context(() => {
      cards.forEach((card, i) => {
        const isLast = i === total - 1;
        const segStart = (i / total) * 100;
        const segEnd = ((i + 1) / total) * 100;

        ScrollTrigger.create({
          trigger: container,
          start: `${segStart}% top`,
          end: `${segEnd}% top`,
          scrub: 1.4,
          onUpdate(self) {
            const p = self.progress;

            // Exit current card
            if (!isLast) {
              gsap.set(card, {
                rotationX: -p * 88,
                z: -p * 300,
                opacity: Math.max(0, 1 - p * 1.8),
                transformOrigin: '50% 0%',
              });
            }

            // Enter next card
            if (i + 1 < total) {
              gsap.set(cards[i + 1], {
                rotationX: 25 * (1 - p),
                z: -400 * (1 - p),
                opacity: Math.min(1, p * 1.8),
                transformOrigin: '50% 0%',
              });
            }

            setActiveIndex(p > 0.5 && i + 1 < total ? i + 1 : i);
          },
        });
      });

      // Show/hide progress dots and scroll label
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => setIsVisible(true),
        onLeave: () => setIsVisible(false),
        onEnterBack: () => setIsVisible(true),
        onLeaveBack: () => setIsVisible(false),
      });
    }, container);

    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.bgGrain} aria-hidden="true" />

      {isVisible && (
        <div className={styles.progressDots} role="tablist" aria-label="Section progress">
          {SCROLL_CARDS.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Section ${i + 1}`}
            />
          ))}
        </div>
      )}

      {isVisible && (
        <p className={styles.scrollLabel} aria-hidden="true">
          SCROLL TO EXPLORE DIVISIONS
        </p>
      )}

      <div className={styles.scrollContainer} ref={containerRef}>
        <div className={styles.stickyViewport}>
          {SCROLL_CARDS.map((card, i) => (
            <CardPanel key={card.number} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
