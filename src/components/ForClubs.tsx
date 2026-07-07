'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';

import {Link} from '@/i18n/navigation';
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
    cost: {
      eyebrow: 'The cost of the old way',
      thin: '93 trials',
      bold: 'nobody needed.',
      items: [
        {
          title: 'Wasted trials',
          desc: 'Flights, hotels and staff time spent on players who were never close to your level.'
        },
        {
          title: 'No eyes on the ground',
          desc: 'Decisions made on edited highlight reels, with no one who has watched the player live.'
        },
        {
          title: 'The paperwork wall',
          desc: 'Work permits and GBE points that sink a signing months after you committed to it.'
        }
      ]
    },
    versus: {
      eyebrow: 'What you actually get',
      thin: 'The old way',
      bold: 'gets a red card.',
      oldTag: 'The old way',
      oldItems: [
        'Hundreds of unfiltered CVs and reels',
        'Trials booked on a hunch',
        'No one watching live',
        'Paperwork discovered too late',
        'You carry all the risk'
      ],
      oldFoot: 'Off the pitch',
      clearTag: 'The Clearway way',
      clearItems: [
        'Only the 7% that clear the filter',
        'Three months of real evaluation first',
        'Watched in person, on the ground',
        'Work permit and GBE cleared up front',
        'The trial is guaranteed, the signing is earned'
      ],
      clearFoot: 'Cleared to play'
    },
    map: {
      eyebrow: 'Two ways we work with clubs',
      thin: 'One network.',
      bold: 'Two pathways.',
      ukNode: 'England and Europe',
      mxNode: 'Mexico and Texas',
      card1: {
        tag: 'Clubs in the UK and Europe',
        thin: 'Recruitment you can',
        bold: 'actually trust.',
        p: 'Fully filtered talent, watched in person, ready to trial. We do the first 93 rejections so your staff only meet the seven.',
        pts: [
          'Players measured against your level before they reach you',
          'Eyes on the ground, not just highlight reels',
          'Work permit and GBE handled end to end'
        ]
      },
      card2: {
        tag: 'Clubs in Mexico and Texas',
        thin: 'Your door into',
        bold: 'European football.',
        p: 'A direct bridge to clubs across England and Europe, and the partnerships that come with being inside the network rather than outside it.',
        pts: [
          'A real pathway for your players into Europe',
          'Partnerships with clubs already in the network',
          'The same filter, working in your favour'
        ]
      }
    },
    people: {
      eyebrow: 'The people behind it',
      thin: 'Clearway is not a directory.',
      bold: 'It is three careers.',
      lede: 'When they put a player in front of you, it carries their name. That is the whole promise.',
      james: {
        role: 'Founder and CEO',
        desc: 'FA-registered in Talent Identification, with access to 100+ clubs across England and Europe.'
      },
      cyril: {
        role: 'Director of European Football',
        desc: '15+ years in Ligue 1 — Lens, Bordeaux, Nice and Marseille. France U21 international.'
      },
      timo: {
        role: 'Director of USA and Mexico Football',
        desc: 'Former French professional defender with fifteen years at Lyon, Nice, Saint-Étienne, Sevilla, Borussia Mönchengladbach and Tigres. UEFA Europa League winner. He leads talent identification across the USA and Mexico.'
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
    cost: {
      eyebrow: 'El coste del método antiguo',
      thin: '93 pruebas',
      bold: 'que nadie necesitaba.',
      items: [
        {
          title: 'Pruebas desperdiciadas',
          desc: 'Vuelos, hoteles y horas de tu staff invertidos en jugadores que nunca estuvieron cerca de tu nivel.'
        },
        {
          title: 'Sin ojos sobre el terreno',
          desc: 'Decisiones tomadas sobre vídeos de resúmenes editados, sin nadie que haya visto al jugador en directo.'
        },
        {
          title: 'El muro burocrático',
          desc: 'Permisos de trabajo y puntos GBE que hunden un fichaje meses después de haberte comprometido.'
        }
      ]
    },
    versus: {
      eyebrow: 'Lo que realmente obtienes',
      thin: 'El método antiguo',
      bold: 've la tarjeta roja.',
      oldTag: 'El método antiguo',
      oldItems: [
        'Cientos de CVs y vídeos sin filtrar',
        'Pruebas reservadas por corazonada',
        'Nadie viendo en directo',
        'Papeleo descubierto demasiado tarde',
        'Tú cargas con todo el riesgo'
      ],
      oldFoot: 'Fuera del campo',
      clearTag: 'El método Clearway',
      clearItems: [
        'Solo el 7% que supera el filtro',
        'Tres meses de evaluación real primero',
        'Observados en persona, sobre el terreno',
        'Permiso de trabajo y GBE resueltos de antemano',
        'La prueba está garantizada, el fichaje se gana'
      ],
      clearFoot: 'Listos para jugar'
    },
    map: {
      eyebrow: 'Dos formas de trabajar con clubes',
      thin: 'Una red.',
      bold: 'Dos caminos.',
      ukNode: 'Inglaterra y Europa',
      mxNode: 'México y Texas',
      card1: {
        tag: 'Clubes en Reino Unido y Europa',
        thin: 'Un reclutamiento en el que',
        bold: 'sí puedes confiar.',
        p: 'Talento totalmente filtrado, observado en persona, listo para la prueba. Nosotros hacemos los primeros 93 descartes para que tu staff solo conozca a los siete.',
        pts: [
          'Jugadores medidos contra tu nivel antes de llegar a ti',
          'Ojos sobre el terreno, no solo vídeos de resúmenes',
          'Permiso de trabajo y GBE gestionados de principio a fin'
        ]
      },
      card2: {
        tag: 'Clubes en México y Texas',
        thin: 'Tu puerta al',
        bold: 'fútbol europeo.',
        p: 'Un puente directo a clubes en Inglaterra y Europa, y las alianzas que solo llegan cuando estás dentro de la red y no fuera de ella.',
        pts: [
          'Un camino real para tus jugadores hacia Europa',
          'Alianzas con clubes que ya están en la red',
          'El mismo filtro, trabajando a tu favor'
        ]
      }
    },
    people: {
      eyebrow: 'Las personas detrás',
      thin: 'Clearway no es un directorio.',
      bold: 'Son tres carreras.',
      lede: 'Cuando ponen a un jugador frente a ti, lleva su nombre. Esa es toda la promesa.',
      james: {
        role: 'Fundador y CEO',
        desc: 'Registrado en la FA en Identificación de Talento, con acceso a más de 100 clubes en Inglaterra y Europa.'
      },
      cyril: {
        role: 'Director de Fútbol Europeo',
        desc: 'Más de 15 años en la Ligue 1 — Lens, Burdeos, Niza y Marsella. Internacional sub-21 con Francia.'
      },
      timo: {
        role: 'Director de Fútbol de Estados Unidos y México',
        desc: 'Exdefensa profesional francés con quince años en Lyon, Niza, Saint-Étienne, Sevilla, Borussia Mönchengladbach y Tigres. Campeón de la UEFA Europa League. Lidera la identificación de talento en Estados Unidos y México.'
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
    const MX = {x: 0.216, y: 0.567};
    const UK = {x: 0.498, y: 0.327};
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
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

      {/* THE COST */}
      <section className={cx('cost')}>
        <div className={cx('wrap')}>
          <div className={cx('costHead', 'reveal')}>
            <div className={cx('eyebrow')}>{c.cost.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.cost.thin}</span>
              <br />
              <b>{c.cost.bold}</b>
            </h2>
          </div>
          <div className={cx('costList')}>
            <div className={cx('costRow', 'reveal')} data-d="1">
              <div className={cx('costBig')} aria-hidden="true">
                <span className={cx('costIcon', 'costIconMoney')} />
              </div>
              <div className={cx('costTxt')}>
                <h3>{c.cost.items[0].title}</h3>
                <p>{c.cost.items[0].desc}</p>
              </div>
            </div>
            <div className={cx('costRow', 'reveal')} data-d="2">
              <div className={cx('costBig')} aria-hidden="true">
                <span className={cx('costIcon', 'costIconVisual')} />
              </div>
              <div className={cx('costTxt')}>
                <h3>{c.cost.items[1].title}</h3>
                <p>{c.cost.items[1].desc}</p>
              </div>
            </div>
            <div className={cx('costRow', 'reveal')} data-d="3">
              <div className={cx('costBig')} aria-hidden="true">
                <span className={cx('costIcon', 'costIconSign')} />
              </div>
              <div className={cx('costTxt')}>
                <h3>{c.cost.items[2].title}</h3>
                <p>{c.cost.items[2].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OLD VS CLEARWAY */}
      <section className={cx('versus')} id="how">
        <div className={cx('wrap')}>
          <div className={cx('versusHead', 'reveal')}>
            <div className={cx('eyebrow')}>{c.versus.eyebrow}</div>
            <h2>
              <span className={cx('thin')}>{c.versus.thin}</span>{' '}
              <b>{c.versus.bold}</b>
            </h2>
          </div>
          <div className={cx('cardsBoard', 'reveal')} data-d="1">
            <div className={cx('refCard', 'refRed')}>
              <div className={cx('refCardTop')}>
                <span className={cx('refTag')}>{c.versus.oldTag}</span>
                <span className={cx('refMark')}>✕</span>
              </div>
              <ul>
                {c.versus.oldItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className={cx('refFoot')}>{c.versus.oldFoot}</div>
            </div>
            <div className={cx('refCard', 'refGreen')}>
              <div className={cx('refCardTop')}>
                <span className={cx('refTag')}>{c.versus.clearTag}</span>
                <span className={cx('refMark')}>✓</span>
              </div>
              <ul>
                {c.versus.clearItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className={cx('refFoot')}>{c.versus.clearFoot}</div>
            </div>
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
            <div className={cx('mapNode', 'mapNodeUk')}>
              <span className={cx('mnDot')} />
              <span className={cx('mnLabel')}>{c.map.ukNode}</span>
            </div>
            <div className={cx('mapNode', 'mapNodeMx')}>
              <span className={cx('mnDot')} />
              <span className={cx('mnLabel')}>{c.map.mxNode}</span>
            </div>
          </div>
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
