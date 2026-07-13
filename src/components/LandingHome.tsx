'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';

import {Link} from '@/i18n/navigation';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';
import {getLenis} from './SmoothScroll';
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

/* Turn **key phrases** into <b> so body copy can mix a light base weight with
   bold highlights, matching the Who We Are treatment. */
const rich = (s: string) =>
  s
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : part));


type Copy = (typeof COPY)['en'];

const COPY = {
  en: {
    nav: {clubs: 'For Clubs', players: 'For Players', about: 'About'},
    hero: {
      tagline: 'International talent identification',
      pg: 'Performance Group',
      subA: 'We ',
      subIt: 'identify talent',
      subB: ' and open the doors to clubs across England, Europe, USA and Mexico.',
      clubT: 'Clubs',
      playerT: 'Players',
      cue: 'Who we are'
    },
    what: {
      eyebrow: 'Who we are',
      opening: 'Most promise the dream. We measure it.',
      bold: 'Clearway is an international football talent identification company. Our standard is the one professional clubs actually use. The door opens to over 100 clubs across England, Europe and the Americas.'
    },
    story: {
      p: 'Founded to create **genuine opportunities for talented footballers**, while giving clubs trusted eyes on the ground in emerging markets. We combine elite playing experience, professional scouting and licensed FIFA representation into **a complete pathway that builds long-term careers, not just trials.** **Relationships, integrity and professionalism** sit at the heart of it: **creating clear opportunities and always delivering what we promise.**'
    },
    doors: {
      clubs: {
        dlabel: 'Clubs',
        thin: 'We bring you',
        bold: 'the right player.',
        p: 'We bring you the right player. Identified, checked and ready.',
        enter: "Let's go"
      },
      players: {
        dlabel: 'Players',
        thin: 'We open the',
        bold: 'door for you.',
        p: 'We measure you against a real professional standard and put you in front of the clubs that fit. We guarantee the trial, not the signing. Men and women.',
        enter: "Let's go"
      }
    },
    team: {
      eyebrow: 'The names that open doors',
      thin: 'They have seen it before.',
      bold: 'They have seen it before. They know what it takes.',
      it: 'They can make it happen.',
      promise: 'When they put a player in front of you, it carries their name and their promise.',
      jamesRole: 'Founder & CEO',
      jamesDesc:
        'Has spent 30 years in elite sport across 66 countries as a professional athlete, coach and manager. Working alongside Olympic Gold Medalists, Wimbledon champions and world number ones, he brings global experience understanding the demands, discipline and mindset required to help talented athletes become professionals.',
      jamesCreds: [
        'Over **30 years in professional sport**, as athlete, coach and manager. Alongside Olympic gold medallists, Wimbledon champions, world number ones and EFL footballers.',
        '**Registered with The Football Association in Talent Identification.**',
        'More than **100 clubs** across England and Europe. FIFA licensed agents available.'
      ],
      cyrilRole: 'Director of European Football',
      cyrilDesc:
        'Spent over 15 years as a professional footballer in Ligue 1, playing for RC Lens, Girondins de Bordeaux, OGC Nice and Olympique de Marseille, and earned France Under-21 honours. That playing career became a second one off the pitch: he has represented and placed players across Europe and Mexico, and now brings that network and experience to Clearway.',
      cyrilCreds: [
        'Over **15 years in Ligue 1** with RC Lens, Bordeaux, OGC Nice and Olympique de Marseille.',
        '**France Under 21 international.**',
        'Has represented and placed several players in **Europe and Mexico**.'
      ],
      timoRole: 'Director of USA & Mexico Football',
      timoDesc:
        'Spent over 15 years as a professional defender across Europe and Mexico, playing for Lyon, Nice, Saint-Étienne, Sevilla, Borussia Mönchengladbach and Tigres UANL, and won the UEFA Europa League with Sevilla. Having competed at the top level in Ligue 1, La Liga, the Bundesliga and Liga MX, he now leads talent identification and player assessment for Clearway across the USA and Mexico.'
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
      tagline: 'Identificación internacional de talento',
      pg: 'Performance Group',
      subA: '',
      subIt: 'Identificamos talento',
      subB: ' y abrimos las puertas a clubes en Inglaterra, Europa, Estados Unidos y México.',
      clubT: 'Clubes',
      playerT: 'Jugadores',
      cue: 'Quiénes somos'
    },
    what: {
      eyebrow: 'Quiénes somos',
      opening: 'Muchos prometen el sueño. Nosotros lo medimos.',
      bold: 'Clearway es una empresa internacional de identificación de talento futbolístico. Nuestro estándar es el que los clubes profesionales usan de verdad. La puerta se abre a más de 100 clubes en Inglaterra, Europa y las Américas.'
    },
    story: {
      p: 'Nacimos para crear **oportunidades reales para futbolistas con talento**, y a la vez darles a los clubes ojos de confianza sobre el terreno en mercados emergentes. Combinamos experiencia como jugadores de élite, scouting profesional y representación FIFA con licencia en **un camino completo que construye carreras a largo plazo, no solo pruebas.** **Las relaciones, la integridad y la profesionalidad** están en el centro de todo: **crear oportunidades claras y cumplir siempre lo que prometemos.**'
    },
    doors: {
      clubs: {
        dlabel: 'Clubes',
        thin: 'Te traemos',
        bold: 'al jugador correcto.',
        p: 'Te traemos al jugador correcto. Identificado, verificado y listo.',
        enter: 'Vamos allá'
      },
      players: {
        dlabel: 'Jugadores',
        thin: 'Te abrimos',
        bold: 'la puerta.',
        p: 'Te medimos contra un estándar profesional real y te ponemos frente a los clubes que encajan. Garantizamos la prueba, no la firma. Hombres y mujeres.',
        enter: 'Vamos allá'
      }
    },
    team: {
      eyebrow: 'Los nombres que abren puertas',
      thin: 'Ya lo han vivido.',
      bold: 'Ya lo han vivido. Saben lo que se necesita.',
      it: 'Pueden hacerlo posible.',
      promise: 'Cuando ponen a un jugador frente a ti, lleva su nombre y su promesa.',
      jamesRole: 'Fundador y CEO',
      jamesDesc:
        'Ha pasado 30 años en el deporte de élite en 66 países como atleta profesional, entrenador y manager. Trabajando junto a medallistas de oro olímpicos, campeones de Wimbledon y números uno del mundo, aporta una experiencia global que le permite entender las exigencias, la disciplina y la mentalidad necesarias para ayudar a atletas talentosos a convertirse en profesionales.',
      jamesCreds: [
        'Más de **30 años en el deporte profesional**, como atleta, entrenador y mánager. Junto a medallistas de oro olímpicos, campeones de Wimbledon, números uno del mundo y futbolistas de la EFL.',
        '**Registrado en The Football Association en Identificación de Talento.**',
        'Más de **100 clubes** en Inglaterra y Europa. Agentes con licencia FIFA disponibles.'
      ],
      cyrilRole: 'Director de Fútbol Europeo',
      cyrilDesc:
        'Pasó más de 15 años como futbolista profesional en la Ligue 1, jugando para el RC Lens, Girondins de Burdeos, OGC Nice y Olympique de Marsella, y fue internacional con la selección Sub-21 de Francia. Esa carrera como jugador dio paso a una segunda fuera del campo: ha representado y colocado jugadores en Europa y México, y ahora aporta esa red y experiencia a Clearway.',
      cyrilCreds: [
        'Más de **15 años en la Ligue 1** con RC Lens, Burdeos, OGC Nice y Olympique de Marsella.',
        '**Internacional con la Francia Sub-21.**',
        'Ha representado y colocado a varios jugadores en **Europa y México**.'
      ],
      timoRole: 'Director de Fútbol de Estados Unidos y México',
      timoDesc:
        'Pasó más de 15 años como defensa profesional en Europa y México, jugando para el Lyon, Niza, Saint-Étienne, Sevilla, Borussia Mönchengladbach y Tigres UANL, y ganó la UEFA Europa League con el Sevilla. Tras competir al máximo nivel en la Ligue 1, La Liga, la Bundesliga y la Liga MX, hoy lidera la identificación de talento y la evaluación de jugadores para Clearway en Estados Unidos y México.'
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
  const numbersRef = useRef<HTMLElement>(null);
  const bgmarkRef = useRef<HTMLDivElement>(null);
  const numLeftRef = useRef<HTMLDivElement>(null);
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
          roam: 20 + fy * 16
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
          roam: 20 + fy * 16
        })
      );
      const s = players[2];
      ball.x = s.x;
      ball.y = s.y;
      ball.holder = s;
      ball.traveling = false;
      ball.cool = 42;
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
        p.phase += 0.014;
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
        const tg = ball.target;
        if (tg) {
          const dx = tg.x - ball.x;
          const dy = tg.y - ball.y;
          const d = Math.hypot(dx, dy) || 1;
          // Speed scales with distance so the ball eases in as it arrives, and
          // it re-aims at the (drifting) receiver each frame for an organic curve.
          const sp = Math.max(4.5, Math.min(15, d * 0.16));
          ball.vx += ((dx / d) * sp - ball.vx) * 0.22;
          ball.vy += ((dy / d) * sp - ball.vy) * 0.22;
          ball.x += ball.vx;
          ball.y += ball.vy;
          if (d < 12) {
            ball.traveling = false;
            ball.holder = tg;
            ball.cool = 48 + ((tg.phase * 13) % 54);
          }
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
          ctx!.arc(p.x, p.y, hasBall ? 2.8 : 2.4, 0, 6.28);
          ctx!.fillStyle = 'rgba(208,216,226,0.85)';
          ctx!.fill();
        } else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, hasBall ? 2.8 : 2.4, 0, 6.28);
          ctx!.fillStyle = 'rgba(120,140,170,0.5)';
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 2.4, 0, 6.28);
          ctx!.strokeStyle = 'rgba(208,216,226,0.3)';
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
        if (hasBall) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 6, 0, 6.28);
          ctx!.strokeStyle = 'rgba(252,252,252,0.4)';
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
      }
      ctx!.beginPath();
      ctx!.arc(ball.x, ball.y, 2.4, 0, 6.28);
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
      // Faint dashed guide line; the football itself floats over it with its own
      // scroll parallax (see the WHO WE ARE parallax effect below).
      const bx = W * 0.82;
      ctx!.strokeStyle = 'rgba(208,216,226,0.08)';
      ctx!.lineWidth = 1;
      ctx!.setLineDash([4, 8]);
      ctx!.beginPath();
      ctx!.moveTo(bx, H * 0.1);
      ctx!.lineTo(bx, H * 0.9);
      ctx!.stroke();
      ctx!.setLineDash([]);
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

  /* ===== "2023" watermark: breathes while in view, fades in/out on scroll. ===== */
  useEffect(() => {
    const el = bgmarkRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          el.classList.toggle(styles.bgmarkIn, e.isIntersecting);
        });
      },
      {threshold: 0}
    );
    io.observe(el);
    return () => io.disconnect();
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

  /* ===== THE NUMBERS: when the section scrolls into view, the stat rows
     stagger up and the heading slides in from the right (fires once). ===== */
  useEffect(() => {
    const el = numbersRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add(styles.numIn);
            io.disconnect();
          }
        });
      },
      {threshold: 0.2}
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ===== THE NUMBERS ball: slides in from the left each time the left column
     enters view, and slides back out when it leaves (toggles, not once). ===== */
  useEffect(() => {
    const el = numLeftRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          el.classList.toggle(styles.ballIn, e.isIntersecting);
        });
      },
      {threshold: 0.2}
    );
    io.observe(el);
    return () => io.disconnect();
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

  /* Hero "Who we are" cue → smooth-scroll down to the WHO WE ARE section.
     Uses the shared Lenis instance so it animates through Lenis; falls back to
     native smooth scroll when Lenis is absent (reduced motion). */
  const scrollToWhat = () => {
    const el = whatRef.current;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({behavior: 'smooth'});
  };

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

      {/* NAV — shared header (logo + hamburger + full-screen overlay menu) */}
      <SiteHeader />

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
            src="/players-1.mp4?v=1782322525"
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
          <p className={cx('sub')}>
            {c.hero.subA}
            <span className={cx('it')}>{c.hero.subIt}</span>
            {c.hero.subB}
          </p>
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
              <span className={cx('hbT')}>
                {c.hero.playerT} <span className={cx('arr')}>→</span>
              </span>
            </Link>
          </div>
        </div>
        <div
          className={cx('scrollCue')}
          role="button"
          tabIndex={0}
          aria-label={c.hero.cue}
          onClick={scrollToWhat}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToWhat();
            }
          }}
        >
          <span>{c.hero.cue}</span>
          <span className={cx('bar')} />
          <svg
            className={cx('chev')}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 9l7 7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section ref={whatRef} className={cx('what', 'reveal')}>
        <canvas ref={whatCanvasRef} className={cx('whatcanvas')} aria-hidden />
        <div ref={bgmarkRef} className={cx('bgmark')} aria-hidden>
          2023
        </div>
        <div className={cx('wrap')}>
          <div className={cx('eyebrow', 'reveal')}>{c.what.eyebrow}</div>
          <h2 className={cx('reveal')} data-d="1">
            <span className={cx('it')}>{c.what.opening}</span>{' '}
            <b>{c.what.bold}</b>
          </h2>
        </div>
      </section>

      {/* OUR STORY — mirror of Who We Are: image (placeholder) left, text right */}
      <section className={cx('story')}>
        <div className={cx('wrap')}>
          <div className={cx('storyGrid')}>
            <div className={cx('storyImg', 'reveal')} data-d="1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/clearway-whoeweare.webp" alt="" />
            </div>
            <div className={cx('storyText', 'reveal')} data-d="2">
              <p>{rich(c.story.p)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE TWO DOORS */}
      <section className={cx('doors')}>
        <Link href="/for-clubs" className={cx('door', 'doorClubs', 'reveal')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cx('doorImg')}
            src="/logo_bordado.png"
            alt=""
            aria-hidden
          />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cx('doorImg')}
            src="/silueta_atras.png"
            alt=""
            aria-hidden
          />
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
          <h2 className={cx('reveal')} data-d="1">
            <b>{c.team.bold}</b>
            <br />
            <span className={cx('it')}>{c.team.it}</span>
          </h2>
          <p className={cx('teamPromise', 'reveal')} data-d="1">
            {c.team.promise}
          </p>
          <div className={cx('teamGrid')}>
            <div className={cx('tcard', 'reveal')} data-d="1">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cyril.webp" alt="" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Cyril</span> Rool
                </div>
                <div className={cx('trole')}>{c.team.cyrilRole}</div>
                <p className={cx('tdesc')}>{c.team.cyrilDesc}</p>
              </div>
            </div>
            <div className={cx('tcard', 'reveal')} data-d="2">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/james.webp" alt="" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>James</span> Fox
                </div>
                <div className={cx('trole')}>{c.team.jamesRole}</div>
                <p className={cx('tdesc')}>{c.team.jamesDesc}</p>
              </div>
            </div>
            <div className={cx('tcard', 'reveal')} data-d="3">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/timothee.webp" alt="" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Timothée</span> Kolodziejczak
                </div>
                <div className={cx('trole')}>{c.team.timoRole}</div>
                <p className={cx('tdesc')}>{c.team.timoDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE NUMBERS — editorial split: stat strips (left) + heading (right) */}
      <section ref={numbersRef} className={cx('proof')}>
        <div className={cx('wrap')}>
          <div className={cx('numLayout')}>
            <div ref={numLeftRef} className={cx('numLeft')}>
              <div className={cx('numGlow')} aria-hidden="true" />
              <div className={cx('numHead')}>
                <h2>
                  <span className={cx('thin')}>{c.proof.thin}</span>{' '}
                  <span className={cx('it')}>{c.proof.it}</span>
                </h2>
              </div>
            </div>
            <div className={cx('numList')}>
              <div className={cx('numGrid')}>
                {c.proof.cells.map((cell, i) => (
                  <div className={cx('numStat')} key={i}>
                    <div
                      className={cx('sbN')}
                      data-count={cell.count}
                      data-suffix={cell.suffix || undefined}
                    >
                      0
                    </div>
                    <div className={cx('numLabel')}>
                      <b>{cell.b}</b>
                      <span>{cell.l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}

