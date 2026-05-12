import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const TICKER_ITEMS = [
  'RCH · Reproductive & Child Health',
  'NDCP · National Disease Control Programmes',
  'NCD · Non-Communicable Diseases',
  'HSS · Health System Strengthening',
  'NFHS-5 · 2019–21 Baseline Data',
  'HMIS · 2023–24 Programme Data',
  'iGOT · Capacity Building Index',
  '28 Programmes Tracked',
  '7 Critical · 12 Caution · 9 On Track',
  'Pahlé India Foundation · Setu Dashboard',
];

const DIVISIONS = [
  { code: 'RCH',  name: 'Reproductive & Child Health',   total: 10, critical: 3, caution: 4, onTrack: 3, progress: 70, color: '#0F766E', rgb: '15,118,110',  desc: 'Maternal health, child immunisation, PMSMA, Janani Suraksha, and nutrition programmes.' },
  { code: 'NDCP', name: 'National Disease Control',       total: 6,  critical: 2, caution: 3, onTrack: 1, progress: 58, color: '#7C3AED', rgb: '124,58,237',  desc: 'TB elimination, malaria, kala-azar, filaria, and vector-borne disease surveillance.' },
  { code: 'NCD',  name: 'Non-Communicable Diseases',     total: 8,  critical: 1, caution: 3, onTrack: 4, progress: 75, color: '#6D28D9', rgb: '109,40,217',  desc: 'Cardiovascular disease, diabetes, cancer screening, and mental health initiatives.' },
  { code: 'HSS',  name: 'Health System Strengthening',   total: 4,  critical: 1, caution: 2, onTrack: 1, progress: 82, color: '#0E9E8A', rgb: '14,158,138',  desc: 'HWCs, HMIS digitisation, workforce training, and digital health infrastructure.' },
];

const NFHS_METRICS = [
  { label: 'Maternal Mortality Ratio',  value: '97',  unit: '/lakh LB',  src: 'NFHS-5' },
  { label: 'Under-5 Mortality Rate',    value: '32',  unit: '/1,000 LB', src: 'NFHS-5' },
  { label: 'Infant Mortality Rate',     value: '28',  unit: '/1,000 LB', src: 'NFHS-5' },
  { label: 'ANC Coverage (4+ visits)',  value: '79',  unit: '%',         src: 'HMIS' },
  { label: 'Institutional Births',      value: '89',  unit: '%',         src: 'NFHS-5' },
  { label: 'Full Immunisation',         value: '76',  unit: '%',         src: 'NFHS-5' },
];

const STAT_ITEMS = [
  { num: '28',  em: '',  label: 'Programmes Tracked' },
  { num: '7',   em: '',  label: 'Critical Status'    },
  { num: '12',  em: '',  label: 'Under Caution'      },
  { num: '9',   em: '',  label: 'On Track'            },
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i}>{t} <span className="ticker-dot">·</span> </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ item, index }) {
  const barRef = useRef(null);
  useEffect(() => {
    const el = barRef.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => el.classList.add('lit'),
    });
    return () => st.kill();
  }, []);
  return (
    <div className={`sc sc--${index}`} ref={barRef}>
      <span className="sc-num">
        {item.num}<em>{item.em}</em>
      </span>
      <span className="sc-lbl">{item.label}</span>
    </div>
  );
}

function DivisionRow({ div, index }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: index * 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }
    );
  }, [index]);
  return (
    <div className="div-row" ref={ref}>
      <div className="dr-left">
        <span className="dr-code" style={{ color: div.color }}>{div.code}</span>
        <div className="dr-body">
          <div className="dr-name">{div.name}</div>
          <div className="dr-desc">{div.desc}</div>
        </div>
      </div>
      <div className="dr-right">
        <div className="dr-counts">
          <span className="dr-cnt dr-cnt--red">{div.critical} critical</span>
          <span className="dr-cnt dr-cnt--yel">{div.caution} caution</span>
          <span className="dr-cnt dr-cnt--grn">{div.onTrack} on track</span>
        </div>
        <div className="dr-bar-wrap">
          <div className="dr-bar-track">
            <div className="dr-bar-fill" style={{ width: `${div.progress}%`, background: div.color }} />
          </div>
          <span className="dr-pct" style={{ color: div.color }}>{div.progress}%</span>
        </div>
        <button className="dr-btn">Explore →</button>
      </div>
    </div>
  );
}

function MetricCard({ m, index }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: index * 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true } }
    );
  }, [index]);
  return (
    <div className="metric-card" ref={ref}>
      <span className="mc-src">{m.src}</span>
      <div className="mc-val">{m.value}<span className="mc-unit">{m.unit}</span></div>
      <div className="mc-lbl">{m.label}</div>
    </div>
  );
}

export default function App() {
  const cursorRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo('.hero-receipt, .hero-h1, .hero-sub, .hero-meta',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.10, duration: 0.65, ease: 'power3.out', delay: 0.15 }
    );
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="pg">
      <div id="bm-cursor" ref={cursorRef} />

      {/* ── Top strip ── */}
      <div className="top-strip">
        <div className="top-strip-inner">
          {[...Array(4)].map((_, i) => (
            <span key={i}>Setu · Pahlé India Foundation · 28 Programmes · 4 Divisions · NFHS-5 Data · HMIS 2023–24 · iGOT · Ministry of Health & Family Welfare &nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className={navScrolled ? 'nav--up' : ''}>
        <div className="nav-l">
          <div className="nav-logo">
            <span className="nav-dot" />
            SETU
          </div>
          <a href="#overview" className="nav-link" onClick={e => { e.preventDefault(); scrollTo('overview'); }}>Overview</a>
          <a href="#divisions" className="nav-link" onClick={e => { e.preventDefault(); scrollTo('divisions'); }}>Divisions</a>
          <a href="#metrics" className="nav-link" onClick={e => { e.preventDefault(); scrollTo('metrics'); }}>Metrics</a>
          <a href="#sources" className="nav-link" onClick={e => { e.preventDefault(); scrollTo('sources'); }}>Sources</a>
        </div>
        <div className="nav-r">
          <button className="nav-cta" onClick={() => scrollTo('overview')}>View Dashboard →</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="overview" className="hero-section">
        <div className="hero-left">
          <div className="hero-receipt">
            <div className="receipt-header">
              <span className="receipt-logo">SETU</span>
              <span className="receipt-sub">NATIONAL HEALTH INTELLIGENCE</span>
            </div>
            <div className="r-row"><span className="rk">DATA SOURCE</span><span className="rv acc">NFHS-5 / HMIS</span></div>
            <div className="r-row"><span className="rk">COVERAGE</span><span className="rv">ALL 36 STATES/UTs</span></div>
            <div className="r-row"><span className="rk">LAST UPDATED</span><span className="rv">APR 2026</span></div>
            <div className="r-row"><span className="rk">DIVISIONS</span><span className="rv">4</span></div>
            <hr className="r-divider" />
            <div className="r-row"><span className="rk">CRITICAL</span><span className="rv acc">7 PROGRAMMES</span></div>
            <div className="r-row"><span className="rk">CAUTION</span><span className="rv">12 PROGRAMMES</span></div>
            <div className="r-row"><span className="rk">ON TRACK</span><span className="rv">9 PROGRAMMES</span></div>
            <hr className="r-divider" />
            <div className="r-total"><span>TOTAL PROGRAMMES</span><span className="rv acc">28</span></div>
            <div className="receipt-footer">PAHLÉ INDIA FOUNDATION · MoHFW</div>
          </div>
          <div className="hero-bigtext">UPDATED APR 2026 · LIVE DATA</div>
        </div>
        <div className="hero-right">
          <div className="hero-corner">
            <span className="corner-date">MAY 2026</span><br />
            SETU DASHBOARD<br />
            VERSION 2.0
          </div>
          <h1 className="hero-h1">
            REAL-TIME<br />
            HEALTH<br />
            <em>INTELLIGENCE</em>
            <span className="small">Tracking 28 national programmes across 4 divisions —<br />from maternal care to non-communicable disease prevention.</span>
          </h1>
          <div className="hero-meta">
            <button className="h-btn" onClick={() => scrollTo('divisions')}>Explore Divisions</button>
            <button className="h-btn-ghost" onClick={() => scrollTo('metrics')}>NFHS-5 Data →</button>
          </div>
        </div>
      </section>

      {/* ── Stats row ── */}
      <div className="stats-row">
        {STAT_ITEMS.map((s, i) => <StatCard key={i} item={s} index={i} />)}
      </div>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Big marquee ── */}
      <div className="big-marquee">
        <div className="big-track">
          {['SETU', 'HEALTH', 'DATA', 'INDIA', 'NFHS', 'HMIS', 'SETU', 'HEALTH', 'DATA', 'INDIA', 'NFHS', 'HMIS'].map((w, i) => (
            <span key={i} className={`big-word ${i % 6 === 1 ? 'hi' : ''}`}>{w}</span>
          ))}
        </div>
      </div>

      {/* ── Divisions ── */}
      <section id="divisions" className="divisions-section">
        <div className="sec-header">
          <div className="sec-num">01</div>
          <div className="sec-title-cell">
            <span className="sec-tag">DIVISIONS</span>
            <h2 className="sec-h">Four Pillars of<br /><em>National Health</em></h2>
          </div>
          <div className="sec-desc-cell">
            <p className="sec-desc">Each division aggregates multiple national programmes. Real-time status is derived from HMIS reporting cycles and NFHS-5 baseline targets.</p>
          </div>
        </div>
        <div className="div-list">
          {DIVISIONS.map((d, i) => <DivisionRow key={d.code} div={d} index={i} />)}
        </div>
      </section>

      {/* ── NFHS Metrics ── */}
      <section id="metrics" className="metrics-section">
        <div className="sec-header sec-header--alt">
          <div className="sec-num">02</div>
          <div className="sec-title-cell">
            <span className="sec-tag">NFHS-5 · 2019–21</span>
            <h2 className="sec-h">Key National<br /><em>Health Benchmarks</em></h2>
          </div>
          <div className="sec-desc-cell">
            <p className="sec-desc">Baseline figures from the Fifth National Family Health Survey. Programme targets are tracked against these benchmarks.</p>
          </div>
        </div>
        <div className="metrics-grid">
          {NFHS_METRICS.map((m, i) => <MetricCard key={m.label} m={m} index={i} />)}
        </div>
      </section>

      {/* ── Sources ── */}
      <section id="sources" className="sources-section">
        <div className="sec-header sec-header--alt">
          <div className="sec-num">03</div>
          <div className="sec-title-cell">
            <span className="sec-tag">DATA INFRASTRUCTURE</span>
            <h2 className="sec-h">Powered by<br /><em>Authoritative Sources</em></h2>
          </div>
          <div className="sec-desc-cell">
            <p className="sec-desc">All data is sourced from official government databases. No third-party data providers.</p>
          </div>
        </div>
        <div className="sources-grid">
          {[
            { name: 'NFHS-5',  full: 'National Family Health Survey', year: '2019–21', detail: 'Baseline for all maternal, child, and nutrition indicators.' },
            { name: 'HMIS',    full: 'Health Management Information System', year: '2023–24', detail: 'Monthly programme reporting from 700K+ health facilities.' },
            { name: 'iGOT',   full: 'Integrated Govt. Online Training', year: '2025–26', detail: 'Capacity building and workforce training index.' },
          ].map((s) => (
            <div className="src-card" key={s.name}>
              <span className="src-badge">{s.name}</span>
              <div className="src-full">{s.full}</div>
              <div className="src-year">{s.year}</div>
              <div className="src-detail">{s.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="ft-l">
          <span className="ft-logo">
            <span className="ft-dot" />
            SETU
          </span>
        </div>
        <div className="ft-mid">
          © 2026 · <a href="#">Pahlé India Foundation</a> · Ministry of Health &amp; Family Welfare
        </div>
        <div className="ft-legal">
          <a href="#" className="ft-link">NFHS-5</a>
          <a href="#" className="ft-link">HMIS</a>
          <a href="#" className="ft-link">Contact</a>
        </div>
      </footer>
    </div>
  );
}
