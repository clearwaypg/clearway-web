'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {useLocale} from 'next-intl';
import {useParams} from 'next/navigation';

import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import styles from './LandingHome.module.css';

/* =========================================================
   CLEARWAY PERFORMANCE GROUP — HOME
   Faithful port of the home-clearway design guide.
   Brand tokens scoped to .page; fonts come from next/font
   (Archivo display + EB Garamond italic) via the page wrapper.

   The clips that used to back the split-screen panels now fade
   in behind the hero content when the matching central button
   is hovered.
   ========================================================= */

/* Join scoped module classes by their guide names, dropping falsy values. */
const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

/* Turn **bold** markers into <strong> so the rich credit lines stay readable
   in the copy table below without dangerouslySetInnerHTML. */
function rich(s: string) {
  return s.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

type Copy = (typeof COPY)['en'];

const COPY = {
  en: {
    nav: {clubs: 'For Clubs', players: 'For Players', about: 'About'},
    hero: {
      tagline: 'International talent identification · Est. 2023',
      pg: 'Performance Group',
      sub: 'We identify talent and open the door to clubs across England and Europe. Quietly, honestly, and only for the few who are ready.',
      clubK: 'I am a club',
      clubT: 'For Clubs',
      playerK: 'I am a player',
      playerT: 'For Players',
      cue: 'Who we are'
    },
    what: {
      eyebrow: 'Who we are',
      pre: 'The honest ',
      it: 'bridge',
      mid: ' between a player who is ready and a club that is looking. ',
      bold: 'We reveal just enough to be credible, and we never promise what we cannot deliver.'
    },
    doors: {
      clubs: {
        dlabel: 'If you are a club',
        thin: 'We bring you',
        bold: 'the right player.',
        p: 'Identified, checked and ready. With the work permit and GBE paperwork for England already handled.',
        enter: 'Enter'
      },
      players: {
        dlabel: 'If you are a player',
        thin: 'We open the',
        bold: 'door for you.',
        p: 'We measure you against a real professional standard and put you in front of the clubs that fit. We guarantee the trial, not the signing. Men and women.',
        enter: 'Enter'
      }
    },
    team: {
      eyebrow: 'The names that open doors',
      thin: 'They have seen it before.',
      bold: 'They know what it takes.',
      it: 'And they believe in the ones who do.',
      jamesRole: 'Founder and CEO',
      jamesCreds: [
        'Over **30 years in professional sport**, as athlete, coach and manager. Alongside Olympic gold medallists, Wimbledon champions, world number ones and EFL footballers.',
        '**Registered with The Football Association in Talent Identification.**',
        'More than **100 clubs** across England and Europe. FIFA licensed agents available.',
        'The **work permit and GBE for England**, handled.'
      ],
      cyrilRole: 'Director of European Football',
      cyrilCreds: [
        'Over **15 years in Ligue 1** with RC Lens, Bordeaux, OGC Nice and Olympique de Marseille.',
        '**France Under 21 international.**',
        'Has represented and placed several players in **Europe and Mexico**.'
      ]
    },
    proof: {
      eyebrow: 'The record',
      thin: 'The numbers',
      it: 'that hold up.',
      cells: [
        {count: 30, suffix: '', b: 'Years', l: 'in elite sport'},
        {count: 100, suffix: '+', b: 'Clubs', l: 'England and Europe'},
        {count: 66, suffix: '', b: 'Countries', l: 'in the database'},
        {count: 7, suffix: '%', b: 'Make it', l: 'through the filter'}
      ]
    },
    end: {
      clubsTag: 'If you are a club',
      playersTag: 'If you are a player',
      forWord: 'For',
      clubs: 'Clubs',
      players: 'Players',
      enter: 'Enter →',
      q: ['Which side', 'are you on?']
    },
    foot: {
      serif: 'we form champions',
      navigate: 'Navigate',
      clubs: 'For Clubs',
      players: 'For Players',
      about: 'About James Fox',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      copyright: '© 2026 Clearway Performance Group · Created by SCNDAL'
    }
  },
  es: {
    nav: {clubs: 'Para Clubes', players: 'Para Jugadores', about: 'Sobre'},
    hero: {
      tagline: 'Identificación internacional de talento · Est. 2023',
      pg: 'Performance Group',
      sub: 'Identificamos talento y abrimos la puerta a clubes en Inglaterra y Europa. En silencio, con honestidad, y solo para los pocos que están listos.',
      clubK: 'Soy un club',
      clubT: 'Para Clubes',
      playerK: 'Soy jugador',
      playerT: 'Para Jugadores',
      cue: 'Quiénes somos'
    },
    what: {
      eyebrow: 'Quiénes somos',
      pre: 'El ',
      it: 'puente',
      mid: ' honesto entre un jugador que está listo y un club que está buscando. ',
      bold: 'Revelamos lo justo para ser creíbles, y nunca prometemos lo que no podemos cumplir.'
    },
    doors: {
      clubs: {
        dlabel: 'Si eres un club',
        thin: 'Te traemos',
        bold: 'al jugador correcto.',
        p: 'Identificado, verificado y listo. Con el permiso de trabajo y el papeleo GBE para Inglaterra ya resueltos.',
        enter: 'Entrar'
      },
      players: {
        dlabel: 'Si eres jugador',
        thin: 'Te abrimos',
        bold: 'la puerta.',
        p: 'Te medimos contra un estándar profesional real y te ponemos frente a los clubes que encajan. Garantizamos la prueba, no la firma. Hombres y mujeres.',
        enter: 'Entrar'
      }
    },
    team: {
      eyebrow: 'Los nombres que abren puertas',
      thin: 'Ya lo han vivido.',
      bold: 'Saben lo que hace falta.',
      it: 'Y creen en quienes lo tienen.',
      jamesRole: 'Fundador y CEO',
      jamesCreds: [
        'Más de **30 años en el deporte profesional**, como atleta, entrenador y mánager. Junto a medallistas de oro olímpicos, campeones de Wimbledon, números uno del mundo y futbolistas de la EFL.',
        '**Registrado en The Football Association en Identificación de Talento.**',
        'Más de **100 clubes** en Inglaterra y Europa. Agentes con licencia FIFA disponibles.',
        'El **permiso de trabajo y la GBE para Inglaterra**, resueltos.'
      ],
      cyrilRole: 'Director de Fútbol Europeo',
      cyrilCreds: [
        'Más de **15 años en la Ligue 1** con RC Lens, Burdeos, OGC Nice y Olympique de Marsella.',
        '**Internacional con la Francia Sub-21.**',
        'Ha representado y colocado a varios jugadores en **Europa y México**.'
      ]
    },
    proof: {
      eyebrow: 'El historial',
      thin: 'Los números',
      it: 'que se sostienen.',
      cells: [
        {count: 30, suffix: '', b: 'Años', l: 'en deporte de élite'},
        {count: 100, suffix: '+', b: 'Clubes', l: 'Inglaterra y Europa'},
        {count: 66, suffix: '', b: 'Países', l: 'en la base de datos'},
        {count: 7, suffix: '%', b: 'Pasan', l: 'el filtro'}
      ]
    },
    end: {
      clubsTag: 'Si eres un club',
      playersTag: 'Si eres jugador',
      forWord: 'Para',
      clubs: 'Clubes',
      players: 'Jugadores',
      enter: 'Entrar →',
      q: ['¿De qué lado', 'estás?']
    },
    foot: {
      serif: 'formamos campeones',
      navigate: 'Navegar',
      clubs: 'Para Clubes',
      players: 'Para Jugadores',
      about: 'Sobre James Fox',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
      copyright: '© 2026 Clearway Performance Group · Creado por SCNDAL'
    }
  }
};

export function LandingHome() {
  const locale = useLocale();
  const c: Copy = COPY[locale === 'es' ? 'es' : 'en'];

  const [hovered, setHovered] = useState<'clubs' | 'players' | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLCanvasElement>(null);
  const whatRef = useRef<HTMLElement>(null);
  const whatCanvasRef = useRef<HTMLCanvasElement>(null);
  const teamBallRef = useRef<HTMLCanvasElement>(null);
  const endRef = useRef<HTMLElement>(null);
  const vsBallRef = useRef<HTMLDivElement>(null);
  const vsMidRef = useRef<HTMLDivElement>(null);
  const clubsVideoRef = useRef<HTMLVideoElement>(null);
  const playersVideoRef = useRef<HTMLVideoElement>(null);

  function playVideo(ref: React.RefObject<HTMLVideoElement | null>) {
    const v = ref.current;
    if (v) void v.play().catch(() => {});
  }
  function resetVideo(ref: React.RefObject<HTMLVideoElement | null>) {
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }

  /* ===== HERO: football play behind the logo, reacts to the cursor ===== */
  useEffect(() => {
    const canvas = pitchRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    const mouse = {x: -9999, y: -9999, active: false};
    type P = {
      team: 'A' | 'B';
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
    const ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      holder: null as P | null,
      target: null as P | null,
      traveling: false,
      cool: 0
    };

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    function seed() {
      players.length = 0;
      const teamA = [
        [0.1, 0.3],
        [0.1, 0.7],
        [0.22, 0.5],
        [0.3, 0.2],
        [0.3, 0.8],
        [0.38, 0.5]
      ];
      const teamB = [
        [0.9, 0.3],
        [0.9, 0.7],
        [0.78, 0.5],
        [0.7, 0.2],
        [0.7, 0.8]
      ];
      teamA.forEach(([fx, fy]) =>
        players.push({
          team: 'A',
          hx: fx,
          hy: fy,
          x: fx * W,
          y: fy * H,
          vx: 0,
          vy: 0,
          phase: (fx + fy) * 6.28,
          roam: 16 + fy * 12
        })
      );
      teamB.forEach(([fx, fy]) =>
        players.push({
          team: 'B',
          hx: fx,
          hy: fy,
          x: fx * W,
          y: fy * H,
          vx: 0,
          vy: 0,
          phase: (fx + fy) * 6.28,
          roam: 16 + fy * 12
        })
      );
      const s = players[2];
      ball.x = s.x;
      ball.y = s.y;
      ball.holder = s;
      ball.traveling = false;
      ball.cool = 20;
    }
    function passBall() {
      const from = ball.holder || players[0];
      let best: P | null = null;
      let score = -1;
      let tick = 0;
      for (const p of players) {
        if (p === from || p.team !== from.team) continue;
        const d = Math.hypot(p.x - from.x, p.y - from.y);
        if (d < 40) continue;
        const fwd =
          from.team === 'A' ? (p.x - from.x) / W : (from.x - p.x) / W;
        tick += 0.37;
        const s = fwd * 1.2 + (tick % 1) * 1.2 - Math.abs(d - W * 0.3) / W;
        if (s > score) {
          score = s;
          best = p;
        }
      }
      if (!best) best = players[0];
      ball.holder = null;
      ball.traveling = true;
      ball.target = best;
      const dx = best.x - ball.x;
      const dy = best.y - ball.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = Math.min(17, 9 + d * 0.02);
      ball.vx = (dx / d) * sp;
      ball.vy = (dy / d) * sp;
    }
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      // cancha HORIZONTAL con porterías izquierda y derecha
      ctx!.save();
      ctx!.strokeStyle = 'rgba(208,216,226,0.055)';
      ctx!.lineWidth = 1;
      const mx = W * 0.06;
      const my = H * 0.1;
      const mw = W * 0.88;
      const mh = H * 0.8;
      ctx!.strokeRect(mx, my, mw, mh);
      ctx!.beginPath();
      ctx!.moveTo(W * 0.5, my);
      ctx!.lineTo(W * 0.5, my + mh);
      ctx!.stroke();
      const cr = Math.min(mw, mh) * 0.16;
      ctx!.beginPath();
      ctx!.arc(W * 0.5, my + mh * 0.5, cr, 0, 6.28);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(W * 0.5, my + mh * 0.5, 2.5, 0, 6.28);
      ctx!.fillStyle = 'rgba(208,216,226,0.12)';
      ctx!.fill();
      const ah = mh * 0.4;
      const aw = mw * 0.1;
      const ash = mh * 0.2;
      const asw = mw * 0.045;
      ctx!.strokeStyle = 'rgba(208,216,226,0.055)';
      ctx!.strokeRect(mx, my + (mh - ah) / 2, aw, ah);
      ctx!.strokeRect(mx, my + (mh - ash) / 2, asw, ash);
      ctx!.strokeRect(mx + mw - aw, my + (mh - ah) / 2, aw, ah);
      ctx!.strokeRect(mx + mw - asw, my + (mh - ash) / 2, asw, ash);
      const gh = mh * 0.2;
      const gw = W * 0.022;
      const gy = my + mh * 0.5 - gh / 2;
      ctx!.strokeStyle = 'rgba(208,216,226,0.22)';
      ctx!.lineWidth = 1.5;
      ctx!.strokeRect(mx - gw, gy, gw, gh);
      ctx!.strokeRect(mx + mw, gy, gw, gh);
      ctx!.restore();

      for (const p of players) {
        p.phase += 0.012;
        let tx = p.hx * W + Math.cos(p.phase) * p.roam;
        let ty = p.hy * H + Math.sin(p.phase * 0.8) * p.roam;
        const db = Math.hypot(ball.x - p.x, ball.y - p.y);
        if (p === ball.target || p === ball.holder) {
          tx = tx * 0.5 + ball.x * 0.5;
          ty = ty * 0.5 + ball.y * 0.5;
        } else if (db < 160) {
          const pull =
            ball.holder && ball.holder.team === p.team ? 0.2 : 0.34;
          tx = tx * (1 - pull) + ball.x * pull;
          ty = ty * (1 - pull) + ball.y * pull;
        }
        if (mouse.active) {
          const dmx = p.x - mouse.x;
          const dmy = p.y - mouse.y;
          const dm = Math.hypot(dmx, dmy);
          if (dm < 260) {
            tx += (dmx / dm) * (260 - dm) * 0.8;
            ty += (dmy / dm) * (260 - dm) * 0.8;
          }
        }
        p.vx += (tx - p.x) * 0.01;
        p.vy += (ty - p.y) * 0.01;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;
      }
      if (ball.traveling) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        const tg = ball.target;
        if (tg && Math.hypot(tg.x - ball.x, tg.y - ball.y) < 15) {
          ball.traveling = false;
          ball.holder = tg;
          ball.cool = 12 + ((tg.phase * 7) % 18);
        }
      } else if (ball.holder) {
        ball.x = ball.holder.x;
        ball.y = ball.holder.y;
        ball.cool--;
        if (ball.cool <= 0) passBall();
      }

      if (ball.traveling) {
        ctx!.globalAlpha = 0.3;
        ctx!.strokeStyle = 'rgba(252,252,252,0.8)';
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(ball.x, ball.y);
        ctx!.lineTo(ball.x - ball.vx * 2.5, ball.y - ball.vy * 2.5);
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      for (const p of players) {
        const hasBall = ball.holder === p;
        if (p.team === 'A') {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, hasBall ? 6 : 5, 0, 6.28);
          ctx!.fillStyle = 'rgba(208,216,226,0.85)';
          ctx!.fill();
        } else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, hasBall ? 6 : 5, 0, 6.28);
          ctx!.fillStyle = 'rgba(120,140,170,0.5)';
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 5, 0, 6.28);
          ctx!.strokeStyle = 'rgba(208,216,226,0.3)';
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
        if (hasBall) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 11, 0, 6.28);
          ctx!.strokeStyle = 'rgba(252,252,252,0.4)';
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
      }
      ctx!.beginPath();
      ctx!.arc(ball.x, ball.y, 4.5, 0, 6.28);
      ctx!.fillStyle = '#fcfcfc';
      ctx!.fill();
      raf = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }
    function onResize() {
      resize();
      seed();
    }

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    resize();
    seed();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* ===== WHO WE ARE: small ball that drops with the scroll, by the 2023 ===== */
  useEffect(() => {
    const canvas = whatCanvasRef.current;
    const section = whatRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0;
    let H = 0;
    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    function render() {
      if (
        canvas!.width !== canvas!.offsetWidth ||
        canvas!.height !== canvas!.offsetHeight
      )
        resize();
      ctx!.clearRect(0, 0, W, H);
      const r = section!.getBoundingClientRect();
      const vh = window.innerHeight;
      let p = (vh - r.top) / (vh + r.height);
      p = Math.max(0, Math.min(1, p));
      const bx = W * 0.82;
      const by = H * 0.12 + p * (H * 0.76);
      ctx!.strokeStyle = 'rgba(208,216,226,0.08)';
      ctx!.lineWidth = 1;
      ctx!.setLineDash([4, 8]);
      ctx!.beginPath();
      ctx!.moveTo(bx, H * 0.1);
      ctx!.lineTo(bx, H * 0.9);
      ctx!.stroke();
      ctx!.setLineDash([]);
      const grad = ctx!.createLinearGradient(bx, by - 50, bx, by);
      grad.addColorStop(0, 'rgba(208,216,226,0)');
      grad.addColorStop(1, 'rgba(208,216,226,0.4)');
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(bx, by - 50);
      ctx!.lineTo(bx, by);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(bx, by, 14, 0, 6.28);
      ctx!.fillStyle = 'rgba(208,216,226,0.06)';
      ctx!.fill();
      ctx!.save();
      ctx!.translate(bx, by);
      ctx!.rotate(p * 12);
      ctx!.beginPath();
      ctx!.arc(0, 0, 6, 0, 6.28);
      ctx!.fillStyle = '#fcfcfc';
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(0, 0, 6, 0, 6.28);
      ctx!.strokeStyle = 'rgba(208,216,226,0.6)';
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.fillStyle = 'rgba(120,140,170,0.55)';
      ctx!.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 6.28) / 5;
        const pr = 2.4;
        if (i === 0) ctx!.moveTo(Math.cos(a) * pr, Math.sin(a) * pr);
        else ctx!.lineTo(Math.cos(a) * pr, Math.sin(a) * pr);
      }
      ctx!.closePath();
      ctx!.fill();
      ctx!.restore();
    }
    let visible = false;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          visible = e.isIntersecting;
          if (visible) {
            resize();
            render();
          }
        }),
      {threshold: 0}
    );
    io.observe(section);
    function onScroll() {
      if (visible) render();
    }
    function onResize() {
      resize();
      if (visible) render();
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onResize);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* ===== TEAM: elite ball crossing behind James & Cyril ===== */
  useEffect(() => {
    const canvas = teamBallRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0;
    let H = 0;
    let raf = 0;
    let t = 0;
    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      t += 0.005;
      const y = H * 0.5;
      ctx!.strokeStyle = 'rgba(208,216,226,0.06)';
      ctx!.lineWidth = 1;
      ctx!.setLineDash([6, 10]);
      ctx!.beginPath();
      ctx!.moveTo(W * 0.06, y);
      ctx!.lineTo(W * 0.94, y);
      ctx!.stroke();
      ctx!.setLineDash([]);
      const p = Math.sin(t) * 0.5 + 0.5;
      const x = W * 0.08 + p * W * 0.84;
      const by = y + Math.sin(t * 2.2) * 22;
      const fadeAlpha = Math.min(1, Math.min(p, 1 - p) * 8);
      const dir = Math.cos(t) >= 0 ? 1 : -1;
      const grad = ctx!.createLinearGradient(x - dir * 110, by, x, by);
      grad.addColorStop(0, 'rgba(208,216,226,0)');
      grad.addColorStop(1, `rgba(208,216,226,${0.6 * fadeAlpha})`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 2.5;
      ctx!.beginPath();
      ctx!.moveTo(x - dir * 110, by);
      ctx!.lineTo(x, by);
      ctx!.stroke();
      ctx!.globalAlpha = fadeAlpha * 0.15;
      ctx!.beginPath();
      ctx!.arc(x, by, 28, 0, 6.28);
      ctx!.fillStyle = 'rgba(208,216,226,1)';
      ctx!.fill();
      ctx!.globalAlpha = fadeAlpha;
      ctx!.beginPath();
      ctx!.arc(x, by, 12, 0, 6.28);
      ctx!.fillStyle = '#fcfcfc';
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(x, by, 12, 0, 6.28);
      ctx!.strokeStyle = 'rgba(208,216,226,0.7)';
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      ctx!.fillStyle = 'rgba(208,216,226,0.6)';
      const pr = 4;
      const pa = Math.PI / 2 + t * 2;
      ctx!.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = pa + (i * 6.28) / 5;
        if (i === 0)
          ctx!.moveTo(x + Math.cos(a) * pr, by + Math.sin(a) * pr);
        else ctx!.lineTo(x + Math.cos(a) * pr, by + Math.sin(a) * pr);
      }
      ctx!.closePath();
      ctx!.fill();
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            resize();
            if (!raf) draw();
          } else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }),
      {threshold: 0.05}
    );
    io.observe(canvas);
    function onResize() {
      if (raf) resize();
    }
    window.addEventListener('resize', onResize);
    return () => {
      io.disconnect();
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

  /* ===== VS closing: reveal text + ball that drops down the centre ===== */
  useEffect(() => {
    const end = endRef.current;
    const ball = vsBallRef.current;
    const mid = vsMidRef.current;
    if (!end) return;
    const eio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) end.classList.add(styles.in);
        }),
      {threshold: 0.3}
    );
    eio.observe(end);
    function onScroll() {
      if (!ball || !mid) return;
      const r = mid.getBoundingClientRect();
      const vh = window.innerHeight;
      let p = (vh - r.top) / (vh + r.height);
      p = Math.max(0, Math.min(1, p));
      const travel = r.height - 30;
      ball.style.top = p * travel + 'px';
      ball.style.transform = 'translateX(-50%) rotate(' + p * 720 + 'deg)';
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => {
      eio.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* ===== Scoreboard: dramatic count-up that eases as it lands ===== */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nums = root.querySelectorAll<HTMLElement>(
      `.${styles.sbN}[data-count]`
    );
    if (!nums.length) return;
    const animate = (el: HTMLElement) => {
      const target = parseInt(el.dataset.count || '0', 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      let start = 0;
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min((now - start) / dur, 1);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = Math.round(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else {
          el.textContent = target + suffix;
          el.style.textShadow =
            '0 0 40px rgba(208,216,226,.9),0 0 80px rgba(120,150,210,.6)';
          setTimeout(() => {
            el.style.textShadow = '';
          }, 600);
        }
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target as HTMLElement);
            cio.unobserve(e.target);
          }
        }),
      {threshold: 0.5}
    );
    nums.forEach((n) => cio.observe(n));
    return () => cio.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={cx('page')}>
      {/* film grain */}
      <div className={cx('grain')} aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="grain-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={3}
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-noise)" />
        </svg>
      </div>

      {/* NAV */}
      <nav className={cx('nav')}>
        <Link href="/" className={cx('logo')} aria-label="Clearway Performance Group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logotipos/clearway-white.svg" alt="Clearway Performance Group" />
        </Link>
        <div className={cx('links')}>
          <Link href="/for-clubs">{c.nav.clubs}</Link>
          <Link href="/for-players">{c.nav.players}</Link>
          <Link href="/about">{c.nav.about}</Link>
          <LangToggle />
        </div>
      </nav>

      {/* HERO */}
      <section className={cx('hero')}>
        <canvas ref={pitchRef} className={cx('pitch')} aria-hidden />

        {/* Hover videos — fade in behind the hero when a button is hovered */}
        <div className={cx('heroVideos')} aria-hidden>
          <video
            ref={clubsVideoRef}
            src="/teams-1.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            className={cx('heroVideo', hovered === 'clubs' && 'heroVideoOn')}
          />
          <video
            ref={playersVideoRef}
            src="/players-1.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            className={cx('heroVideo', hovered === 'players' && 'heroVideoOn')}
          />
        </div>
        <div
          className={cx('heroVideoVeil', hovered && 'heroVideoVeilOn')}
          aria-hidden
        />

        <div className={cx('heroInner')}>
          <div className={cx('tagline')}>{c.hero.tagline}</div>
          <div className={cx('logoBig')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={cx('logoSvg')}
              src="/Logotipos/clearway-white.svg"
              alt="Clearway Performance Group"
            />
          </div>
          <p className={cx('sub')}>{c.hero.sub}</p>
          <div className={cx('heroCta')}>
            <Link
              href="/for-clubs"
              className={cx('hb', 'hbGhost')}
              onMouseEnter={() => {
                setHovered('clubs');
                playVideo(clubsVideoRef);
              }}
              onMouseLeave={() => {
                setHovered(null);
                resetVideo(clubsVideoRef);
              }}
            >
              <span className={cx('hbK')}>{c.hero.clubK}</span>
              <span className={cx('hbT')}>
                {c.hero.clubT} <span className={cx('arr')}>→</span>
              </span>
            </Link>
            <Link
              href="/for-players"
              className={cx('hb', 'hbSolid')}
              onMouseEnter={() => {
                setHovered('players');
                playVideo(playersVideoRef);
              }}
              onMouseLeave={() => {
                setHovered(null);
                resetVideo(playersVideoRef);
              }}
            >
              <span className={cx('hbK')}>{c.hero.playerK}</span>
              <span className={cx('hbT')}>
                {c.hero.playerT} <span className={cx('arr')}>→</span>
              </span>
            </Link>
          </div>
        </div>
        <div className={cx('scrollCue')}>
          <span>{c.hero.cue}</span>
          <span className={cx('bar')} />
        </div>
      </section>

      {/* WHO WE ARE */}
      <section ref={whatRef} className={cx('what', 'reveal')}>
        <canvas ref={whatCanvasRef} className={cx('whatcanvas')} aria-hidden />
        <div className={cx('bgmark')} aria-hidden>
          2023
        </div>
        <div className={cx('wrap')}>
          <span className={cx('whatLine')} />
          <div className={cx('eyebrow', 'reveal')}>{c.what.eyebrow}</div>
          <h2 className={cx('reveal')} data-d="1">
            {c.what.pre}
            <span className={cx('it')}>{c.what.it}</span>
            {c.what.mid}
            <b>{c.what.bold}</b>
          </h2>
        </div>
      </section>

      {/* THE TWO DOORS */}
      <section className={cx('doors')}>
        <Link href="/for-clubs" className={cx('door', 'doorClubs', 'reveal')}>
          <svg
            className={cx('doorSil')}
            viewBox="0 0 200 240"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M100 10 L180 40 L180 120 Q180 200 100 230 Q20 200 20 120 L20 40 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M100 50 L100 190 M55 75 L145 75 M55 110 L145 110 M70 145 L130 145"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
          <div className={cx('dlabel')}>{c.doors.clubs.dlabel}</div>
          <h3>
            <span className={cx('thin')}>{c.doors.clubs.thin}</span>
            <br />
            <b>{c.doors.clubs.bold}</b>
          </h3>
          <p>{c.doors.clubs.p}</p>
          <span className={cx('go')}>
            <span>{c.doors.clubs.enter}</span> <span className={cx('arr')}>→</span>
          </span>
        </Link>
        <Link
          href="/for-players"
          className={cx('door', 'doorPlayers', 'reveal')}
          data-d="1"
        >
          <svg
            className={cx('doorSil')}
            viewBox="0 0 160 260"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              cx="80"
              cy="40"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M80 70 L80 160 M80 90 L40 130 M80 90 L120 130 M80 160 L52 240 M80 160 L108 240"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className={cx('dlabel')}>{c.doors.players.dlabel}</div>
          <h3>
            <span className={cx('thin')}>{c.doors.players.thin}</span>
            <br />
            <b>{c.doors.players.bold}</b>
          </h3>
          <p>{c.doors.players.p}</p>
          <span className={cx('go')}>
            <span>{c.doors.players.enter}</span>{' '}
            <span className={cx('arr')}>→</span>
          </span>
        </Link>
      </section>

      {/* JAMES & CYRIL */}
      <section className={cx('team')}>
        <canvas ref={teamBallRef} className={cx('teamball')} aria-hidden />
        <div className={cx('wrap')}>
          <div className={cx('eyebrow', 'reveal')}>{c.team.eyebrow}</div>
          <h2 className={cx('reveal')} data-d="1">
            <span className={cx('thin')}>{c.team.thin}</span>
            <br />
            <b>{c.team.bold}</b> <span className={cx('it')}>{c.team.it}</span>
          </h2>
          <div className={cx('teamGrid')}>
            <div className={cx('tcard', 'reveal')} data-d="1">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/james.png" alt="James Fox" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>James</span> Fox.
                </div>
                <div className={cx('trole')}>{c.team.jamesRole}</div>
                <ul className={cx('tcreds')}>
                  {c.team.jamesCreds.map((line, i) => (
                    <li key={i}>{rich(line)}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={cx('tcard', 'reveal')} data-d="2">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Cyril.png" alt="Cyril Rool" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Cyril</span> Rool.
                </div>
                <div className={cx('trole')}>{c.team.cyrilRole}</div>
                <ul className={cx('tcreds')}>
                  {c.team.cyrilCreds.map((line, i) => (
                    <li key={i}>{rich(line)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE RECORD — scoreboard */}
      <section className={cx('proof')}>
        <div className={cx('wrap')}>
          <div className={cx('recHead', 'reveal')}>
            <div className={cx('eyebrow')}>{c.proof.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.proof.thin}</span>{' '}
              <span className={cx('it')}>{c.proof.it}</span>
            </h2>
          </div>
          <div className={cx('scoreboard', 'reveal')} data-d="1">
            {c.proof.cells.map((cell, i) => (
              <div key={i} style={{display: 'contents'}}>
                {i > 0 && <div className={cx('sbSep')} />}
                <div className={cx('sbCell')}>
                  <div
                    className={cx('sbN')}
                    data-count={cell.count}
                    data-suffix={cell.suffix || undefined}
                  >
                    0
                  </div>
                  <div className={cx('sbL')}>
                    <b>{cell.b}</b>
                    {cell.l}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING — VS */}
      <section ref={endRef} className={cx('end')}>
        <div className={cx('vsWrap')}>
          <Link href="/for-clubs" className={cx('vsSide', 'vsClubs', 'reveal')}>
            <div className={cx('vsTag')}>{c.end.clubsTag}</div>
            <div className={cx('vsName')}>
              <span className={cx('thin')}>{c.end.forWord}</span>
              <br />
              <b>{c.end.clubs}</b>
            </div>
            <span className={cx('vsGo')}>{c.end.enter}</span>
          </Link>
          <div ref={vsMidRef} className={cx('vsMid', 'reveal')} data-d="1">
            <div ref={vsBallRef} className={cx('vsBall')}>
              <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="15"
                  cy="15"
                  r="13"
                  fill="#fcfcfc"
                  stroke="#d0d8e2"
                  strokeWidth="1"
                />
                <polygon points="15,8 21,12 19,19 11,19 9,12" fill="#d0d8e2" />
              </svg>
            </div>
            <div className={cx('vsQ')}>
              {c.end.q[0]}
              <br />
              {c.end.q[1]}
            </div>
          </div>
          <Link
            href="/for-players"
            className={cx('vsSide', 'vsPlayers', 'reveal')}
            data-d="2"
          >
            <div className={cx('vsTag')}>{c.end.playersTag}</div>
            <div className={cx('vsName')}>
              <span className={cx('thin')}>{c.end.forWord}</span>
              <br />
              <b>{c.end.players}</b>
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={cx('foot')}>
        <div className={cx('wrap')}>
          <div>
            <span className={cx('mark')}>
              <span className={cx('c')}>CLEAR</span>
              <span className={cx('w')}>WAY</span>
            </span>
            <div className={cx('serif')}>{c.foot.serif}</div>
          </div>
          <div className={cx('footCol')}>
            <h4>{c.foot.navigate}</h4>
            <Link href="/for-clubs">{c.foot.clubs}</Link>
            <Link href="/for-players">{c.foot.players}</Link>
            <Link href="/about">{c.foot.about}</Link>
          </div>
          <div className={cx('footCol')}>
            <h4>{c.foot.legal}</h4>
            <Link href="/privacy">{c.foot.privacy}</Link>
            <Link href="/terms">{c.foot.terms}</Link>
          </div>
        </div>
        <div className={cx('footBot')}>{c.foot.copyright}</div>
      </footer>
    </div>
  );
}

/* ----- Language toggle (EN / ES) ----- */
function LangToggle() {
  const activeLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === activeLocale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname/params share the same shape; next-intl types this strictly
        {pathname, params},
        {locale: next}
      );
    });
  }

  return (
    <div className={cx('lang')}>
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === activeLocale}
          className={cx(locale === activeLocale && 'langActive')}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
