import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const DIVISIONS = [
  {
    key: 'rch',
    code: 'RCH',
    name: 'Reproductive & Child Health',
    color: '#0F766E',
    rgb: '15,118,110',
    total: 10,
    critical: 3,
    caution: 4,
    onTrack: 3,
    progress: 70,
    desc: 'Maternal health, child immunisation, and nutrition programmes across all states.',
  },
  {
    key: 'ndcp',
    code: 'NDCP',
    name: 'National Disease Control',
    color: '#7C3AED',
    rgb: '124,58,237',
    total: 6,
    critical: 2,
    caution: 3,
    onTrack: 1,
    progress: 58,
    desc: 'TB elimination, malaria control, and vector-borne disease surveillance.',
  },
  {
    key: 'ncd',
    code: 'NCD',
    name: 'Non-Communicable Diseases',
    color: '#6D28D9',
    rgb: '109,40,217',
    total: 8,
    critical: 1,
    caution: 3,
    onTrack: 4,
    progress: 75,
    desc: 'Cardiovascular disease, diabetes, cancer screening, and mental health initiatives.',
  },
  {
    key: 'hss',
    code: 'HSS',
    name: 'Health System Strengthening',
    color: '#1D4ED8',
    rgb: '29,78,216',
    total: 4,
    critical: 1,
    caution: 2,
    onTrack: 1,
    progress: 82,
    desc: 'HWCs, HMIS capacity, workforce training, and digital health infrastructure.',
  },
];

const NFHS_METRICS = [
  { label: 'Maternal Mortality Ratio', value: '97', unit: '/lakh LB', trend: 'down' },
  { label: 'Under-5 Mortality', value: '32', unit: '/1,000 LB', trend: 'down' },
  { label: 'Infant Mortality', value: '28', unit: '/1,000 LB', trend: 'down' },
  { label: 'ANC Coverage', value: '79', unit: '%', trend: 'up' },
  { label: 'Institutional Births', value: '89', unit: '%', trend: 'up' },
  { label: 'Full Immunisation', value: '76', unit: '%', trend: 'up' },
];

const SOURCES = [
  { name: 'NFHS-5', full: 'National Family Health Survey', year: '2019–21', color: '#0F766E' },
  { name: 'HMIS', full: 'Health Management Information System', year: '2023–24', color: '#7C3AED' },
  { name: 'iGOT', full: 'Integrated Government Online Training', year: '2025–26', color: '#1D4ED8' },
];

function useCountUp(target, duration, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return count;
}

function HeroStats({ active }) {
  const t = useCountUp(28, 1400, active);
  const c = useCountUp(7, 1600, active);
  const ca = useCountUp(12, 1800, active);
  const o = useCountUp(9, 2000, active);
  const stats = [
    { val: t,  label: 'Programmes', cls: 'stat--white'  },
    { val: c,  label: 'Critical',   cls: 'stat--red'    },
    { val: ca, label: 'Caution',    cls: 'stat--yellow' },
    { val: o,  label: 'On Track',   cls: 'stat--green'  },
  ];
  return (
    <div className="hero-stats">
      {stats.map(({ val, label, cls }) => (
        <div className={`hero-stat ${cls}`} key={label}>
          <span className="hs-num">{val}</span>
          <span className="hs-lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}

function DivisionCard({ div, index }) {
  const ref = useRef(null);
  const barRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: index * 0.10,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } }
    );
    gsap.fromTo(barRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'power2.out', delay: index * 0.10 + 0.4,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        transformOrigin: 'left center' }
    );
  }, [index]);

  return (
    <div className="div-card" ref={ref}
      style={{ '--dc': div.color, '--dc-rgb': div.rgb }}>
      <div className="dc-top">
        <span className="dc-chip">{div.code}</span>
        <div className="dc-counts">
          <span className="dc-cnt dc-cnt--red">{div.critical} critical</span>
          <span className="dc-cnt dc-cnt--yellow">{div.caution} caution</span>
          <span className="dc-cnt dc-cnt--green">{div.onTrack} on track</span>
        </div>
      </div>
      <h3 className="dc-name">{div.name}</h3>
      <p className="dc-desc">{div.desc}</p>
      <div className="dc-prog-row">
        <div className="dc-prog-track">
          <div className="dc-prog-fill" ref={barRef} style={{ width: `${div.progress}%` }} />
        </div>
        <span className="dc-prog-pct">{div.progress}%</span>
      </div>
      <div className="dc-footer">
        <span className="dc-total">{div.total} programmes</span>
        <button className="dc-btn">Explore <span className="dc-arrow">→</span></button>
      </div>
    </div>
  );
}

export default function App() {
  const blobRef = useRef(null);
  const blob2Ref = useRef(null);
  const heroRef = useRef(null);
  const [statsActive, setStatsActive] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setStatsActive(true);
    gsap.to(blobRef.current, {
      x: 60, y: -40, scale: 1.12,
      duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    gsap.to(blob2Ref.current, {
      x: -50, y: 30, scale: 0.92,
      duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3,
    });
    gsap.fromTo('.hero-eyebrow, .hero-headline, .hero-sub, .hero-stats, .hero-actions',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="pg">
      {/* ── Navbar ── */}
      <nav className={`nav ${navScrolled ? 'nav--up' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="nav-setu">Setu</span>
            <span className="nav-by">by Pahlé India Foundation</span>
          </div>
          <div className="nav-links">
            {[['overview','Overview'],['divisions','Divisions'],['metrics','Metrics'],['sources','Sources']].map(([id, label]) => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>
          <button className="nav-cta" onClick={() => scrollTo('overview')}>
            View Dashboard <span>→</span>
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" id="overview" ref={heroRef}>
        <div className="blob blob--1" ref={blobRef} />
        <div className="blob blob--2" ref={blob2Ref} />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-pulse" />
            Live · Updated Apr 2026
          </div>
          <h1 className="hero-headline">
            Real-Time Health Intelligence<br />
            <em className="headline-em">for 1.4 Billion</em>
          </h1>
          <p className="hero-sub">
            Tracking 28 national programmes across 4 divisions — from maternal care
            to non-communicable disease prevention. Powered by NFHS-5, HMIS &amp; iGOT.
          </p>
          <HeroStats active={statsActive} />
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo('divisions')}>
              Explore Divisions
            </button>
            <button className="btn-ghost" onClick={() => scrollTo('metrics')}>
              View NFHS-5 Data
            </button>
          </div>
        </div>
        <div className="scroll-cue">
          <div className="scroll-line" />
          <span className="scroll-label">scroll</span>
        </div>
      </section>

      {/* ── Divisions ── */}
      <section className="section" id="divisions">
        <div className="sec-inner">
          <div className="sec-hdr">
            <span className="sec-eye">Divisions</span>
            <h2 className="sec-title">Four pillars of national health</h2>
            <p className="sec-sub">Each division aggregates multiple national programmes. Click any card to drill into programme-level indicators.</p>
          </div>
          <div className="div-grid">
            {DIVISIONS.map((d, i) => <DivisionCard key={d.key} div={d} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── NFHS Metrics ── */}
      <section className="section section--alt" id="metrics">
        <div className="sec-inner">
          <div className="sec-hdr">
            <span className="sec-eye" style={{ color: '#34D399' }}>NFHS-5 · 2019–21</span>
            <h2 className="sec-title">Key national health benchmarks</h2>
            <p className="sec-sub">Baseline figures from the Fifth National Family Health Survey against which programme targets are tracked.</p>
          </div>
          <div className="metrics-grid">
            {NFHS_METRICS.map((m) => (
              <div className="metric-card" key={m.label}>
                <span className={`metric-trend ${m.trend === 'up' ? 'trend--up' : 'trend--down'}`}>
                  {m.trend === 'up' ? '↑' : '↓'}
                </span>
                <div className="metric-val">
                  {m.value}<span className="metric-unit">{m.unit}</span>
                </div>
                <div className="metric-lbl">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sources ── */}
      <section className="section" id="sources">
        <div className="sec-inner">
          <div className="sec-hdr">
            <span className="sec-eye">Data Infrastructure</span>
            <h2 className="sec-title">Powered by authoritative sources</h2>
          </div>
          <div className="sources-grid">
            {SOURCES.map((s) => (
              <div className="src-card" key={s.name} style={{ '--sc': s.color }}>
                <span className="src-badge">{s.name}</span>
                <div className="src-full">{s.full}</div>
                <div className="src-year">{s.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-setu">Setu</span>
          <span className="footer-copy">© 2026 · Pahlé India Foundation · Ministry of Health &amp; Family Welfare</span>
          <div className="footer-links">
            <span>NFHS-5</span>
            <span>HMIS</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
