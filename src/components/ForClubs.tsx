'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';

import {Ball3D} from './Ball3D';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';
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

type Copy = (typeof COPY)['en'];

const COPY = {
  en: {
    hero: {
      eyebrow: 'For clubs · England and Europe',
      thin: 'We send you the signal.',
      bold: 'Not the noise.',
      sub: 'Every player already filtered, watched and cleared. You only meet the ones ready to walk onto your pitch.',
      cta: 'Start your search'
    },
    process: {
      eyebrow: 'The Process',
      thin: 'Six steps.',
      bold: 'One clear path.',
      items: [
        'Upload your profile.',
        'We will review it and contact you to have an open discussion.',
        'If accepted, you will begin the Clearway player pathway.',
        'Three month evaluation and preparation process.',
        'If possible, we attend training sessions and matches.',
        'Guaranteed trial.'
      ]
    },
    versus: {
      eyebrow: 'What you actually get',
      thin: 'Every player,',
      bold: 'already cleared.',
      stats: [
        {big: '7%', line: 'clear the filter before we put them in front of you'},
        {big: '3 months', line: 'of real evaluation before any trial'},
        {big: 'In person', line: 'watched live, on the ground'},
        {big: 'Guaranteed', line: 'the trial is guaranteed, the signing is earned'}
      ]
    },
    map: {
      eyebrow: 'Two ways we work with clubs',
      thin: 'One network.',
      bold: 'Two pathways.',
      nodes: [
        {id: 'us', label: 'USA'},
        {id: 'mx', label: 'Mexico'},
        {id: 'uk', label: 'United Kingdom'},
        {id: 'eu', label: 'Europe'}
      ],
      note: 'And the network keeps expanding to more countries.',
      card1: {
        tag: 'Clubs in the UK and Europe',
        thin: 'Recruitment you can',
        bold: 'trust.',
        p: 'Fully filtered talent, watched in person, ready to trial. We work with clubs across Mexico, USA and to pretty much all of Europe and the UK, with the network expanding to more countries.',
        pts: [
          'Players measured against your level before they reach you',
          'Eyes on the ground, not just highlight reels'
        ]
      },
      card2: {
        tag: 'Clubs registering to see players',
        thin: 'A window into',
        bold: 'our talent.',
        p: 'Any club in the world can create a profile and register to see our players. Especially valuable for European clubs looking for filtered, ready talent.',
        pts: [
          'A free profile for any club in the world',
          'Register to see our filtered, trial-ready players',
          'Built for European clubs seeking ready talent'
        ]
      }
    },
    people: {
      eyebrow: 'The people behind it',
      thin: 'Three careers',
      bold: 'behind every player.',
      lede: 'When they put a player in front of you, it carries their name. That is the whole promise.',
      james: {
        role: 'Founder & CEO',
        desc: 'Has spent thirty years in elite sport across 66 countries as a professional athlete, coach and manager, working alongside Olympic Gold Medalists, Wimbledon champions and world number ones. A University of Liverpool graduate, he brought that global experience into football, and is now registered with The Football Association in Talent Identification, the foundation Clearway is built on.'
      },
      cyril: {
        role: 'Director of European Football',
        desc: 'Spent over 15 years as a professional footballer in Ligue 1, playing for RC Lens, Girondins de Bordeaux, OGC Nice and Olympique de Marseille, and earned France Under-21 honours. That playing career became a second one off the pitch: he has represented and placed players across Europe and Mexico, and now brings that network and experience to Clearway.'
      },
      timo: {
        role: 'Director of USA & Mexico Football',
        desc: 'Spent over 15 years as a professional defender across Europe and Mexico, playing for Lyon, Nice, Saint-Étienne, Sevilla, Borussia Mönchengladbach and Tigres UANL, and won the UEFA Europa League with Sevilla. Having competed at the top level in Ligue 1, La Liga, the Bundesliga and Liga MX, he now leads talent identification and player assessment for Clearway across the USA and Mexico.'
      }
    },
    end: {
      eyebrow: 'The next signing starts here',
      thin: 'Tell us the player',
      bold: 'you are missing.',
      p: 'Five quick answers, and it reaches Clearway directly. We reply in person. No bots, no middlemen.',
      cta: 'Start your search',
      fine: 'Every enquiry is treated in confidence. No player is ever named publicly without permission.'
    },
    enq: {
      dialogLabel: 'Club enquiry',
      close: 'Close',
      step: 'Step',
      of: 'of',
      done: 'Done',
      s1: {kicker: 'Let us find your player', qa: 'Which club is', qb: 'this', qbold: 'for?', placeholder: 'Club name', err: 'Please tell us the club.'},
      s2: {kicker: 'Your level', qa: 'Country and', qbold: 'league.', placeholder: 'e.g. England, Championship', err: 'Please tell us where you are.'},
      s3: {kicker: 'The gap in your squad', qa: 'Who are you', qbold: 'looking for?', placeholder: 'e.g. Right back, U21, left footed', hint: 'One line is enough. You can be more specific later.'},
      s4: {kicker: 'Your timeline', qa: 'When do you', qbold: 'need them?', options: ['This window', 'Next window', 'Just exploring'], err: 'Pick one to continue.'},
      s5: {kicker: 'Where Clearway reaches you', qa: 'Your name', qb: 'and', qbold: 'email.', placeholderName: 'Your name', placeholderEmail: 'Your email', err: 'A name and a valid email, please.'},
      doneStep: {qa: 'Clearway', qbold: 'is on it.', p: 'Every enquiry goes straight to Clearway. We reply in person, in confidence. The search starts now.'},
      back: '← Back',
      send: 'Send to Clearway',
      continue: 'Continue'
    }
  },
  es: {
    hero: {
      eyebrow: 'Para clubes · Inglaterra y Europa',
      thin: 'Te enviamos la señal.',
      bold: 'No el ruido.',
      sub: 'Cada jugador ya filtrado, observado y verificado. Solo conoces a los que están listos para saltar a tu campo.',
      cta: 'Inicia tu búsqueda'
    },
    process: {
      eyebrow: 'El Proceso',
      thin: 'Seis pasos.',
      bold: 'Un camino claro.',
      items: [
        'Sube tu perfil.',
        'Lo revisamos y te contactamos para una conversación abierta.',
        'Si eres aceptado, comienzas el Clearway player pathway.',
        'Proceso de evaluación y preparación de tres meses.',
        'Si es posible, asistimos a tus entrenamientos y partidos.',
        'Trial garantizado.'
      ]
    },
    versus: {
      eyebrow: 'Lo que realmente obtienes',
      thin: 'Cada jugador,',
      bold: 'ya verificado.',
      stats: [
        {big: '7%', line: 'superan el filtro antes de ponerlos frente a ti'},
        {big: '3 meses', line: 'de evaluación real antes de cualquier prueba'},
        {big: 'En persona', line: 'observados en directo, sobre el terreno'},
        {big: 'Garantizado', line: 'la prueba está garantizada, el fichaje se gana'}
      ]
    },
    map: {
      eyebrow: 'Dos formas de trabajar con clubes',
      thin: 'Una red.',
      bold: 'Dos caminos.',
      nodes: [
        {id: 'us', label: 'USA'},
        {id: 'mx', label: 'México'},
        {id: 'uk', label: 'Reino Unido'},
        {id: 'eu', label: 'Europa'}
      ],
      note: 'Y la red sigue expandiéndose a más países.',
      card1: {
        tag: 'Clubes en Reino Unido y Europa',
        thin: 'Un reclutamiento en el que',
        bold: 'puedes confiar.',
        p: 'Talento totalmente filtrado, observado en persona, listo para la prueba. Trabajamos con clubes en México, USA y prácticamente toda Europa y el Reino Unido, con la red expandiéndose a más países.',
        pts: [
          'Jugadores medidos contra tu nivel antes de llegar a ti',
          'Ojos sobre el terreno, no solo vídeos de resúmenes'
        ]
      },
      card2: {
        tag: 'Clubes que se registran para ver jugadores',
        thin: 'Una ventana a',
        bold: 'nuestro talento.',
        p: 'Cualquier club del mundo puede crear un perfil y registrarse para ver a nuestros jugadores. Especialmente valioso para clubes europeos que buscan talento filtrado y listo.',
        pts: [
          'Un perfil gratuito para cualquier club del mundo',
          'Regístrate para ver a nuestros jugadores filtrados y listos',
          'Pensado para clubes europeos que buscan talento listo'
        ]
      }
    },
    people: {
      eyebrow: 'Las personas detrás',
      thin: 'Tres carreras',
      bold: 'detrás de cada jugador.',
      lede: 'Cuando ponen a un jugador frente a ti, lleva su nombre. Esa es toda la promesa.',
      james: {
        role: 'Fundador y CEO',
        desc: 'Ha pasado treinta años en el deporte de élite en 66 países como atleta profesional, entrenador y mánager, trabajando junto a medallistas de oro olímpicos, campeones de Wimbledon y números uno del mundo. Graduado de la Universidad de Liverpool, llevó esa experiencia global al fútbol y hoy está registrado en The Football Association en Identificación de Talento, la base sobre la que se construye Clearway.'
      },
      cyril: {
        role: 'Director de Fútbol Europeo',
        desc: 'Pasó más de 15 años como futbolista profesional en la Ligue 1, jugando para el RC Lens, Girondins de Burdeos, OGC Nice y Olympique de Marsella, y fue internacional con la selección Sub-21 de Francia. Esa carrera como jugador dio paso a una segunda fuera del campo: ha representado y colocado jugadores en Europa y México, y ahora aporta esa red y experiencia a Clearway.'
      },
      timo: {
        role: 'Director de Fútbol de Estados Unidos y México',
        desc: 'Pasó más de 15 años como defensa profesional en Europa y México, jugando para el Lyon, Niza, Saint-Étienne, Sevilla, Borussia Mönchengladbach y Tigres UANL, y ganó la UEFA Europa League con el Sevilla. Tras competir al máximo nivel en la Ligue 1, La Liga, la Bundesliga y la Liga MX, hoy lidera la identificación de talento y la evaluación de jugadores para Clearway en Estados Unidos y México.'
      }
    },
    end: {
      eyebrow: 'El próximo fichaje empieza aquí',
      thin: 'Dinos el jugador',
      bold: 'que te falta.',
      p: 'Cinco respuestas rápidas y llega directo a Clearway. Respondemos en persona. Sin bots, sin intermediarios.',
      cta: 'Inicia tu búsqueda',
      fine: 'Cada consulta se trata con confidencialidad. Ningún jugador se nombra públicamente sin permiso.'
    },
    enq: {
      dialogLabel: 'Consulta de club',
      close: 'Cerrar',
      step: 'Paso',
      of: 'de',
      done: 'Listo',
      s1: {kicker: 'Encontremos a tu jugador', qa: '¿Para qué club', qb: 'es', qbold: 'esto?', placeholder: 'Nombre del club', err: 'Dinos el club, por favor.'},
      s2: {kicker: 'Tu nivel', qa: 'País y', qbold: 'liga.', placeholder: 'p. ej. Inglaterra, Championship', err: 'Dinos dónde estás, por favor.'},
      s3: {kicker: 'El hueco en tu plantilla', qa: '¿A quién', qbold: 'buscas?', placeholder: 'p. ej. Lateral derecho, sub-21, zurdo', hint: 'Una línea basta. Podrás concretar más adelante.'},
      s4: {kicker: 'Tus plazos', qa: '¿Cuándo lo', qbold: 'necesitas?', options: ['Este mercado', 'Próximo mercado', 'Solo explorando'], err: 'Elige una para continuar.'},
      s5: {kicker: 'Dónde te contacta Clearway', qa: 'Tu nombre', qb: 'y', qbold: 'correo.', placeholderName: 'Tu nombre', placeholderEmail: 'Tu correo', err: 'Un nombre y un correo válido, por favor.'},
      doneStep: {qa: 'Clearway', qbold: 'se encarga.', p: 'Cada consulta llega directo a Clearway. Respondemos en persona y con confidencialidad. La búsqueda empieza ahora.'},
      back: '← Atrás',
      send: 'Enviar a Clearway',
      continue: 'Continuar'
    }
  }
};

const TOTAL = 5;

/* ===== Network map: markets where Clearway has clubs, drawn as a distributed
   web rather than a single route. Positions are normalised (0–1) to the world
   map background; the same coordinates drive both the HTML markers and the
   canvas links. ===== */
type MapPoint = {x: number; y: number};
const MAP_POS: Record<string, MapPoint> = {
  us: {x: 0.215, y: 0.43},
  mx: {x: 0.216, y: 0.567},
  uk: {x: 0.498, y: 0.327},
  eu: {x: 0.54, y: 0.39}
};
/* Every link is drawn faintly (the web); the transatlantic links also carry
   travelling pulses (the flow). */
const MAP_EDGES: Array<[string, string]> = [
  ['us', 'mx'],
  ['uk', 'eu'],
  ['mx', 'uk'],
  ['us', 'eu']
];
const MAP_FLOW: Array<[string, string]> = [
  ['mx', 'uk'],
  ['us', 'eu']
];

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
  const locale = useLocale();
  const c: Copy = COPY[locale === 'es' ? 'es' : 'en'];

  const rootRef = useRef<HTMLDivElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const enqCanvasRef = useRef<HTMLCanvasElement>(null);
  const enqBodyRef = useRef<HTMLDivElement>(null);
  const travelBallRef = useRef<HTMLDivElement>(null);

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

  /* ===== Traveling ball — one persistent 3D ball whose FIXED position reacts to
     scroll progress: it advances left→right and bounces (parabolic arcs off a
     floor line that descends with scroll), so it appears to travel down the page
     with you. Pure position animation — the page scrolls normally, nothing is
     pinned, sticky or scroll-jacked. ===== */
  useEffect(() => {
    const ball = travelBallRef.current;
    if (!ball) return;
    let raf = 0;

    const place = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const max = Math.max(1, docH - vh);
      const p = Math.max(0, Math.min(1, window.scrollY / max));

      // Ball footprint scales with the viewport (see .travelBall clamp).
      const size = Math.max(70, Math.min(120, vw * 0.08));
      const marginX = Math.max(16, vw * 0.05);
      const clampX = (v: number) =>
        Math.max(marginX, Math.min(vw - size - marginX, v));

      // A clear resting Y inside a section, given its text block: prefer the
      // clear band below the text, else above it, else the section's bottom edge.
      // Measured from the DOM so it holds at any screen size.
      const clearRestY = (sectionRect: DOMRect, textRect: DOMRect) => {
        const gapBelow = sectionRect.bottom - textRect.bottom;
        const gapAbove = textRect.top - sectionRect.top;
        if (gapBelow >= size + 20) return textRect.bottom + gapBelow * 0.5 - size / 2;
        if (gapAbove >= size + 20) return sectionRect.top + gapAbove * 0.5 - size / 2;
        return sectionRect.bottom - size - 12;
      };

      // Traveling trajectory (takes over once scrolling): sweep from the right
      // across to the left, bouncing in parabolic arcs off a descending floor.
      const travelX = clampX(
        vw * 0.72 - p * (vw * 0.46) + Math.sin(p * Math.PI * 3) * (vw * 0.08)
      );
      const bounces = 5;
      const bt = (p * bounces) % 1;
      const arc = 4 * bt * (1 - bt); // 0 at each floor contact, 1 at the apex
      const floorY = vh * 0.5 + p * (vh * 0.28);
      const apex = Math.min(vh * 0.3, 260);
      const travelY = floorY - arc * apex - size / 2;

      let x = travelX;
      let y = travelY;

      // Hero rest (before any scroll): a clear zone that never overlaps the
      // headline. Blend into the travel trajectory over the first sliver of scroll.
      const hero = document.getElementById('hero');
      const stage = hero
        ? hero.querySelector<HTMLElement>('.' + styles.heroStage)
        : null;
      if (hero && stage) {
        const t = Math.min(1, p / 0.05);
        if (t < 1) {
          const restY = clearRestY(
            hero.getBoundingClientRect(),
            stage.getBoundingClientRect()
          );
          const restX = clampX(vw * 0.72);
          x = restX + (travelX - restX) * t;
          y = restY + (travelY - restY) * t;
        }
      }

      // Closing section: the ball keeps its natural bounce trajectory, but while
      // the framed module is in view it is bounded to that frame — the same way it
      // stays within the viewport on the rest of the page. It is not pinned to a
      // fixed decorative spot; it just settles inside the frame along its path.
      const endEl = document.getElementById('enquiry');
      const endCard = endEl
        ? endEl.querySelector<HTMLElement>('.' + styles.endCard)
        : null;
      let fade = 1;
      if (endEl && endCard) {
        const cr = endCard.getBoundingClientRect();
        const enter = Math.max(0, Math.min(1, (vh * 0.95 - cr.top) / (vh * 0.6)));
        if (enter > 0) {
          const inset = size * 0.5 + 10;
          const fx = Math.max(cr.left + inset, Math.min(cr.right - inset, x));
          const fy = Math.max(cr.top + inset, Math.min(cr.bottom - inset, y));
          x = x + (fx - x) * enter;
          y = y + (fy - y) * enter;
        }
        // No fade on entry or within the section; fade only as the section scrolls
        // up out of view (into the footer).
        fade = Math.max(0, Math.min(1, endEl.getBoundingClientRect().bottom / (vh * 0.4)));
      }

      ball.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ball.style.opacity = String(fade);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(place);
    };

    place();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

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
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function arcPoint(a: MapPoint, b: MapPoint, p: number) {
      const cx2 = (a.x + b.x) / 2;
      // Lift the control point with edge length, so long transatlantic links
      // arc higher than the short intra-region ones.
      const lift = 0.1 + 0.34 * Math.hypot(b.x - a.x, b.y - a.y);
      const cy = Math.min(a.y, b.y) - lift;
      const mt = 1 - p;
      return {
        x: (mt * mt * a.x + 2 * mt * p * cx2 + p * p * b.x) * W,
        y: (mt * mt * a.y + 2 * mt * p * cy + p * p * b.y) * H
      };
    }
    function loop() {
      ctx!.clearRect(0, 0, W, H);
      t += 0.006;
      // The whole web, drawn faint: the map reads as a distributed network of
      // markets rather than a single route.
      ctx!.strokeStyle = 'rgba(208,216,226,0.16)';
      ctx!.lineWidth = 1.2;
      for (const [aK, bK] of MAP_EDGES) {
        const a = MAP_POS[aK];
        const b = MAP_POS[bK];
        ctx!.beginPath();
        for (let p = 0; p <= 1; p += 0.02) {
          const pt = arcPoint(a, b, p);
          if (p === 0) ctx!.moveTo(pt.x, pt.y);
          else ctx!.lineTo(pt.x, pt.y);
        }
        ctx!.stroke();
      }
      // Pulses flow along the transatlantic links to keep the network alive.
      MAP_FLOW.forEach(([aK, bK], ei) => {
        const a = MAP_POS[aK];
        const b = MAP_POS[bK];
        for (let k = 0; k < 2; k++) {
          const p = (t + k / 2 + ei * 0.25) % 1;
          for (let s = 0; s < 6; s++) {
            const ps = Math.max(0, p - s * 0.02);
            const sp = arcPoint(a, b, ps);
            ctx!.beginPath();
            ctx!.arc(sp.x, sp.y, 3 - s * 0.4, 0, 6.28);
            ctx!.fillStyle = `rgba(208,216,226,${0.5 - s * 0.08})`;
            ctx!.fill();
          }
          const pt = arcPoint(a, b, p);
          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, 3.2, 0, 6.28);
          ctx!.fillStyle = '#fff';
          ctx!.shadowColor = 'rgba(208,216,226,0.9)';
          ctx!.shadowBlur = 12;
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }
      });
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
  const stepLabel =
    cur >= TOTAL
      ? c.enq.done
      : `${c.enq.step} ${Math.min(cur + 1, TOTAL)} ${c.enq.of} ${TOTAL}`;

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

      {/* TRAVELING BALL — one persistent 3D ball, fixed, repositioned on scroll
          (bouncing arcs). Decorative; never blocks scroll or clicks. */}
      <div ref={travelBallRef} className={cx('travelBall')} aria-hidden="true">
        <Ball3D />
      </div>

      {/* NAV — shared header with the "Start your search" pill next to the
          menu on the right. */}
      <SiteHeader cta={{type: 'clubs', onClick: openEnq}} />

      {/* HERO — static, normal scroll (no scroll-jacking / parallax) */}
      <section className={cx('hero')} id="hero">
        <div className={cx('heroSticky')}>
          <div className={cx('heroGlow')} aria-hidden />
          <div className={cx('eyebrow', 'heroEyebrow')}>
            {c.hero.eyebrow}
          </div>
          <div className={cx('heroStage')}>
            <div className={cx('heroIntro')}>
              <h1 className={cx('heroTitle')}>
                <span className={cx('thin')}>{c.hero.thin}</span>{' '}
                <b>{c.hero.bold}</b>
              </h1>
              <p className={cx('heroSub')}>{c.hero.sub}</p>
              <button
                type="button"
                className={cx('hbtn', 'hbtnSolid', 'heroCtaBtn')}
                onClick={openEnq}
              >
                {c.hero.cta} <span className={cx('arr')}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROCESS */}
      <section className={cx('process')}>
        <div className={cx('wrap')}>
          <div className={cx('processHead', 'reveal')}>
            <div className={cx('eyebrow')}>{c.process.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.process.thin}</span>
              <br />
              <b>{c.process.bold}</b>
            </h2>
          </div>
          <ol className={cx('processList')}>
            {c.process.items.map((item, i) => (
              <li
                key={i}
                className={cx('processStep', 'reveal')}
                data-d={String((i % 3) + 1)}
              >
                <span className={cx('processNum')} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHAT YOU GET — positive stat + statement blocks */}
      <section className={cx('versus')} id="how">
        <div className={cx('wrap')}>
          <div className={cx('versusHead', 'reveal')}>
            <div className={cx('eyebrow')}>{c.versus.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.versus.thin}</span>{' '}
              <b>{c.versus.bold}</b>
            </h2>
          </div>
          <div className={cx('statBoard')}>
            {c.versus.stats.map((s, i) => (
              <div
                key={i}
                className={cx('statBlock', 'reveal')}
                data-d={String((i % 3) + 1)}
              >
                <div className={cx('statBig')}>{s.big}</div>
                <p className={cx('statLine')}>{s.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO PATHWAYS */}
      <section className={cx('aud')}>
        <div className={cx('wrap')}>
          <div className={cx('head', 'reveal')}>
            <div className={cx('eyebrow')}>{c.map.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.map.thin}</span> <b>{c.map.bold}</b>
            </h2>
          </div>
          <div className={cx('mapStage', 'reveal')} data-d="1">
            <canvas ref={mapCanvasRef} className={cx('mapCanvas')} aria-hidden />
            {c.map.nodes.map((n) => {
              const pos = MAP_POS[n.id];
              return (
                <div
                  key={n.id}
                  className={cx('mapNode', pos.x > 0.42 && 'mapNodeRight')}
                  style={{left: `${pos.x * 100}%`, top: `${pos.y * 100}%`}}
                >
                  <span className={cx('mnDot')} />
                  <span className={cx('mnLabel')}>{n.label}</span>
                </div>
              );
            })}
          </div>
          <p className={cx('mapNote', 'reveal')} data-d="2">{c.map.note}</p>
          <div className={cx('mapCards')}>
            <div className={cx('mapCard', 'reveal')} data-d="1">
              <div className={cx('mcTop')}>
                <span className={cx('mcNum')}>01</span>
                <span className={cx('mcTag')}>{c.map.card1.tag}</span>
              </div>
              <h3>
                <span className={cx('thin')}>{c.map.card1.thin}</span>{' '}
                <b>{c.map.card1.bold}</b>
              </h3>
              <p>{c.map.card1.p}</p>
              <ul className={cx('pts')}>
                {c.map.card1.pts.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
            <div className={cx('mapCard', 'reveal')} data-d="2">
              <div className={cx('mcTop')}>
                <span className={cx('mcNum')}>02</span>
                <span className={cx('mcTag')}>{c.map.card2.tag}</span>
              </div>
              <h3>
                <span className={cx('thin')}>{c.map.card2.thin}</span>{' '}
                <b>{c.map.card2.bold}</b>
              </h3>
              <p>{c.map.card2.p}</p>
              <ul className={cx('pts')}>
                {c.map.card2.pts.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE PEOPLE */}
      <section className={cx('people')}>
        <div className={cx('wrap')}>
          <div className={cx('peopleHead', 'reveal')}>
            <div className={cx('eyebrow')}>{c.people.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.people.thin}</span>
              <br />
              <b>{c.people.bold}</b>
            </h2>
            <p className={cx('lede')}>{c.people.lede}</p>
          </div>
          <div className={cx('teamGrid')}>
            <div className={cx('tcard', 'reveal')} data-d="1">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/james.webp" alt="James Fox" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>James</span> Fox
                </div>
                <div className={cx('trole')}>{c.people.james.role}</div>
                <p className={cx('tdesc')}>{c.people.james.desc}</p>
              </div>
            </div>
            <div className={cx('tcard', 'reveal')} data-d="2">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cyril.webp" alt="Cyril Rool" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Cyril</span> Rool
                </div>
                <div className={cx('trole')}>{c.people.cyril.role}</div>
                <p className={cx('tdesc')}>{c.people.cyril.desc}</p>
              </div>
            </div>
            <div className={cx('tcard', 'reveal')} data-d="3">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/timothee.webp" alt="Timothée Kolodziejczak" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Timothée</span> Kolodziejczak
                </div>
                <div className={cx('trole')}>{c.people.timo.role}</div>
                <p className={cx('tdesc')}>{c.people.timo.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING — a contained closing card, inset from the page edges */}
      <section className={cx('end')} id="enquiry">
        <div className={cx('endCard')}>
          <div className={cx('endInner')}>
            <div className={cx('eyebrow', 'reveal')}>{c.end.eyebrow}</div>
            <h2 className={cx('reveal')} data-d="1">
              <span className={cx('thin')}>{c.end.thin}</span>{' '}
              <b>{c.end.bold}</b>
            </h2>
            <p className={cx('reveal')} data-d="2">{c.end.p}</p>
            <button
              type="button"
              className={cx('email', 'reveal')}
              data-d="2"
              onClick={openEnq}
            >
              {c.end.cta} <span className={cx('arr')}>→</span>
            </button>
            <div className={cx('discreet', 'reveal')} data-d="3">
              {c.end.fine}
            </div>
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
        <div className={cx('enqModal')} role="dialog" aria-modal="true" aria-label={c.enq.dialogLabel}>
          <button
            type="button"
            className={cx('enqClose')}
            aria-label={c.enq.close}
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
              <div className={cx('enqKicker')}>{c.enq.s1.kicker}</div>
              <h3>
                {c.enq.s1.qa}
                <br />
                {c.enq.s1.qb} <b>{c.enq.s1.qbold}</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput', flagged.has('club') && 'err')}
                placeholder={c.enq.s1.placeholder}
                autoComplete="off"
                value={data.club}
                onChange={(e) => setField('club', e.target.value)}
              />
              <div className={cx('enqErr', errors.club && 'show')}>
                {c.enq.s1.err}
              </div>
            </div>
            {/* step 2 */}
            <div className={stepCls(1)}>
              <div className={cx('enqKicker')}>{c.enq.s2.kicker}</div>
              <h3>
                {c.enq.s2.qa}
                <br />
                <b>{c.enq.s2.qbold}</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput', flagged.has('region') && 'err')}
                placeholder={c.enq.s2.placeholder}
                autoComplete="off"
                value={data.region}
                onChange={(e) => setField('region', e.target.value)}
              />
              <div className={cx('enqErr', errors.region && 'show')}>
                {c.enq.s2.err}
              </div>
            </div>
            {/* step 3 */}
            <div className={stepCls(2)}>
              <div className={cx('enqKicker')}>{c.enq.s3.kicker}</div>
              <h3>
                {c.enq.s3.qa}
                <br />
                <b>{c.enq.s3.qbold}</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput')}
                placeholder={c.enq.s3.placeholder}
                autoComplete="off"
                value={data.profile}
                onChange={(e) => setField('profile', e.target.value)}
              />
              <div className={cx('enqHint')}>{c.enq.s3.hint}</div>
            </div>
            {/* step 4 */}
            <div className={stepCls(3)}>
              <div className={cx('enqKicker')}>{c.enq.s4.kicker}</div>
              <h3>
                {c.enq.s4.qa}
                <br />
                <b>{c.enq.s4.qbold}</b>
              </h3>
              <div className={cx('enqChips')}>
                {c.enq.s4.options.map((opt) => (
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
                {c.enq.s4.err}
              </div>
            </div>
            {/* step 5 */}
            <div className={stepCls(4)}>
              <div className={cx('enqKicker')}>{c.enq.s5.kicker}</div>
              <h3>
                {c.enq.s5.qa}
                <br />
                {c.enq.s5.qb} <b>{c.enq.s5.qbold}</b>
              </h3>
              <input
                type="text"
                className={cx('enqInput', flagged.has('name') && 'err')}
                placeholder={c.enq.s5.placeholderName}
                autoComplete="off"
                value={data.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              <input
                type="email"
                className={cx('enqInput', flagged.has('email') && 'err')}
                placeholder={c.enq.s5.placeholderEmail}
                autoComplete="off"
                style={{marginTop: 14}}
                value={data.email}
                onChange={(e) => setField('email', e.target.value)}
              />
              <div className={cx('enqErr', errors.contact && 'show')}>
                {c.enq.s5.err}
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
                {c.enq.doneStep.qa}
                <br />
                <b>{c.enq.doneStep.qbold}</b>
              </h3>
              <p>{c.enq.doneStep.p}</p>
            </div>
          </div>

          {cur < TOTAL && (
            <div className={cx('enqFoot')}>
              <button
                type="button"
                className={cx('enqBack', cur > 0 && 'show')}
                onClick={() => cur > 0 && goTo(cur - 1)}
              >
                {c.enq.back}
              </button>
              <button type="button" className={cx('enqNext')} onClick={validateAndNext}>
                {cur === TOTAL - 1 ? c.enq.send : c.enq.continue}{' '}
                <span className={cx('arr')}>→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
