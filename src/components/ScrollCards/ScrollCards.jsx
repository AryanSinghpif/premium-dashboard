import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { SCROLL_CARDS } from '../../data/scrollCardsData';
import styles from './scrollCards.module.css';

const STATUS_BORDER = { red: '#B91C1C', yellow: '#D97706', green: '#16A34A' };
const STATUS_DOT    = { red: styles.dotRed, yellow: styles.dotYel, green: styles.dotGrn };
const STATUS_BADGE  = { red: styles.badgeRed, yellow: styles.badgeYel, green: styles.badgeGrn };
const STATUS_LABEL  = { red: 'Critical', yellow: 'Caution', green: 'On Track' };

export default function ScrollCards() {
  const viewportRef  = useRef(null);
  const [active, setActive] = useState(0);
  const isAnimating  = useRef(false);
  const total        = SCROLL_CARDS.length;

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
  }, []);

  const flip = useCallback((direction) => {
    if (isAnimating.current) return;
    const cards = viewportRef.current?.querySelectorAll('[data-card]');
    if (!cards) return;

    const next   = direction === 'next' ? (active + 1) % total : (active - 1 + total) % total;
    const exitY  = direction === 'next' ? -90 : 90;
    const enterY = direction === 'next' ?  90 : -90;

    isAnimating.current = true;
    gsap.set(cards[next], { rotateY: enterY, z: -200, opacity: 0, scale: 0.92 });

    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; setActive(next); },
    });
    tl.to(cards[active], { rotateY: exitY, z: -200, opacity: 0, scale: 0.92, duration: 0.55, ease: 'power2.in' });
    tl.to(cards[next],   { rotateY: 0,     z: 0,    opacity: 1, scale: 1,    duration: 0.55, ease: 'power2.out' }, '-=0.20');
  }, [active, total]);

  return (
    <section
      className={styles.section}
      style={{ '--card-color': SCROLL_CARDS[active].color }}
    >
      {/* Progress dots */}
      <div className={styles.progressDots}>
        {SCROLL_CARDS.map((card, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.activeDot : ''}`}
            style={i === active ? { background: SCROLL_CARDS[active].color } : {}}
            onClick={() => { if (i > active) flip('next'); else if (i < active) flip('prev'); }}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className={styles.counter}>
        <span className={styles.counterActive} style={{ color: SCROLL_CARDS[active].color }}>
          {String(active + 1).padStart(2, '0')}
        </span>
        <span className={styles.counterSep}>/</span>
        <span className={styles.counterTotal}>{String(total).padStart(2, '0')}</span>
      </div>

      <div className={styles.stageWrap}>
        <button className={`${styles.arrowBtn} ${styles.arrowLeft}`}
          onClick={() => flip('prev')} aria-label="Previous card" disabled={isAnimating.current}>←</button>

        <div className={styles.viewport} ref={viewportRef}>
          {SCROLL_CARDS.map((card, i) => (
            <div
              className={styles.card}
              key={i}
              data-card={i}
              style={{ '--card-color': card.color }}
            >

              {/* ── Top nav bar ── */}
              <div className={styles.cardNav}>

                {/* Division identity */}
                <div className={styles.navDivision}>
                  <span className={styles.navNum}>#{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.navCode}>{card.code}</span>
                  <span className={styles.navFull}>{card.fullName}</span>
                </div>

                {/* Programme pills */}
                <div className={styles.navProgs}>
                  {card.programs.map((p, pi) => (
                    <div
                      key={pi}
                      className={styles.navProgItem}
                      style={{ borderTopColor: STATUS_BORDER[p.status] }}
                    >
                      <span className={styles.navProgShort}>{p.short}</span>
                      <span className={`${styles.navProgDot} ${STATUS_DOT[p.status]}`} />
                    </div>
                  ))}
                </div>

              </div>

              {/* ── Body: tiles + overview strip ── */}
              <div className={styles.cardBody}>

                {/* Programme tiles — 2-col grid */}
                <div className={styles.progGrid}>
                  {card.programs.map((p, pi) => (
                    <div
                      key={pi}
                      className={styles.progTile}
                      style={{ borderTopColor: STATUS_BORDER[p.status] }}
                    >
                      <div className={styles.tileHead}>
                        <span className={styles.tileNum}>{String(pi + 1).padStart(2, '0')}</span>
                        <span className={styles.tileName}>{p.name}</span>
                      </div>
                      <p className={styles.tileDesc}>{p.desc}</p>
                      <div className={styles.tileFooter}>
                        <span className={styles.tileMetric}>{p.metric}</span>
                        <span className={`${styles.tileBadge} ${STATUS_BADGE[p.status]}`}>
                          {STATUS_LABEL[p.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right overview strip */}
                <div className={styles.overviewStrip}>
                  <div className={styles.stripLabel}>Overview</div>
                  <div className={styles.stripLines}>
                    {card.overview.map((line, li) => (
                      <div key={li} className={styles.stripLine}>{line}</div>
                    ))}
                  </div>
                  <div className={styles.stripStats}>
                    <div className={styles.stripStatRow}>
                      <span className={styles.sKey}>Total</span>
                      <span className={`${styles.sVal} ${styles.sValNeu}`}>{card.stats.total}</span>
                    </div>
                    <div className={styles.stripStatRow}>
                      <span className={styles.sKey}>Critical</span>
                      <span className={`${styles.sVal} ${styles.sValRed}`}>{card.stats.critical}</span>
                    </div>
                    <div className={styles.stripStatRow}>
                      <span className={styles.sKey}>Caution</span>
                      <span className={`${styles.sVal} ${styles.sValYel}`}>{card.stats.caution}</span>
                    </div>
                    <div className={styles.stripStatRow}>
                      <span className={styles.sKey}>On Track</span>
                      <span className={`${styles.sVal} ${styles.sValGrn}`}>{card.stats.onTrack}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        <button className={`${styles.arrowBtn} ${styles.arrowRight}`}
          onClick={() => flip('next')} aria-label="Next card" disabled={isAnimating.current}>→</button>
      </div>
    </section>
  );
}
