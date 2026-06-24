'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';

import {Link} from '@/i18n/navigation';
import {Ball3D} from './Ball3D';
import {SiteHeader} from './SiteHeader';
import styles from './ForPlayers.module.css';

/* Join scoped module classes by their guide names, dropping falsy values. */
const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

const STEP_NAMES = [
  'The essentials',
  'Who you are',
  'Your game',
  'Your record',
  'Your footage'
];

const RIBBON_TEXT =
  'Acceso a más de 100 clubes · Inglaterra · España · Francia · Italia · Alemania · Austria · Bélgica · Hungría';

export function ForPlayers() {
  const locale = useLocale();
  const [playing, setPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [card, setCard] = useState({name: '', pos: '', age: '', eu: ''});

  const pageRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const truthRef = useRef<HTMLElement>(null);
  const voicesRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  const u = (s: string, fb: string) => (s.trim() ? s.toUpperCase() : fb);

  /* Entrance animations (mirrors the guide's body.play). */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPlaying(true));
    const t = setTimeout(() => setPlaying(true), 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  /* Scroll reveals. */
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(`.${styles.reveal}`);
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        }),
      {threshold: 0.12, rootMargin: '0px 0px -50px 0px'}
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Ball that travels across the pitch following the scroll, between the
     "truth" and "voices" sections. (Placeholder for the future 3D ball.) */
  useEffect(() => {
    const ball = ballRef.current;
    const truth = truthRef.current;
    const voices = voicesRef.current;
    if (!ball || !truth || !voices) return;
    const vw = () => window.innerWidth;
    function onScroll() {
      const startY = truth!.offsetTop;
      const endY = voices!.offsetTop + 200;
      const y = window.scrollY + window.innerHeight * 0.5;
      if (y < startY - 200 || y > endY + 200) {
        ball!.classList.remove(styles.show);
        return;
      }
      ball!.classList.add(styles.show);
      let p = (y - startY) / (endY - startY);
      p = Math.max(0, Math.min(1, p));
      const margin = 80;
      const span = vw() - margin * 2;
      const xWave = Math.sin(p * Math.PI * 2.4) * 0.5 + 0.5;
      const x = margin + xWave * span;
      const topPx = window.innerHeight * 0.5;
      ball!.style.transform = `translate(${x}px,calc(${topPx}px - 50%))`;
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock scroll + Escape close while the modal is open. */
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

  /* Tactical canvas behind the modal — players drift, pass the ball and react
     to the cursor when it is outside the form card. */
  useEffect(() => {
    if (!modalOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;
    const mouse = {x: -9999, y: -9999, active: false};
    type P = {
      hx: number;
      hy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      phase: number;
      roam: number;
    };
    const players: P[] = [];
    const ball: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      target: P | null;
      holder: P | null;
      traveling: boolean;
      cool: number;
    } = {x: 0, y: 0, vx: 0, vy: 0, target: null, holder: null, traveling: false, cool: 0};

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const seed = () => {
      players.length = 0;
      const form: [number, number][] = [
        [0.5, 0.12],
        [0.2, 0.3],
        [0.4, 0.32],
        [0.6, 0.32],
        [0.8, 0.3],
        [0.3, 0.55],
        [0.5, 0.55],
        [0.7, 0.55],
        [0.28, 0.8],
        [0.5, 0.82],
        [0.72, 0.8]
      ];
      for (const [fx, fy] of form) {
        players.push({
          hx: fx,
          hy: fy,
          x: fx * W,
          y: fy * H,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
          roam: 18 + Math.random() * 22
        });
      }
      const s = players[5];
      ball.x = s.x;
      ball.y = s.y;
      ball.holder = s;
      ball.traveling = false;
      ball.cool = 0;
    };

    const passBall = () => {
      const from = ball.holder || players[0];
      let best: P | null = null;
      let bestScore = -1;
      for (const p of players) {
        if (p === from) continue;
        const dx = p.x - from.x;
        const dy = p.y - from.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 60 || dist > W * 0.55) continue;
        const forward = (from.y - p.y) / H;
        const score = forward * 1.5 + Math.random() * 0.8 - Math.abs(dist - W * 0.25) / W;
        if (score > bestScore) {
          bestScore = score;
          best = p;
        }
      }
      if (!best) best = players[Math.floor(Math.random() * players.length)];
      ball.holder = null;
      ball.traveling = true;
      ball.target = best;
      const dx = best.x - ball.x;
      const dy = best.y - ball.y;
      const d = Math.hypot(dx, dy) || 1;
      const speed = Math.min(14, 6 + d * 0.02);
      ball.vx = (dx / d) * speed;
      ball.vy = (dy / d) * speed;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of players) {
        p.phase += 0.012;
        let tx = p.hx * W + Math.cos(p.phase) * p.roam;
        let ty = p.hy * H + Math.sin(p.phase * 0.8) * p.roam;
        const db = Math.hypot(ball.x - p.x, ball.y - p.y);
        if (p === ball.target || p === ball.holder || db < 140) {
          tx = tx * 0.6 + ball.x * 0.4;
          ty = ty * 0.6 + ball.y * 0.4;
        }
        if (mouse.active) {
          const dmx = p.x - mouse.x;
          const dmy = p.y - mouse.y;
          const dm = Math.hypot(dmx, dmy);
          if (dm < 200) {
            tx += (dmx / dm) * (200 - dm) * 0.5;
            ty += (dmy / dm) * (200 - dm) * 0.5;
          }
        }
        p.vx += (tx - p.x) * 0.008;
        p.vy += (ty - p.y) * 0.008;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
      }

      if (ball.traveling) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        const tg = ball.target;
        if (tg && Math.hypot(tg.x - ball.x, tg.y - ball.y) < 16) {
          ball.traveling = false;
          ball.holder = tg;
          ball.cool = 40 + Math.random() * 50;
        }
      } else if (ball.holder) {
        ball.x = ball.holder.x;
        ball.y = ball.holder.y;
        ball.cool--;
        if (ball.cool <= 0) passBall();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          const dx = players[i].x - players[j].x;
          const dy = players[i].y - players[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 210) {
            ctx.globalAlpha = (1 - d / 210) * 0.5;
            ctx.strokeStyle = 'rgba(208,216,226,0.5)';
            ctx.beginPath();
            ctx.moveTo(players[i].x, players[i].y);
            ctx.lineTo(players[j].x, players[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      if (ball.traveling) {
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = 'rgba(208,216,226,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x - ball.vx * 3, ball.y - ball.vy * 3);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      for (const p of players) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(208,216,226,0.6)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(208,216,226,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fcfcfc';
      ctx.fill();
      ctx.strokeStyle = 'rgba(7,44,104,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const r = modalCardRef.current?.getBoundingClientRect();
      if (r) {
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
        mouse.active = !inside;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onResize = () => resize();

    resize();
    seed();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [modalOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const validateStep = (n: number) => {
    const f = formRef.current;
    const bad = new Set<string>();
    if (!f) return bad;
    const val = (name: string) =>
      (f.querySelector(`[name="${name}"]`) as HTMLInputElement | null)?.value.trim() ?? '';
    const checked = (name: string) => !!f.querySelector(`[name="${name}"]:checked`);
    if (n === 0) {
      if (!val('position')) bad.add('position');
      if (!val('age_category')) bad.add('age_category');
      if (!checked('eu_passport')) bad.add('eu_passport');
      if (!val('sporting_nationality')) bad.add('sporting_nationality');
    }
    if (n === 1) {
      if (!val('full_name')) bad.add('full_name');
      if (!val('dob')) bad.add('dob');
      if (!val('country')) bad.add('country');
      if (!val('email')) bad.add('email');
      if (!checked('has_representative')) bad.add('has_representative');
    }
    if (n === 4) {
      if (!val('video_links')) bad.add('video_links');
      if (!(f.querySelector('#mPriv') as HTMLInputElement | null)?.checked)
        bad.add('consent_terms');
      if (!(f.querySelector('#mAge') as HTMLInputElement | null)?.checked)
        bad.add('consent_age');
    }
    return bad;
  };

  const onNext = () => {
    const bad = validateStep(step);
    if (bad.size > 0) {
      setErrors(bad);
      return;
    }
    setErrors(new Set());
    if (step < STEP_NAMES.length - 1) {
      setStep(step + 1);
      modalCardRef.current?.scrollTo(0, 0);
    } else {
      setSubmitted(true);
    }
  };
  const onBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const errCls = (name: string) => (errors.has(name) ? styles.err : undefined);
  const stepLabel = submitted
    ? 'Application sent'
    : `Step ${step + 1} of 5 · ${STEP_NAMES[step]}`;

  return (
    <div className={cx('page', playing && 'play')} ref={pageRef}>
      {/* Film grain */}
      <div className={cx('grain')}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="grainNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainNoise)" />
        </svg>
      </div>

      {/* Ball that follows the scroll — 3D GLB model */}
      <div className={cx('ball')} ref={ballRef} aria-hidden="true">
        <Ball3D />
      </div>

      {/* NAV — shared header with a glassmorphism "Build my profile" pill in
          place of the menu (opens the profile modal). */}
      <SiteHeader cta={{label: 'Build my profile →', onClick: openModal}} />

      {/* ===== CAP 01 · HERO ===== */}
      <section className={cx('hero')} id="hero">
        <div className={cx('hero-bg')} aria-hidden="true" />
        <div className={cx('stage')}>
          <div className={cx('chapter')}>The invisible player</div>
          <div className={cx('headline')}>
            <span className={cx('hl', 'hl1', 'reveal-line')}>
              <span>
                You can be <b>good</b>
              </span>
            </span>
            <span className={cx('hl', 'hl2', 'reveal-line')}>
              <span>and still</span>
            </span>
            <span className={cx('hl', 'hl3', 'anim', 'd4')}>never get seen.</span>
          </div>
          <div className={cx('undertext', 'anim', 'd5')}>
            <p className={cx('lead')}>
              Measured against the same standard a professional club uses.{' '}
              <b>Most do not meet it yet.</b>
            </p>
            <div className={cx('stats')}>
              <div className={cx('stat')}>
                <div className={cx('n')}>7/100</div>
                <div className={cx('l')}>past the filter</div>
              </div>
              <div className={cx('stat')}>
                <div className={cx('n')}>100+</div>
                <div className={cx('l')}>clubs in Europe</div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('cardcol', 'anim', 'd4')}>
          <div className={cx('pcard-outer')}>
            <div className={cx('pcard')}>
              <div className={cx('pcard-glow')}></div>
              <div className={cx('pcard-stadium')}></div>
              <div className={cx('pcard-wm')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/silueta_dos.png" alt="" aria-hidden="true" />
              </div>
              <div className={cx('pcard-wm-center')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" aria-hidden="true" />
              </div>
              <div className={cx('pcard-player')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/silueta_dos.png" alt="" aria-hidden="true" />
              </div>
              <div className={cx('pcard-shield')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo_2.png" alt="Clearway" />
              </div>
              <div className={cx('pcard-brand')}><span>CLEAR</span>WAY</div>
              <div className={cx('pcard-left')}>
                <div id="cPos" style={{display: 'none'}}></div><div className={cx('pcard-field')}><div className={cx('pcard-fld-bot')}></div><div className={cx('pcard-fld-circle')}></div><div className={cx('pcard-dot')} style={{top: '42%', left: '38%'}}></div></div>
              </div>
              <div className={cx('pcard-name-wrap')}>
                <input
                  type="text"
                  className={cx('pcard-name')}
                  id="cName"
                  value={card.name}
                  onChange={(e) =>
                    setCard((c) => ({...c, name: e.target.value}))
                  }
                  placeholder={
                    locale === 'es' ? 'Escribe tu nombre' : 'Write your name'
                  }
                  aria-label={locale === 'es' ? 'Tu nombre' : 'Your name'}
                />
              </div>
              <div className={cx('pcard-footer')}>
                <div className={cx('pcard-fc')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg><div className={cx('pcard-fc-lbl')}>EU PASS</div><div className={cx('pcard-fc-val')} id="cEu">{u(card.eu, '—')}</div></div>
                <div className={cx('pcard-fc')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><div className={cx('pcard-fc-lbl')}>AGE CAT</div><div className={cx('pcard-fc-val')} id="cAge">{u(card.age, '—')}</div></div>
                <div className={cx('pcard-fc')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg><div className={cx('pcard-fc-lbl')}>POSITION</div><div className={cx('pcard-fc-val')}></div></div>
              </div>
            </div>
          </div>
          <div className={cx('card-cta-wrap')}>
            <span className={cx('card-cta-halo')} aria-hidden="true" />
            <button
              type="button"
              className={cx('card-cta')}
              onClick={openModal}
              aria-label="This could be your card. Build it"
            >
              <span className={cx('card-cta-text')} aria-hidden="true">
                <span className={cx('card-cta-track')}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span className={cx('card-cta-item')} key={i}>
                      This could be your card. <b>Build it →</b>
                    </span>
                  ))}
                </span>
              </span>
            </button>
          </div>
          <div className={cx('card-note')}>
            Free to build · Players from Mexico and the world
          </div>
        </div>
        <div className={cx('scroll-cue', 'anim', 'd5')}>
          <span className={cx('bar')} />
          <span>The story begins</span>
        </div>
      </section>

      {/* ===== CAP 02 · TRUTH ===== */}
      <section className={cx('truth')} ref={truthRef}>
        <div className={cx('wrap')}>
          <div className={cx('truthLayout')}>
            <div className={cx('truthLeft')}>
              {/* Soft blue halo focused on the silhouette, fading in on hover. */}
              <div className={cx('truthGlow')} aria-hidden="true" />
              {/* Decorative silhouette centered behind the title. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={cx('truthSil')}
                src="/silueta_atras.png"
                alt=""
                aria-hidden="true"
              />
              <div className={cx('head', 'reveal')}>
                <h2 className={cx('disp')}>
                  The bit <span className={cx('it')}>others skip.</span>
                </h2>
              </div>
            </div>
            <div className={cx('tgrid')}>
              <div className={cx('tcard', 'reveal')} data-d="1">
                <h3>Your trial is real</h3>
                <p>
                  Some charge you to stand on a pitch and hope someone watches.{' '}
                  <strong>
                    Yours is with a club that already said they want to see you.
                  </strong>
                </p>
              </div>
              <div className={cx('tcard', 'reveal')} data-d="2">
                <h3>What it costs, plainly</h3>
                <p>
                  Building your profile is free.{' '}
                  <strong>The three month evaluation has a cost</strong>, written
                  into a Clearway contract. You cover your video and travel.
                </p>
              </div>
              <div className={cx('tcard', 'reveal')} data-d="3">
                <h3>What we promise</h3>
                <p>
                  We guarantee the <strong>trial, not the signing</strong>.
                  Nobody can promise a contract honestly. What we promise is the
                  door, and the work permit and GBE paperwork for England.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAP 04 · GUIDES ===== */}
      <section className={cx('guides')}>
        <div className={cx('wrap')}>
          <div className={cx('head', 'reveal')}>
            <h2 className={cx('disp')}>
              Not a <span className={cx('thin')}>form in a folder.</span>
              <br />
              <span className={cx('it')}>People who have done this.</span>
            </h2>
          </div>
          <div className={cx('team')}>
            <div className={cx('gcard', 'reveal')} data-d="1">
              <div className={cx('gphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/james.png" alt="James Fox" />
              </div>
              <div className={cx('gbody')}>
                <div className={cx('gname')}>
                  <span>James</span> Fox.
                </div>
                <div className={cx('grole')}>Founder and CEO</div>
                <p className={cx('gdesc')}>
                  FA-registered in Talent Identification, with access to 100+
                  clubs across England and Europe.
                </p>
              </div>
            </div>
            <div className={cx('gcard', 'reveal')} data-d="2">
              <div className={cx('gphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Cyril.png" alt="Cyril Rool" />
              </div>
              <div className={cx('gbody')}>
                <div className={cx('gname')}>
                  <span>Cyril</span> Rool.
                </div>
                <div className={cx('grole')}>Director of European Football</div>
                <p className={cx('gdesc')}>
                  Over 15 years in Ligue 1 with Lens, Bordeaux, Nice and
                  Marseille. France U21 international.
                </p>
              </div>
            </div>
            <div className={cx('gcard', 'reveal')} data-d="3">
              <div className={cx('gphoto')}>
                <span className={cx('gph')} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
                  </svg>
                </span>
              </div>
              <div className={cx('gbody')}>
                <div className={cx('gname')}>Tom.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAP 03 · FILTER ===== */}
      <section className={cx('filter')}>
        <div className={cx('wrap')}>
          <div className={cx('big', 'reveal')}>
            <svg className={cx('bigSvg')} viewBox="0 0 660 300" aria-hidden="true">
              <text x="330" y="226" textAnchor="middle" className={cx('bigText')}>
                7
                <tspan className={cx('bigSlash')} dx="-6">
                  /
                </tspan>
                <tspan dx="50">100</tspan>
              </text>
            </svg>
          </div>
          <h2 className={cx('disp', 'reveal')}>
            Seven of <span className={cx('thin')}>every hundred</span>{' '}
            <span className={cx('it')}>go through.</span>
          </h2>
          <p className={cx('reveal')}>
            That number is low on purpose. It is not us being difficult, it is us
            being honest about what professional football actually asks for. We
            would rather tell you the truth early than waste your summer.
          </p>
          <button
            type="button"
            className={cx('inline-cta', 'reveal')}
            onClick={openModal}
          >
            Think you are one of the seven? <b>Show us →</b>
          </button>
        </div>
      </section>

      {/* ===== RIBBON · scrolling clubs/countries band ===== */}
      <div className={cx('ribbon-band')}>
        <div className={cx('ribbon')} aria-hidden="true">
          <div className={cx('ribbon-track')}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span className={cx('ribbon-item')} key={i}>
                {RIBBON_TEXT}
                <span className={cx('ribbon-dot')}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CAP 05 · VOICES ===== */}
      <section className={cx('voices')} ref={voicesRef}>
        <div className={cx('wrap')}>
          <div className={cx('head', 'reveal')}>
            <h2 className={cx('disp')}>
              Real voices. <span className={cx('it')}>Real pathways.</span>
            </h2>
            <p>From families already on the journey. No names, that is the point.</p>
          </div>
        </div>
        <div className={cx('vmarquee')}>
          <div className={cx('vrow', 'r1')}>
            {VOICES_R1.concat(VOICES_R1).map((v, i) => (
              <div className={cx('vcard')} key={`r1-${i}`}>
                <p>{v.quote}</p>
                <span className={cx('who')}>{v.who}</span>
              </div>
            ))}
          </div>
          <div className={cx('vrow', 'r2')}>
            {VOICES_R2.concat(VOICES_R2).map((v, i) => (
              <div className={cx('vcard')} key={`r2-${i}`}>
                <p>{v.quote}</p>
                <span className={cx('who')}>{v.who}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAP 06 · CLOSE ===== */}
      <section className={cx('close')}>
        <div className={cx('wrap')}>
          <h2 className={cx('disp', 'reveal')}>
            From invisible <span className={cx('it')}>to seen.</span>
          </h2>
          <p className={cx('reveal')}>
            Build your profile. If it fits, you will hear from the Clearway team.
            If it does not, you will hear that too. Either way, no guessing.
          </p>
          <button type="button" className={cx('cta', 'reveal')} onClick={openModal}>
            Build my profile <span>→</span>
          </button>
        </div>
        <div className={cx('crowd-close')} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/publico.png?v=1782294646" alt="" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className={cx('foot')}>
        <div className={cx('foot-ball')} aria-hidden="true">
          <Ball3D />
        </div>
        <div className={cx('wrap')}>
          <div className={cx('foot-top')}>
            <Link href="/" aria-label="Clearway — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={cx('foot-logo')}
                src="/Logotipos/clearway-white.svg"
                alt="Clearway"
              />
            </Link>
            <nav className={cx('foot-nav')}>
              <div className={cx('foot-col')}>
                <Link href="/for-clubs">For Clubs</Link>
                <Link href="/for-players">For Players</Link>
                <Link href="/">About Clearway</Link>
              </div>
              <div className={cx('foot-col')}>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms &amp; Conditions</Link>
              </div>
            </nav>
          </div>
          <div className={cx('foot-bot')}>
            <span>© 2026 Clearway Performance Group</span>
            <span>Created by SCNDAL</span>
          </div>
        </div>
      </footer>

      {/* ===== MODAL · application form ===== */}
      <div
        className={cx('modal', modalOpen && 'open')}
        role="dialog"
        aria-modal="true"
        aria-hidden={!modalOpen}
      >
        <div className={cx('modal-bg')} onClick={closeModal}>
          <canvas className={cx('tactics')} ref={canvasRef} />
        </div>
        <div className={cx('modal-card')} ref={modalCardRef}>
          <div className={cx('modal-head')}>
            <div className={cx('row')}>
              <div>
                <div className={cx('kick')}>Player application · Clearway</div>
                <div className={cx('t')}>Build your player profile</div>
              </div>
              <button
                type="button"
                className={cx('x')}
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className={cx('sub')}>{stepLabel}</div>
            <div className={cx('mprogress')}>
              {[0, 1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={cx('mpdot', (submitted || n <= step) && 'on')}
                />
              ))}
            </div>
          </div>

          <div className={cx('modal-body')}>
            <div ref={formRef} style={{display: submitted ? 'none' : 'block'}}>
              {/* STEP 1 */}
              <div className={cx('mstep', step === 0 && 'active')}>
                <div className={cx('mstepn')}>The essentials</div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>
                      Main position <span className={cx('req')}>*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      placeholder="e.g. Striker, Centre back"
                      className={errCls('position')}
                      onChange={(e) => setCard((c) => ({...c, pos: e.target.value}))}
                    />
                  </div>
                  <div className={cx('mf')}>
                    <label>
                      Age category <span className={cx('req')}>*</span>
                    </label>
                    <input
                      type="text"
                      name="age_category"
                      placeholder="U17, U20, senior"
                      className={errCls('age_category')}
                      onChange={(e) => setCard((c) => ({...c, age: e.target.value}))}
                    />
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>
                    Do you hold a European or EU passport?{' '}
                    <span className={cx('req')}>*</span>
                  </label>
                  <div className={cx('mseg', errors.has('eu_passport') && 'err')}>
                    {['Yes', 'No', 'In process'].map((v) => (
                      <label key={v}>
                        <input
                          type="radio"
                          name="eu_passport"
                          value={v}
                          onChange={() => setCard((c) => ({...c, eu: v}))}
                        />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                  <div className={cx('hint')}>
                    This changes how we place you. There is a pathway either way.
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>
                    Sporting nationality <span className={cx('req')}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sporting_nationality"
                    placeholder="e.g. Mexican, Spanish, dual"
                    className={errCls('sporting_nationality')}
                  />
                </div>
              </div>

              {/* STEP 2 */}
              <div className={cx('mstep', step === 1 && 'active')}>
                <div className={cx('mstepn')}>Who you are</div>
                <div className={cx('mf')}>
                  <label>
                    Full name <span className={cx('req')}>*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    className={errCls('full_name')}
                    onChange={(e) => setCard((c) => ({...c, name: e.target.value}))}
                  />
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>
                      Date of birth <span className={cx('req')}>*</span>
                    </label>
                    <input
                      type="text"
                      name="dob"
                      placeholder="DD/MM/YYYY"
                      className={errCls('dob')}
                    />
                  </div>
                  <div className={cx('mf')}>
                    <label>
                      Current country <span className={cx('req')}>*</span>
                    </label>
                    <input type="text" name="country" className={errCls('country')} />
                  </div>
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>
                      Email <span className={cx('req')}>*</span>
                    </label>
                    <input type="email" name="email" className={errCls('email')} />
                  </div>
                  <div className={cx('mf')}>
                    <label>WhatsApp</label>
                    <input type="text" name="whatsapp" />
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>
                    Do you currently have a representative or agent?{' '}
                    <span className={cx('req')}>*</span>
                  </label>
                  <div className={cx('mseg', errors.has('has_representative') && 'err')}>
                    {['Yes', 'No'].map((v) => (
                      <label key={v}>
                        <input type="radio" name="has_representative" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className={cx('mstep', step === 2 && 'active')}>
                <div className={cx('mstepn')}>Your game</div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>Secondary position</label>
                    <input type="text" name="secondary_position" />
                  </div>
                  <div className={cx('mf')}>
                    <label>Strong foot</label>
                    <input type="text" name="strong_foot" placeholder="Left / Right / Both" />
                  </div>
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>Height (cm)</label>
                    <input type="text" name="height_cm" />
                  </div>
                  <div className={cx('mf')}>
                    <label>Weight (kg)</label>
                    <input type="text" name="weight_kg" />
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              <div className={cx('mstep', step === 3 && 'active')}>
                <div className={cx('mstepn')}>Your record</div>
                <div className={cx('mf')}>
                  <label>Current club and league</label>
                  <input type="text" name="current_club" />
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>Previous clubs</label>
                    <input type="text" name="previous_clubs" />
                  </div>
                  <div className={cx('mf')}>
                    <label>Level</label>
                    <input type="text" name="level" placeholder="Amateur / Semipro / Pro" />
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>This season (games, goals, assists)</label>
                  <input type="text" name="season_stats" />
                </div>
              </div>

              {/* STEP 5 */}
              <div className={cx('mstep', step === 4 && 'active')}>
                <div className={cx('mstepn')}>Your footage</div>
                <div className={cx('mf')}>
                  <label>
                    Video links (YouTube, Vimeo or Drive){' '}
                    <span className={cx('req')}>*</span>
                  </label>
                  <input
                    type="text"
                    name="video_links"
                    placeholder="Paste one or more, separated by commas"
                    className={errCls('video_links')}
                  />
                  <div className={cx('hint')}>
                    The more match footage the better. This is what matters most.
                  </div>
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>Instagram</label>
                    <input type="text" name="instagram" />
                  </div>
                  <div className={cx('mf')}>
                    <label>Coach reference and contact</label>
                    <input type="text" name="coach_reference" />
                  </div>
                </div>
                <div className={cx('mconsent')}>
                  <label>
                    <input type="checkbox" name="consent_terms" id="mPriv" />
                    <span>
                      I accept the{' '}
                      <Link href="/privacy" target="_blank">
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link href="/terms" target="_blank">
                        Terms
                      </Link>
                      . <span className={cx('req')}>*</span>
                    </span>
                  </label>
                  <label>
                    <input type="checkbox" name="consent_age" id="mAge" />
                    <span>
                      I am over 18, or a parent or guardian authorises this
                      application and will be the contact.{' '}
                      <span className={cx('req')}>*</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* success */}
            <div className={cx('msuccess', submitted && 'show')}>
              <div className={cx('chk')}>✓</div>
              <h3>That is your profile.</h3>
              <p>
                This is what the Clearway team sees. If it fits what a club is
                looking for, they get in touch themselves.
              </p>
            </div>

            {!submitted && (
              <div className={cx('modal-foot')}>
                <button
                  type="button"
                  className={cx('mbtn', 'mbtn-ghost')}
                  onClick={onBack}
                  style={{visibility: step === 0 ? 'hidden' : 'visible'}}
                >
                  Back
                </button>
                <button type="button" className={cx('mbtn', 'mbtn-solid')} onClick={onNext}>
                  {step === STEP_NAMES.length - 1 ? 'Send to Clearway →' : 'Next →'}
                </button>
              </div>
            )}
            <div className={cx('mfoot-note')}>
              Building your profile is free. The three month evaluation has a cost,
              set out in the Clearway contract. <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VOICES_R1 = [
  {
    quote:
      '"Your professionalism at every stage has been incredible. We already feel Clearway, and your son, as if JP were with his family from England."',
    who: 'Parent of a player'
  },
  {
    quote:
      '"It is always very professional, clear and exciting getting news from you."',
    who: 'Parent of a player'
  },
  {
    quote: '"Thank you for this initiative. It is really motivating us."',
    who: 'Parent of a player'
  },
  {
    quote:
      '"I had not realised you would be there in person on the first day. That is truly priceless."',
    who: 'Parent of a player'
  },
  {
    quote:
      '"Sounds amazing. We are very excited to train in a new environment. Thank you."',
    who: 'Player'
  }
];

const VOICES_R2 = [
  {
    quote:
      '"Everything has been a wonderful experience so far, and it is great that you will be there during those days."',
    who: "A player's mum"
  },
  {
    quote:
      '"Thank you for your support. This will be a great summer experience for us."',
    who: 'Parent of a player'
  },
  {
    quote:
      '"Reading your messages is highly motivating. We will follow your recommendations with absolute discipline."',
    who: 'Parent of a player'
  },
  {quote: '"We feel very fortunate to have you."', who: 'Parent of a player'},
  {quote: '"When I grow up, I want to be like you."', who: 'Parent of a player'}
];
