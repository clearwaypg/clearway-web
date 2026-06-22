'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

import {Link} from '@/i18n/navigation';
import {Ball3D} from './Ball3D';
import styles from './ForClubs.module.css';

/* =========================================================
   FOR CLUBS — Clearway Performance Group
   Faithful port of the clubs-clearway design guide.
   Brand tokens scoped to .page; fonts come from next/font
   (Archivo display + EB Garamond italic) via the page wrapper.
   ========================================================= */

/* Join scoped module classes by their guide names, dropping falsy values. */
const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

/* Turn **bold** markers into <strong> for the credit lines. */
function rich(s: string) {
  return s
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

const PEOPLE = {
  james: {
    role: 'Founder and CEO',
    creds: [
      'Over **30 years** in professional sport, as athlete, coach and manager.',
      'Alongside **Olympic gold medallists, Wimbledon champions, world number ones and EFL footballers.**',
      '**Registered with The Football Association in Talent Identification.**',
      '**100+ clubs** across England and Europe. FIFA licensed agents available. Men and women.',
      '**Work permit and GBE for England**, handled in full.'
    ]
  },
  cyril: {
    role: 'Director of European Football',
    creds: [
      'Over **15 years in Ligue 1** with RC Lens, Bordeaux, OGC Nice and Olympique de Marseille.',
      '**France Under 21 international.**',
      'Has represented and placed players across **Europe and Mexico.**'
    ]
  }
};

const TIMELINE_OPTIONS = ['This window', 'Next window', 'Just exploring'];
const TOTAL = 5;

type EnqData = {
  club: string;
  region: string;
  profile: string;
  timeline: string;
  name: string;
  email: string;
};
const EMPTY_DATA: EnqData = {
  club: '',
  region: '',
  profile: '',
  timeline: '',
  name: '',
  email: ''
};

export function ForClubs() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrollBallRef = useRef<HTMLDivElement>(null);
  const sBallCanvasRef = useRef<HTMLCanvasElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const enqCanvasRef = useRef<HTMLCanvasElement>(null);
  const enqBodyRef = useRef<HTMLDivElement>(null);

  /* ----- Enquiry modal state ----- */
  const [enqOpen, setEnqOpen] = useState(false);
  const [cur, setCur] = useState(0); // 0..4 steps, 5 = done
  const [leaving, setLeaving] = useState<number | null>(null);
  const [data, setData] = useState<EnqData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const openEnq = useCallback(() => {
    setCur(0);
    setLeaving(null);
    setData(EMPTY_DATA);
    setErrors({});
    setFlagged(new Set());
    setEnqOpen(true);
  }, []);

  const closeEnq = useCallback(() => setEnqOpen(false), []);

  // Slide the current step out, then swap to the next after the transition.
  function goTo(n: number) {
    setLeaving(cur);
    window.setTimeout(() => {
      setCur(n);
      setLeaving(null);
    }, 180);
  }

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!enqOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [enqOpen]);

  // Esc closes the modal.
  useEffect(() => {
    if (!enqOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeEnq();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enqOpen, closeEnq]);

  // Focus the first input of the active step.
  useEffect(() => {
    if (!enqOpen || cur >= TOTAL) return;
    const id = window.setTimeout(() => {
      const input = enqBodyRef.current?.querySelector<HTMLInputElement>(
        `.${styles.enqStep}.${styles.active} .${styles.enqInput}`
      );
      input?.focus();
    }, 320);
    return () => window.clearTimeout(id);
  }, [cur, enqOpen]);

  function setField(name: keyof EnqData, value: string) {
    setData((d) => ({...d, [name]: value}));
    if (flagged.has(name)) {
      setFlagged((f) => {
        const next = new Set(f);
        next.delete(name);
        return next;
      });
    }
  }

  function selectTimeline(value: string) {
    setData((d) => ({...d, timeline: value}));
    setErrors((e) => ({...e, timeline: false}));
  }

  function validateAndNext() {
    const next: Record<string, boolean> = {};
    const flag = new Set<string>();
    if (cur === 0 && !data.club.trim()) {
      next.club = true;
      flag.add('club');
    } else if (cur === 1 && !data.region.trim()) {
      next.region = true;
      flag.add('region');
    } else if (cur === 3 && !data.timeline) {
      next.timeline = true;
    } else if (cur === 4) {
      const okName = data.name.trim().length > 0;
      const okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email.trim());
      if (!okName || !okEmail) {
        next.contact = true;
        if (!okName) flag.add('name');
        if (!okEmail) flag.add('email');
      }
    }
    if (Object.keys(next).length) {
      setErrors(next);
      setFlagged(flag);
      return;
    }
    setErrors({});
    goTo(cur === TOTAL - 1 ? TOTAL : cur + 1);
  }

  function onEnqKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && cur < TOTAL) {
      e.preventDefault();
      validateAndNext();
    }
  }

  const stepCls = (i: number) =>
    cx(
      'enqStep',
      i === leaving && 'active',
      i === leaving && 'leaving',
      leaving === null && i === cur && 'active'
    );

  /* ===== HERO: scroll through the 200vh fades the intro out and the pills in,
     while the ball stays put. ===== */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const intro = introRef.current;
    const eyebrow = eyebrowRef.current;
    const hint = hintRef.current;
    const sats = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(`.${styles.hstat}`) ?? []
    );
    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    function apply() {
      const rect = hero!.getBoundingClientRect();
      const total = hero!.offsetHeight - window.innerHeight;
      // Mobile / no sticky room: show everything, no scroll transition.
      if (total <= 0) {
        [intro, eyebrow, hint].forEach((el) => {
          if (!el) return;
          el.style.opacity = '';
          el.style.transform = '';
          el.style.pointerEvents = '';
        });
        sats.forEach((s) => s.classList.add(styles.show));
        return;
      }
      const p = clamp(-rect.top / total);
      const out = clamp(p / 0.42); // intro fully gone by ~42% of the scroll

      if (intro) {
        if (out <= 0) {
          intro.style.opacity = '';
          intro.style.transform = '';
          intro.style.pointerEvents = '';
        } else {
          intro.style.opacity = String(1 - out);
          intro.style.transform = `translateY(${-out * 56}px)`;
          intro.style.pointerEvents = out > 0.5 ? 'none' : 'auto';
        }
      }
      if (eyebrow) {
        if (out <= 0) {
          eyebrow.style.opacity = '';
          eyebrow.style.transform = '';
        } else {
          eyebrow.style.opacity = String(1 - out);
          eyebrow.style.transform = `translateY(${-out * 34}px)`;
        }
      }
      if (hint) hint.style.opacity = out <= 0 ? '' : String(1 - clamp(p / 0.12));

      sats.forEach((s, i) => {
        const trigger = 0.16 + i * 0.1;
        s.classList.toggle(styles.show, p >= trigger);
      });
    }

    apply();
    window.addEventListener('scroll', apply, {passive: true});
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);

  /* ===== Scroll-follower ball that ping-pongs across the mid sections ===== */
  useEffect(() => {
    const ball = scrollBallRef.current;
    const canvas = sBallCanvasRef.current;
    if (!ball || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 70 * dpr;
    canvas.height = 70 * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let rot = 0;
    function drawSmallBall(r: number) {
      ctx!.clearRect(0, 0, 70, 70);
      const cx2 = 35;
      const cy = 35;
      const rad = 28;
      const g = ctx!.createRadialGradient(cx2 - 8, cy - 9, 3, cx2, cy, rad * 1.1);
      g.addColorStop(0, '#fff');
      g.addColorStop(0.65, '#eef1f6');
      g.addColorStop(1, '#c2cad8');
      ctx!.beginPath();
      ctx!.arc(cx2, cy, rad, 0, 6.28);
      ctx!.fillStyle = g;
      ctx!.fill();
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx2, cy, rad, 0, 6.28);
      ctx!.clip();
      const off = (r % 1) * rad * 2.2;
      for (let b = -1; b <= 1; b++) {
        const by = cy + b * rad * 0.62;
        for (let k = -2; k <= 2; k++) {
          let px = cx2 + k * rad * 0.62 - off + b * rad * 0.31;
          while (px > cx2 + rad * 1.3) px -= rad * 2.6;
          while (px < cx2 - rad * 1.3) px += rad * 2.6;
          const depth = 1 - Math.abs(px - cx2) / (rad * 1.3);
          const sz = rad * 0.16 * (0.5 + depth * 0.6);
          ctx!.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = r * 2 + b + (i * 6.28) / 5 - Math.PI / 2;
            const x = px + Math.cos(a) * sz;
            const y = by + Math.sin(a) * sz;
            if (i === 0) ctx!.moveTo(x, y);
            else ctx!.lineTo(x, y);
          }
          ctx!.closePath();
          ctx!.fillStyle = '#0a2a5e';
          ctx!.fill();
        }
      }
      ctx!.restore();
      const sh = ctx!.createRadialGradient(cx2 - 8, cy - 9, 3, cx2, cy, rad * 1.05);
      sh.addColorStop(0, 'rgba(255,255,255,0.3)');
      sh.addColorStop(0.5, 'rgba(255,255,255,0)');
      sh.addColorStop(1, 'rgba(7,26,58,0.4)');
      ctx!.beginPath();
      ctx!.arc(cx2, cy, rad, 0, 6.28);
      ctx!.fillStyle = sh;
      ctx!.fill();
    }
    function sections() {
      const cost = rootRef.current?.querySelector<HTMLElement>(`.${styles.cost}`);
      const people = rootRef.current?.querySelector<HTMLElement>(
        `.${styles.people}`
      );
      if (!cost || !people) return null;
      const top = cost.getBoundingClientRect().top + window.scrollY;
      const bottom = people.getBoundingClientRect().bottom + window.scrollY;
      return {top, bottom};
    }
    function onScroll() {
      const s = sections();
      if (!s) return;
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;
      const sectionStart = s.top - viewH * 0.2;
      const sectionEnd = s.bottom - viewH * 0.8;
      if (scrollY < sectionStart || scrollY > sectionEnd) {
        ball!.classList.remove(styles.visible);
        return;
      }
      ball!.classList.add(styles.visible);
      const p = (scrollY - sectionStart) / (sectionEnd - sectionStart);
      const clampedP = Math.max(0, Math.min(1, p));
      const cycles = 4;
      const cp = (clampedP * cycles) % 1;
      const isEven = Math.floor(clampedP * cycles) % 2 === 0;
      const xFrac = isEven ? cp : 1 - cp;
      const margin = 50;
      const bw = 70;
      const x = margin + xFrac * (window.innerWidth - margin * 2 - bw);
      const y = viewH * 0.5 + Math.sin(clampedP * cycles * Math.PI * 2) * 40;
      ball!.style.left = x + 'px';
      ball!.style.top = y + 'px';
      rot += 0.04;
      drawSmallBall(rot);
    }
    drawSmallBall(0);
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* ===== Map: continent silhouettes + animated route MX <-> UK ===== */
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0;
    let H = 0;
    let raf = 0;
    let t = 0;
    let started = false;
    const MX = {x: 0.21, y: 0.62};
    const UK = {x: 0.74, y: 0.34};
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const america = [
      [0.05, 0.08], [0.1, 0.05], [0.16, 0.06], [0.22, 0.04], [0.28, 0.08],
      [0.3, 0.14], [0.26, 0.18], [0.28, 0.24], [0.24, 0.3], [0.2, 0.36],
      [0.18, 0.42], [0.2, 0.5], [0.16, 0.56], [0.14, 0.64], [0.12, 0.72],
      [0.1, 0.78], [0.13, 0.84], [0.17, 0.88], [0.14, 0.92], [0.1, 0.9],
      [0.07, 0.85], [0.05, 0.75], [0.03, 0.62], [0.02, 0.48], [0.03, 0.36],
      [0.02, 0.22], [0.04, 0.14], [0.05, 0.08]
    ];
    const europa = [
      [0.6, 0.12], [0.65, 0.1], [0.72, 0.08], [0.78, 0.1], [0.84, 0.08],
      [0.88, 0.12], [0.9, 0.18], [0.86, 0.22], [0.88, 0.28], [0.84, 0.34],
      [0.8, 0.38], [0.82, 0.44], [0.8, 0.52], [0.76, 0.6], [0.72, 0.68],
      [0.68, 0.78], [0.66, 0.86], [0.7, 0.92], [0.66, 0.95], [0.62, 0.92],
      [0.6, 0.84], [0.58, 0.72], [0.6, 0.62], [0.64, 0.54], [0.62, 0.46],
      [0.6, 0.38], [0.58, 0.3], [0.6, 0.22], [0.58, 0.16], [0.6, 0.12]
    ];
    function drawContinent(pts: number[][], col: string, fillOpacity: number) {
      if (!pts.length) return;
      ctx!.beginPath();
      ctx!.moveTo(pts[0][0] * W, pts[0][1] * H);
      for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i][0] * W, pts[i][1] * H);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${col},${fillOpacity})`;
      ctx!.fill();
      ctx!.strokeStyle = `rgba(${col},0.45)`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
    }
    function arcPoint(p: number) {
      const cx2 = (MX.x + UK.x) / 2;
      const cy = Math.min(MX.y, UK.y) - 0.28;
      const mt = 1 - p;
      return {
        x: (mt * mt * MX.x + 2 * mt * p * cx2 + p * p * UK.x) * W,
        y: (mt * mt * MX.y + 2 * mt * p * cy + p * p * UK.y) * H
      };
    }
    function loop() {
      ctx!.clearRect(0, 0, W, H);
      t += 0.006;
      drawContinent(america, '15,52,104', 0.25);
      drawContinent(europa, '15,52,104', 0.25);
      ctx!.beginPath();
      for (let p = 0; p <= 1; p += 0.02) {
        const pt = arcPoint(p);
        if (p === 0) ctx!.moveTo(pt.x, pt.y);
        else ctx!.lineTo(pt.x, pt.y);
      }
      ctx!.strokeStyle = 'rgba(208,216,226,0.2)';
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      for (let k = 0; k < 3; k++) {
        const p = (t + k / 3) % 1;
        const pt = arcPoint(p);
        for (let s = 0; s < 6; s++) {
          const ps = Math.max(0, p - s * 0.018);
          const sp = arcPoint(ps);
          ctx!.beginPath();
          ctx!.arc(sp.x, sp.y, 3 - s * 0.4, 0, 6.28);
          ctx!.fillStyle = `rgba(208,216,226,${0.5 - s * 0.08})`;
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.arc(pt.x, pt.y, 3.5, 0, 6.28);
        ctx!.fillStyle = '#fff';
        ctx!.shadowColor = 'rgba(208,216,226,0.9)';
        ctx!.shadowBlur = 12;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    }
    const mio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            resize();
            loop();
          }
        }),
      {threshold: 0.2}
    );
    mio.observe(canvas);
    function onResize() {
      if (started) resize();
    }
    window.addEventListener('resize', onResize);
    return () => {
      mio.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* ===== Scroll reveals ===== */
  useEffect(() => {
    const root = rootRef.current;
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

  /* ===== Enquiry modal background: living tactical pitch ===== */
  useEffect(() => {
    if (!enqOpen) return;
    const canvas = enqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let W = 0;
    let H = 0;
    type Pl = {x: number; y: number; hx: number; hy: number; ph: number};
    let players: Pl[] = [];
    let ball = {x: 0, y: 0, vx: 0, vy: 0, holder: 0, target: 0, cool: 30, trav: false};
    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    function seed() {
      const form = [
        [0.2, 0.3], [0.2, 0.7], [0.4, 0.5], [0.6, 0.25], [0.6, 0.75], [0.8, 0.5]
      ];
      players = form.map(([x, y]) => ({
        x: x * W,
        y: y * H,
        hx: x,
        hy: y,
        ph: Math.random() * 6.28
      }));
      ball = {
        x: players[0].x,
        y: players[0].y,
        vx: 0,
        vy: 0,
        holder: 0,
        target: 0,
        cool: 30,
        trav: false
      };
    }
    function pass() {
      let to = ball.holder;
      while (to === ball.holder) to = Math.floor(Math.random() * players.length);
      ball.target = to;
      ball.trav = true;
      const tp = players[to];
      const dx = tp.x - ball.x;
      const dy = tp.y - ball.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = Math.min(14, 7 + d * 0.02);
      ball.vx = (dx / d) * sp;
      ball.vy = (dy / d) * sp;
    }
    function loop() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.strokeStyle = 'rgba(208,216,226,0.04)';
      ctx!.lineWidth = 1;
      ctx!.strokeRect(W * 0.05, H * 0.08, W * 0.9, H * 0.84);
      ctx!.beginPath();
      ctx!.moveTo(W * 0.5, H * 0.08);
      ctx!.lineTo(W * 0.5, H * 0.92);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(W * 0.5, H * 0.5, Math.min(W, H) * 0.12, 0, 6.28);
      ctx!.stroke();
      for (const p of players) {
        p.ph += 0.01;
        const tx = p.hx * W + Math.cos(p.ph) * 16;
        const ty = p.hy * H + Math.sin(p.ph * 0.8) * 16;
        p.x += (tx - p.x) * 0.04;
        p.y += (ty - p.y) * 0.04;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 4, 0, 6.28);
        ctx!.fillStyle = 'rgba(208,216,226,0.3)';
        ctx!.fill();
      }
      if (ball.trav) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        const tp = players[ball.target];
        if (Math.hypot(tp.x - ball.x, tp.y - ball.y) < 10) {
          ball.trav = false;
          ball.holder = ball.target;
          ball.cool = 30;
        }
      } else {
        const h = players[ball.holder];
        ball.x = h.x;
        ball.y = h.y;
        if (--ball.cool <= 0) pass();
      }
      ctx!.beginPath();
      ctx!.arc(ball.x, ball.y, 5, 0, 6.28);
      ctx!.fillStyle = 'rgba(208,216,226,0.7)';
      ctx!.fill();
      raf = requestAnimationFrame(loop);
    }
    resize();
    seed();
    loop();
    function onResize() {
      resize();
      seed();
    }
    window.addEventListener('resize', onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [enqOpen]);

  const progressPct =
    cur >= TOTAL ? 100 : (Math.min(cur + 1, TOTAL) / TOTAL) * 100;
  const stepLabel = cur >= TOTAL ? 'Done' : `Step ${Math.min(cur + 1, TOTAL)} of ${TOTAL}`;

  return (
    <div ref={rootRef} className={cx('page')}>
      {/* film grain */}
      <div className={cx('grain')} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="clubs-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} />
          </filter>
          <rect width="100%" height="100%" filter="url(#clubs-grain)" />
        </svg>
      </div>

      {/* NAV */}
      <nav className={cx('nav')}>
        <Link href="/" className={cx('logo')} aria-label="Clearway Performance Group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logotipos/clearway-white.svg" alt="Clearway Performance Group" />
        </Link>
        <div className={cx('links')}>
          <Link href="/for-clubs">For Clubs</Link>
          <Link href="/for-players">For Players</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className={cx('hero')} id="hero">
        <div className={cx('heroSticky')}>
          <div className={cx('heroGlow')} aria-hidden />
          <div ref={eyebrowRef} className={cx('eyebrow', 'heroEyebrow')}>
            For clubs · England and Europe · Est. 2023
          </div>
          <div className={cx('heroBallZone')}>
            <div className={cx('ball')}>
              <Ball3D />
            </div>
          </div>
          <div className={cx('heroStage')}>
            {/* Intro copy — fades up and out as you scroll */}
            <div ref={introRef} className={cx('heroIntro')}>
              <h1 className={cx('heroTitle')}>
                <span className={cx('thin')}>We send you the signal.</span>{' '}
                <b>Not the noise.</b>
              </h1>
              <p className={cx('heroSub')}>
                Every player already filtered, watched and cleared. You only meet
                the ones ready to walk onto your pitch.
              </p>
              <button
                type="button"
                className={cx('hbtn', 'hbtnSolid', 'heroCtaBtn')}
                onClick={openEnq}
              >
                Start your search <span className={cx('arr')}>→</span>
              </button>
            </div>
            {/* Stat pills — fade in (staggered) as the intro leaves */}
            <div className={cx('heroStats')}>
              <div className={cx('hstat')}>
                <b>100<span>+</span></b> Clubs in England and Europe
              </div>
              <div className={cx('hstat')}>
                <b>7<span>%</span></b> Make it past the filter
              </div>
              <div className={cx('hstat')}>
                <b>66</b> Countries scouted
              </div>
              <div className={cx('hstat')}>
                <b>30</b> Years in the game
              </div>
              <div className={cx('hstat')}>
                <span className={cx('ic')}>✓</span> Work permit and GBE handled
              </div>
              <div className={cx('hstat')}>
                <span className={cx('ic')}>◎</span> Trial guaranteed, not the signing
              </div>
            </div>
          </div>
          <div ref={hintRef} className={cx('scrollhint')}>
            Scroll <span>↓</span>
          </div>
        </div>
      </section>

      {/* SCROLL-FOLLOWER BALL */}
      <div ref={scrollBallRef} className={cx('scrollBall')} aria-hidden>
        <canvas ref={sBallCanvasRef} width={80} height={80} />
      </div>

      {/* THE COST */}
      <section className={cx('cost')}>
        <div className={cx('wrap')}>
          <div className={cx('costHead', 'reveal')}>
            <div className={cx('eyebrow')}>The cost of the old way</div>
            <h2>
              <span className={cx('thin')}>93 trials</span>
              <br />
              <b>nobody needed.</b>
            </h2>
          </div>
          <div className={cx('costList')}>
            <div className={cx('costRow', 'reveal')} data-d="1">
              <div className={cx('costBig')}>£££</div>
              <div className={cx('costTxt')}>
                <h3>Wasted trials</h3>
                <p>
                  Flights, hotels and staff time spent on players who were never
                  close to your level.
                </p>
              </div>
            </div>
            <div className={cx('costRow', 'reveal')} data-d="2">
              <div className={cx('costBig')}>??</div>
              <div className={cx('costTxt')}>
                <h3>No eyes on the ground</h3>
                <p>
                  Decisions made on edited highlight reels, with no one who has
                  watched the player live.
                </p>
              </div>
            </div>
            <div className={cx('costRow', 'reveal')} data-d="3">
              <div className={cx('costBig')}>⛔</div>
              <div className={cx('costTxt')}>
                <h3>The paperwork wall</h3>
                <p>
                  Work permits and GBE points that sink a signing months after you
                  committed to it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OLD VS CLEARWAY */}
      <section className={cx('versus')} id="how">
        <div className={cx('wrap')}>
          <div className={cx('versusHead', 'reveal')}>
            <div className={cx('eyebrow')}>What you actually get</div>
            <h2>
              <span className={cx('thin')}>The old way</span>{' '}
              <b>gets a red card.</b>
            </h2>
          </div>
          <div className={cx('cardsBoard', 'reveal')} data-d="1">
            <div className={cx('refCard', 'refRed')}>
              <div className={cx('refCardTop')}>
                <span className={cx('refTag')}>The old way</span>
                <span className={cx('refMark')}>✕</span>
              </div>
              <ul>
                <li>Hundreds of unfiltered CVs and reels</li>
                <li>Trials booked on a hunch</li>
                <li>No one watching live</li>
                <li>Paperwork discovered too late</li>
                <li>You carry all the risk</li>
              </ul>
              <div className={cx('refFoot')}>Off the pitch</div>
            </div>
            <div className={cx('refCard', 'refGreen')}>
              <div className={cx('refCardTop')}>
                <span className={cx('refTag')}>The Clearway way</span>
                <span className={cx('refMark')}>✓</span>
              </div>
              <ul>
                <li>Only the 7% that clear the filter</li>
                <li>Three months of real evaluation first</li>
                <li>Watched in person, on the ground</li>
                <li>Work permit and GBE cleared up front</li>
                <li>The trial is guaranteed, the signing is earned</li>
              </ul>
              <div className={cx('refFoot')}>Cleared to play</div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO PATHWAYS */}
      <section className={cx('aud')}>
        <div className={cx('wrap')}>
          <div className={cx('head', 'reveal')}>
            <div className={cx('eyebrow')}>Two ways we work with clubs</div>
            <h2>
              <span className={cx('thin')}>One network.</span> <b>Two pathways.</b>
            </h2>
          </div>
          <div className={cx('mapStage', 'reveal')} data-d="1">
            <canvas ref={mapCanvasRef} className={cx('mapCanvas')} aria-hidden />
            <div className={cx('mapNode', 'mapNodeUk')}>
              <span className={cx('mnDot')} />
              <span className={cx('mnLabel')}>England and Europe</span>
            </div>
            <div className={cx('mapNode', 'mapNodeMx')}>
              <span className={cx('mnDot')} />
              <span className={cx('mnLabel')}>Mexico and Texas</span>
            </div>
          </div>
          <div className={cx('mapCards')}>
            <div className={cx('mapCard', 'reveal')} data-d="1">
              <div className={cx('mcTop')}>
                <span className={cx('mcNum')}>01</span>
                <span className={cx('mcTag')}>Clubs in the UK and Europe</span>
              </div>
              <h3>
                <span className={cx('thin')}>Recruitment you can</span>{' '}
                <b>actually trust.</b>
              </h3>
              <p>
                Fully filtered talent, watched in person, ready to trial. We do the
                first 93 rejections so your staff only meet the seven.
              </p>
              <ul className={cx('pts')}>
                <li>Players measured against your level before they reach you</li>
                <li>Eyes on the ground, not just highlight reels</li>
                <li>Work permit and GBE handled end to end</li>
              </ul>
            </div>
            <div className={cx('mapCard', 'reveal')} data-d="2">
              <div className={cx('mcTop')}>
                <span className={cx('mcNum')}>02</span>
                <span className={cx('mcTag')}>Clubs in Mexico and Texas</span>
              </div>
              <h3>
                <span className={cx('thin')}>Your door into</span>{' '}
                <b>European football.</b>
              </h3>
              <p>
                A direct bridge to clubs across England and Europe, and the
                partnerships that come with being inside the network rather than
                outside it.
              </p>
              <ul className={cx('pts')}>
                <li>A real pathway for your players into Europe</li>
                <li>Partnerships with clubs already in the network</li>
                <li>The same filter, working in your favour</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE PEOPLE */}
      <section className={cx('people')}>
        <div className={cx('wrap')}>
          <div className={cx('peopleHead', 'reveal')}>
            <div className={cx('eyebrow')}>The people behind it</div>
            <h2>
              <span className={cx('thin')}>Clearway is not a directory.</span>
              <br />
              <b>It is two careers.</b>
            </h2>
            <p className={cx('lede')}>
              When they put a player in front of you, it carries their name. That is
              the whole promise.
            </p>
          </div>
          <div className={cx('peopleDuo')}>
            <div className={cx('pcard', 'reveal')} data-d="1">
              <div className={cx('pcardPhoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/james.png" alt="James Fox" />
              </div>
              <div className={cx('pcardBody')}>
                <div className={cx('prole')}>{PEOPLE.james.role}</div>
                <h3>
                  <span className={cx('thin')}>James</span> <b>Fox</b>
                </h3>
                <ul className={cx('pcreds')}>
                  {PEOPLE.james.creds.map((line, i) => (
                    <li key={i}>{rich(line)}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={cx('pcard', 'reveal')} data-d="2">
              <div className={cx('pcardPhoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Cyril.png" alt="Cyril Rool" />
              </div>
              <div className={cx('pcardBody')}>
                <div className={cx('prole')}>{PEOPLE.cyril.role}</div>
                <h3>
                  <span className={cx('thin')}>Cyril</span> <b>Rool</b>
                </h3>
                <ul className={cx('pcreds')}>
                  {PEOPLE.cyril.creds.map((line, i) => (
                    <li key={i}>{rich(line)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className={cx('end')} id="enquiry">
        <div className={cx('wrap')}>
          <div className={cx('eyebrow', 'reveal')}>
            The next signing starts here
          </div>
          <h2 className={cx('reveal')} data-d="1">
            <span className={cx('thin')}>Tell Clearway the player</span>{' '}
            <b>you are missing.</b>
          </h2>
          <p className={cx('reveal')} data-d="2">
            Five quick answers, and it reaches Clearway directly. We reply in
            person. No bots, no middlemen.
          </p>
          <button
            type="button"
            className={cx('email', 'reveal')}
            data-d="2"
            onClick={openEnq}
          >
            Start your search <span className={cx('arr')}>→</span>
          </button>
          <div className={cx('discreet', 'reveal')} data-d="3">
            Every enquiry is treated in confidence. No player is ever named publicly
            without permission.
          </div>
        </div>
      </section>

      {/* ENQUIRY MODAL */}
      <div
        className={cx('enqOverlay', enqOpen && 'open')}
        aria-hidden={!enqOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeEnq();
        }}
        onKeyDown={onEnqKeyDown}
      >
        <canvas ref={enqCanvasRef} className={cx('enqCanvas')} aria-hidden />
        <div className={cx('enqModal')} role="dialog" aria-modal="true" aria-label="Club enquiry">
          <button
            type="button"
            className={cx('enqClose')}
            aria-label="Close"
            onClick={closeEnq}
          >
            ✕
          </button>
          <div className={cx('enqHead')}>
            <span className={cx('enqLogo')}>
              <span className={cx('c')}>CLEAR</span>
              <span className={cx('w')}>WAY</span>
            </span>
            <div className={cx('enqProg')}>
              <span style={{width: `${progressPct}%`}} />
            </div>
            <div className={cx('enqStepLabel')}>{stepLabel}</div>
          </div>

          <div className={cx('enqBody')} ref={enqBodyRef}>
            {/* step 1 */}
            <div className={stepCls(0)}>
              <div className={cx('enqKicker')}>Let us find your player</div>
              <h3>
                Which club is
                <br />
                this <b>for?</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput', flagged.has('club') && 'err')}
                placeholder="Club name"
                autoComplete="off"
                value={data.club}
                onChange={(e) => setField('club', e.target.value)}
              />
              <div className={cx('enqErr', errors.club && 'show')}>
                Please tell us the club.
              </div>
            </div>
            {/* step 2 */}
            <div className={stepCls(1)}>
              <div className={cx('enqKicker')}>Your level</div>
              <h3>
                Country and
                <br />
                <b>league.</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput', flagged.has('region') && 'err')}
                placeholder="e.g. England, Championship"
                autoComplete="off"
                value={data.region}
                onChange={(e) => setField('region', e.target.value)}
              />
              <div className={cx('enqErr', errors.region && 'show')}>
                Please tell us where you are.
              </div>
            </div>
            {/* step 3 */}
            <div className={stepCls(2)}>
              <div className={cx('enqKicker')}>The gap in your squad</div>
              <h3>
                Who are you
                <br />
                <b>looking for?</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput')}
                placeholder="e.g. Right back, U21, left footed"
                autoComplete="off"
                value={data.profile}
                onChange={(e) => setField('profile', e.target.value)}
              />
              <div className={cx('enqHint')}>
                One line is enough. You can be more specific later.
              </div>
            </div>
            {/* step 4 */}
            <div className={stepCls(3)}>
              <div className={cx('enqKicker')}>Your timeline</div>
              <h3>
                When do you
                <br />
                <b>need them?</b>
              </h3>
              <div className={cx('enqChips')}>
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={cx('enqChip', data.timeline === opt && 'sel')}
                    onClick={() => selectTimeline(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className={cx('enqErr', errors.timeline && 'show')}>
                Pick one to continue.
              </div>
            </div>
            {/* step 5 */}
            <div className={stepCls(4)}>
              <div className={cx('enqKicker')}>Where Clearway reaches you</div>
              <h3>
                Your name
                <br />
                and <b>email.</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput', flagged.has('name') && 'err')}
                placeholder="Your name"
                autoComplete="off"
                value={data.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              <input
                type="email"
                className={cx('enqInput', flagged.has('email') && 'err')}
                placeholder="Your email"
                autoComplete="off"
                style={{marginTop: 14}}
                value={data.email}
                onChange={(e) => setField('email', e.target.value)}
              />
              <div className={cx('enqErr', errors.contact && 'show')}>
                A name and a valid email, please.
              </div>
            </div>
            {/* done */}
            <div className={`${stepCls(5)} ${cx('enqDone')}`}>
              <div className={cx('enqDoneBall')}>
                <svg viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="27" fill="#fcfcfc" stroke="#d0d8e2" strokeWidth="1.5" />
                  <polygon points="30,16 42,24 38,38 22,38 18,24" fill="#0a2a5e" />
                </svg>
              </div>
              <h3>
                Clearway
                <br />
                <b>is on it.</b>
              </h3>
              <p>
                Every enquiry goes straight to Clearway. We reply in person, in
                confidence. The search starts now.
              </p>
            </div>
          </div>

          {cur < TOTAL && (
            <div className={cx('enqFoot')}>
              <button
                type="button"
                className={cx('enqBack', cur > 0 && 'show')}
                onClick={() => cur > 0 && goTo(cur - 1)}
              >
                ← Back
              </button>
              <button type="button" className={cx('enqNext')} onClick={validateAndNext}>
                {cur === TOTAL - 1 ? 'Send to Clearway' : 'Continue'}{' '}
                <span className={cx('arr')}>→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className={cx('foot')}>
        <div className={cx('wrap')}>
          <div>
            <span className={cx('mark')}>
              <span className={cx('c')}>CLEAR</span>
              <span className={cx('w')}>WAY</span>
            </span>
            <div className={cx('serif')}>we form champions</div>
          </div>
          <div className={cx('footCol')}>
            <h4>Navigate</h4>
            <Link href="/for-clubs">For Clubs</Link>
            <Link href="/for-players">For Players</Link>
            <Link href="/about">About James Fox</Link>
          </div>
          <div className={cx('footCol')}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
        <div className={cx('footBot')}>
          © 2026 Clearway Performance Group · Created by SCNDAL
        </div>
      </footer>
    </div>
  );
}
