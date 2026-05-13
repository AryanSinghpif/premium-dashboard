import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollCards from './components/ScrollCards';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────── Data ─────────────────── */

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

const STAT_ITEMS = [
  { num: '28', label: 'Programmes Tracked' },
  { num: '7',  label: 'Critical Status'    },
  { num: '12', label: 'Under Caution'      },
  { num: '9',  label: 'On Track'           },
];

const S = { C: 'critical', W: 'caution', G: 'on-track' };

const DIVISIONS = [
  {
    n: '01', code: 'RCH', color: '#0F766E', rgb: '15,118,110',
    name: 'Reproductive & Child Health',
    desc: 'Covers maternal health, child immunisation, nutrition, and safe delivery programmes across all states and UTs.',
    total: 10, critical: 3, caution: 4, onTrack: 3, progress: 70,
    metric: '89%', metricLabel: 'Institutional Births',
    programmes: [
      { name: 'Janani Suraksha Yojana (JSY)',               status: S.G, metric: '91% coverage',     desc: 'Conditional cash transfer for institutional deliveries.' },
      { name: 'PM Matru Vandana Yojana (PMMVY)',            status: S.W, metric: '₹5,000 avg claim', desc: 'Maternity benefit scheme for first live birth.' },
      { name: 'PM Surakshit Matritva Abhiyan (PMSMA)',      status: S.C, metric: '14.2M checkups',   desc: 'Assured antenatal care on the 9th of every month.' },
      { name: 'LaQshya — Labour Room Quality',              status: S.W, metric: '62% certified',    desc: 'Quality improvement in labour rooms & maternity OTs.' },
      { name: 'Anaemia Mukt Bharat (AMB)',                  status: S.C, metric: '57% prevalence',   desc: 'Six-intervention strategy to reduce anaemia in all age groups.' },
      { name: 'Universal Immunisation Programme (UIP)',     status: S.G, metric: '76% full immun.',  desc: 'Free vaccines against 12 vaccine-preventable diseases.' },
      { name: 'Mission Indradhanush',                       status: S.W, metric: '84% coverage',     desc: 'Intensified immunisation for left-out/dropped-out children.' },
      { name: 'Poshan Abhiyaan',                            status: S.C, metric: '35% stunting',     desc: 'Mission to reduce stunting, undernutrition & low birth weight.' },
      { name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',    status: S.G, metric: '9.8M screened',    desc: 'Child health screening and early intervention services.' },
      { name: 'MAA Programme (Breastfeeding)',              status: S.W, metric: '41% exc. BF rate', desc: 'Promoting optimal breastfeeding and infant feeding practices.' },
    ],
  },
  {
    n: '02', code: 'NDCP', color: '#7C3AED', rgb: '124,58,237',
    name: 'National Disease Control',
    desc: 'TB elimination, malaria, kala-azar, leprosy, and vector-borne disease surveillance across 12 high-burden states.',
    total: 6, critical: 2, caution: 3, onTrack: 1, progress: 58,
    metric: '2.1M', metricLabel: 'TB Cases Notified',
    programmes: [
      { name: 'National TB Elimination Programme (NTEP)', status: S.C, metric: '2.1M notified',   desc: '100-day campaign; target End TB by 2025.' },
      { name: 'National Vector Borne Disease Control',    status: S.C, metric: '1.2M malaria',    desc: 'Malaria, dengue, chikungunya, filariasis & kala-azar control.' },
      { name: 'National Leprosy Eradication (NLEP)',      status: S.G, metric: '<1/10K PR',        desc: 'Elimination sustained; focus on disability prevention.' },
      { name: 'Integrated Disease Surveillance (IDSP)',   status: S.W, metric: '724 districts',   desc: 'Decentralised disease surveillance network.' },
      { name: 'National AIDS Control Programme (NACP)',   status: S.C, metric: '2.4M on ART',     desc: 'HIV/AIDS prevention, care and treatment.' },
      { name: 'AMR Containment Programme',               status: S.W, metric: '42 sentinel sites',desc: 'Antimicrobial resistance surveillance and containment.' },
    ],
  },
  {
    n: '03', code: 'NCD', color: '#6D28D9', rgb: '109,40,217',
    name: 'Non-Communicable Diseases',
    desc: 'Cardiovascular disease, diabetes, cancer screening, mental health, and tobacco control programmes.',
    total: 8, critical: 1, caution: 3, onTrack: 4, progress: 75,
    metric: '30%', metricLabel: 'HTN Treatment Coverage',
    programmes: [
      { name: 'NCD Mission — Hypertension & Diabetes',    status: S.G, metric: '30% treatment',   desc: 'Screening and management of HTN and T2DM at HWCs.' },
      { name: 'National Programme for Cancer Control',    status: S.W, metric: '1.8M screened',   desc: 'Cancer screening for cervical, breast & oral cancers.' },
      { name: 'National Mental Health Programme (NMHP)',  status: S.G, metric: '764 DMHP dists.', desc: 'District Mental Health Programme across all districts.' },
      { name: 'National Tobacco Control Programme',       status: S.G, metric: '28.6% prevalence',desc: 'COTPA enforcement, cessation centres and awareness.' },
      { name: 'National Programme for Blindness (NPCB)', status: S.G, metric: '94% cataract SR',  desc: 'Elimination of avoidable blindness; cataract surgeries.' },
      { name: 'National Deafness Prevention Programme',  status: S.W, metric: '4.2M screened',   desc: 'School hearing screening and cochlear implant support.' },
      { name: 'Fluorosis Prevention Programme',          status: S.W, metric: '230 endemic dists',desc: 'Safe water and defluoridation in endemic districts.' },
      { name: 'Occupational Health Programme',           status: S.C, metric: '12 OHCs active',  desc: 'Occupational disease surveillance at industrial clusters.' },
    ],
  },
  {
    n: '04', code: 'HSS', color: '#1D4ED8', rgb: '29,78,216',
    name: 'Health System Strengthening',
    desc: 'Health & Wellness Centres, HMIS digitisation, quality assurance, workforce capacity, and ABDM rollout.',
    total: 4, critical: 1, caution: 2, onTrack: 1, progress: 82,
    metric: '1.6L', metricLabel: 'HWCs Operational',
    programmes: [
      { name: 'Ayushman Bharat — Health & Wellness Centres', status: S.G, metric: '1.6L operational', desc: '1.6 lakh HWCs providing comprehensive primary care.' },
      { name: 'National Quality Assurance Programme (NQAS)', status: S.W, metric: '812 certified',    desc: 'NQAS, LaQshya, and Kayakalp quality certification.' },
      { name: 'Human Resources for Health (HRH)',            status: S.C, metric: '42% vacancy',       desc: 'Specialist shortfall at CHCs; MLHP deployment.' },
      { name: 'Ayushman Bharat Digital Mission (ABDM)',      status: S.W, metric: '540M ABHA IDs',     desc: 'Digital health ID and health records interoperability.' },
    ],
  },
];

const NFHS_METRICS = [
  { label: 'Maternal Mortality Ratio',  value: '97',  unit: '/lakh LB',  src: 'NFHS-5' },
  { label: 'Under-5 Mortality Rate',    value: '32',  unit: '/1,000 LB', src: 'NFHS-5' },
  { label: 'Infant Mortality Rate',     value: '28',  unit: '/1,000 LB', src: 'NFHS-5' },
  { label: 'ANC Coverage (4+ visits)',  value: '79',  unit: '%',         src: 'HMIS'   },
  { label: 'Institutional Births',      value: '89',  unit: '%',         src: 'NFHS-5' },
  { label: 'Full Immunisation',         value: '76',  unit: '%',         src: 'NFHS-5' },
];

/* ─────────────────── Sub-components ─────────────────── */

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i}>{t} <span className="ticker-dot">·</span> </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ item, index }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => el.classList.add('lit'),
    });
    return () => st.kill();
  }, []);
  return (
    <div className={`sc sc--${index}`} ref={ref}>
      <span className="sc-num">{item.num}</span>
      <span className="sc-lbl">{item.label}</span>
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

/* ── The key component: one full division product-section ── */
function DivisionSection({ div }) {
  const barRef = useRef(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const st = ScrollTrigger.create({
      trigger: bar, start: 'top 85%', once: true,
      onEnter: () => gsap.to(bar, { scaleX: 1, duration: 1.1, ease: 'power3.out' }),
    });
    return () => st.kill();
  }, []);

  const statusClass = { critical: 'ps-s--red', caution: 'ps-s--yel', 'on-track': 'ps-s--grn' };
  const statusLabel = { critical: 'Critical', caution: 'Caution', 'on-track': 'On Track' };

  return (
    <section className="prod-section" id={`div-${div.code.toLowerCase()}`}
      style={{ '--dc': div.color, '--dc-rgb': div.rgb }}>

      {/* Header row: number | title | desc — matches blackmantis prod-header */}
      <div className="prod-header">
        <div className="prod-num">{div.n}</div>
        <div className="prod-title-cell">
          <span className="prod-tag">{div.code} · DIVISION</span>
          <h2 className="prod-title">{div.name}</h2>
        </div>
        <div className="prod-desc-cell">
          <p className="prod-desc">{div.desc}</p>
        </div>
      </div>

      {/* Body: steps (left) + sticky card (right) */}
      <div className="prod-body">

        {/* Left — scrollable programme list */}
        <div className="prod-content">
          <div className="prod-steps">
            {div.programmes.map((p, i) => (
              <div className="ps" key={i}>
                <span className="ps-n">{String(i + 1).padStart(2, '0')}</span>
                <div className="ps-body">
                  <div className="ps-t">{p.name}</div>
                  <div className="ps-d">{p.desc}</div>
                </div>
                <div className="ps-right">
                  <span className="ps-metric">{p.metric}</span>
                  <span className={`ps-s ${statusClass[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — sticky stats card */}
        <div className="prod-card-wrap">
          <div className="prod-label">
            <div className="pl-head">
              <span className="pl-prod">DIVISION OVERVIEW</span>
              <div className="pl-name">{div.name}</div>
              <span className="pl-ref" style={{ color: div.color }}>{div.code} · APR 2026</span>
            </div>

            <div className="pl-row"><span className="pl-k">TOTAL PROGRAMMES</span><span className="pl-v">{div.total}</span></div>
            <div className="pl-row"><span className="pl-k">CRITICAL</span><span className="pl-v" style={{ color: '#B91C1C' }}>{div.critical}</span></div>
            <div className="pl-row"><span className="pl-k">CAUTION</span><span className="pl-v" style={{ color: '#92400E' }}>{div.caution}</span></div>
            <div className="pl-row"><span className="pl-k">ON TRACK</span><span className="pl-v" style={{ color: '#166534' }}>{div.onTrack}</span></div>

            <div className="pl-bar-wrap">
              <div className="pl-bar-track">
                <div
                  className="pl-bar-fill"
                  ref={barRef}
                  style={{ background: div.color, width: `${div.progress}%` }}
                />
              </div>
              <div className="pl-bar-labels">
                <span className="pl-k">OVERALL PROGRESS</span>
                <span className="pl-v" style={{ color: div.color }}>{div.progress}%</span>
              </div>
            </div>

            <div className="pl-footer">
              <div className="pl-kpi">
                <span className="pl-kpi-val" style={{ color: div.color }}>{div.metric}</span>
                <span className="pl-kpi-lbl">{div.metricLabel}</span>
              </div>
              <button className="pl-btn">Explore Full Division →</button>
              <span className="pl-note">DATA SOURCE: HMIS 2023–24 · NFHS-5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── App ─────────────────── */

export default function App() {
  const cursorRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
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
    gsap.fromTo('.hero-receipt, .hero-h1, .hero-meta',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.10, duration: 0.65, ease: 'power3.out', delay: 0.15 }
    );
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="pg">
      <div id="bm-cursor" ref={cursorRef} />

      {/* Top strip */}
      <div className="top-strip">
        <div className="top-strip-inner">
          {[...Array(4)].map((_, i) => (
            <span key={i}>Setu · Pahlé India Foundation · 28 Programmes · 4 Divisions · NFHS-5 Data · HMIS 2023–24 · iGOT · Ministry of Health &amp; Family Welfare &nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className={navScrolled ? 'nav--up' : ''}>
        <div className="nav-l">
          <div className="nav-logo"><span className="nav-dot" />SETU</div>
          {[['overview','Overview'],['divisions','Divisions'],['metrics','Metrics'],['sources','Sources']].map(([id, lbl]) => (
            <a key={id} href={`#${id}`} className="nav-link"
              onClick={e => { e.preventDefault(); scrollTo(id); }}>{lbl}</a>
          ))}
        </div>
        <div className="nav-r">
          <button className="nav-cta" onClick={() => scrollTo('overview')}>View Dashboard →</button>
        </div>
      </nav>

      {/* Hero */}
      <section id="overview" className="hero-section">
        <div className="hero-left">
          <div className="hero-receipt">
            <div className="receipt-header">
              <span className="receipt-logo">SETU</span>
              <span className="receipt-sub">NATIONAL HEALTH INTELLIGENCE</span>
            </div>
            {[['DATA SOURCE','NFHS-5 / HMIS',true],['COVERAGE','ALL 36 STATES/UTs',false],['LAST UPDATED','APR 2026',false],['DIVISIONS','4',false]].map(([k,v,acc]) => (
              <div className="r-row" key={k}><span className="rk">{k}</span><span className={`rv${acc?' acc':''}`}>{v}</span></div>
            ))}
            <hr className="r-divider" />
            {[['CRITICAL','7 PROGRAMMES',true],['CAUTION','12 PROGRAMMES',false],['ON TRACK','9 PROGRAMMES',false]].map(([k,v,acc]) => (
              <div className="r-row" key={k}><span className="rk">{k}</span><span className={`rv${acc?' acc':''}`}>{v}</span></div>
            ))}
            <hr className="r-divider" />
            <div className="r-total"><span>TOTAL PROGRAMMES</span><span className="rv acc">28</span></div>
            <div className="receipt-footer">PAHLÉ INDIA FOUNDATION · MoHFW</div>
          </div>
          <div className="hero-bigtext">UPDATED APR 2026 · LIVE DATA</div>
        </div>
        <div className="hero-right">
          <div className="hero-corner">
            <span className="corner-date">MAY 2026</span><br />SETU DASHBOARD<br />VERSION 2.0
          </div>
          <h1 className="hero-h1">
            REAL-TIME<br />HEALTH<br /><em>INTELLIGENCE</em>
            <span className="small">Tracking 28 national programmes across 4 divisions —<br />from maternal care to non-communicable disease prevention.</span>
          </h1>
          <div className="hero-meta">
            <button className="h-btn" onClick={() => scrollTo('divisions')}>Explore Divisions</button>
            <button className="h-btn-ghost" onClick={() => scrollTo('metrics')}>NFHS-5 Data →</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-row">
        {STAT_ITEMS.map((s, i) => <StatCard key={i} item={s} index={i} />)}
      </div>

      {/* Ticker */}
      <Ticker />

      {/* Big marquee */}
      <div className="big-marquee">
        <div className="big-track">
          {['SETU','HEALTH','DATA','INDIA','NFHS','HMIS','SETU','HEALTH','DATA','INDIA','NFHS','HMIS'].map((w, i) => (
            <span key={i} className={`big-word ${i % 6 === 1 ? 'hi' : ''}`}>{w}</span>
          ))}
        </div>
      </div>

      {/* ── GSAP 3D scroll cards ── */}
      <ScrollCards />

      {/* ── Division sections — one per pillar, blackmantis product style ── */}
      <div id="divisions">
        {DIVISIONS.map(div => <DivisionSection key={div.code} div={div} />)}
      </div>

      {/* NFHS Metrics */}
      <section id="metrics" className="metrics-section">
        <div className="sec-header sec-header--alt">
          <div className="sec-num">05</div>
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

      {/* Sources */}
      <section id="sources" className="sources-section">
        <div className="sec-header sec-header--alt">
          <div className="sec-num">06</div>
          <div className="sec-title-cell">
            <span className="sec-tag">DATA INFRASTRUCTURE</span>
            <h2 className="sec-h">Powered by<br /><em>Authoritative Sources</em></h2>
          </div>
          <div className="sec-desc-cell">
            <p className="sec-desc">All data sourced from official government databases. No third-party providers.</p>
          </div>
        </div>
        <div className="sources-grid">
          {[
            { name: 'NFHS-5', full: 'National Family Health Survey',      year: '2019–21', detail: 'Baseline for all maternal, child, and nutrition indicators.' },
            { name: 'HMIS',   full: 'Health Management Information System', year: '2023–24', detail: 'Monthly programme reporting from 700K+ health facilities.' },
            { name: 'iGOT',   full: 'Integrated Govt. Online Training',    year: '2025–26', detail: 'Capacity building and workforce training index.' },
          ].map(s => (
            <div className="src-card" key={s.name}>
              <span className="src-badge">{s.name}</span>
              <div className="src-full">{s.full}</div>
              <div className="src-year">{s.year}</div>
              <div className="src-detail">{s.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <span className="ft-logo"><span className="ft-dot" />SETU</span>
        <span className="ft-mid">© 2026 · <a href="#">Pahlé India Foundation</a> · Ministry of Health &amp; Family Welfare</span>
        <div className="ft-legal">
          <a href="#" className="ft-link">NFHS-5</a>
          <a href="#" className="ft-link">HMIS</a>
          <a href="#" className="ft-link">Contact</a>
        </div>
      </footer>
    </div>
  );
}
