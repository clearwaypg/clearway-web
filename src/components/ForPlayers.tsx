'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';

import {Link} from '@/i18n/navigation';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';
import styles from './ForPlayers.module.css';

/* Join scoped module classes by their guide names, dropping falsy values. */
const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

/* Length only — used for step navigation logic. Display names come from COPY. */
const STEP_COUNT = 5;

type Copy = (typeof COPY)['en'];

const COPY = {
  en: {
    hero: {
      chapter: 'The invisible player',
      hl1a: 'You can be ',
      hl1b: 'good',
      hl2: 'and still',
      hl3: 'never get seen.',
      leadA: 'Measured against the same standard a professional club uses. ',
      leadB: 'Most do not meet it yet.',
      stat1: 'past the filter',
      stat2: 'clubs in Europe',
      cue: 'The story begins'
    },
    card: {
      namePlaceholder: 'Write your name',
      nameAria: 'Your name',
      euPass: 'EU PASS',
      ageCat: 'AGE CAT',
      position: 'POSITION',
      ctaAria: 'This could be your card. Build it',
      ctaA: 'This could be your card. ',
      ctaB: 'Build it →',
      note: 'Free to build · Players from Mexico and the world'
    },
    truth: {
      headA: 'The bit ',
      headB: 'others skip.',
      c1t: 'Your trial is real',
      c1a: 'Some charge you to stand on a pitch and hope someone watches. ',
      c1b: 'Yours is with a club that already said they want to see you.',
      c2t: 'What it costs, plainly',
      c2a: 'Building your profile is free. ',
      c2b: 'The three month evaluation has a cost',
      c2c: ', written into a Clearway contract. You cover your video and travel.',
      c3t: 'What we promise',
      c3a: 'We guarantee the ',
      c3b: 'trial, not the signing',
      c3c: '. Nobody can guarantee a signing. What we promise is the door, and the work permit and GBE paperwork for England.'
    },
    guides: {
      headA: 'Not a ',
      headThin: 'form in a folder.',
      headIt: 'People who have done this.',
      jamesRole: 'Founder and CEO',
      jamesDesc:
        'FA-registered in Talent Identification, with access to 100+ clubs across England and Europe.',
      cyrilRole: 'Director of European Football',
      cyrilDesc:
        '15+ years in Ligue 1 — Lens, Bordeaux, Nice and Marseille. France U21 international.',
      timoRole: 'Director of USA and Mexico Football',
      timoDesc:
        'Former French professional defender with fifteen years at Lyon, Nice, Saint-Étienne, Sevilla, Borussia Mönchengladbach and Tigres. UEFA Europa League winner. He leads talent identification across the USA and Mexico.'
    },
    filter: {
      h2a: 'Seven of ',
      h2thin: 'every hundred',
      h2it: 'go through.',
      p: 'That number is low on purpose. It is not us being difficult, it is us being transparent about what professional football actually asks for. We would rather tell you the truth early than waste your summer.',
      ctaA: 'Think you are one of the seven? ',
      ctaB: 'Show us →'
    },
    ribbon:
      'Access to 100+ clubs · England · Spain · France · Italy · Germany · Austria · Belgium · Hungary',
    close: {
      h2a: 'From invisible ',
      h2it: 'to seen.',
      p: 'Build your profile. If it fits, you will hear from the Clearway team. If it does not, you will hear that too. Either way, no guessing.',
      cta: 'Build my profile'
    },
    modal: {
      kick: 'Player application · Clearway',
      title: 'Build your player profile',
      close: 'Close',
      steps: [
        'The essentials',
        'Who you are',
        'Your game',
        'Your record',
        'Your footage'
      ],
      stepWord: 'Step',
      ofWord: 'of',
      sent: 'Application sent',
      positionLabel: 'Main position',
      positionPh: 'e.g. Striker, Centre back',
      ageLabel: 'Age category',
      agePh: 'U17, U20, senior',
      euLabel: 'Do you hold a European or EU passport?',
      euOptions: ['Yes', 'No', 'In process'],
      euHint: 'This changes how we place you. There is a pathway either way.',
      natLabel: 'Sporting nationality',
      natPh: 'e.g. Mexican, Spanish, dual',
      nameLabel: 'Full name',
      dobLabel: 'Date of birth',
      dobPh: 'DD/MM/YYYY',
      countryLabel: 'Current country',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      repLabel: 'Do you currently have a representative or agent?',
      repOptions: ['Yes', 'No'],
      secPosLabel: 'Secondary position',
      footLabel: 'Strong foot',
      footPh: 'Left / Right / Both',
      heightLabel: 'Height (cm)',
      weightLabel: 'Weight (kg)',
      clubLabel: 'Current club and league',
      prevLabel: 'Previous clubs',
      levelLabel: 'Level',
      levelPh: 'Amateur / Semipro / Pro',
      seasonLabel: 'This season (games, goals, assists)',
      videoLabel: 'Video links (YouTube, Vimeo or Drive)',
      videoPh: 'Paste one or more, separated by commas',
      videoHint: 'The more match footage the better. This is what matters most.',
      igLabel: 'Instagram',
      coachLabel: 'Coach reference and contact',
      consent1a: 'I accept the ',
      privacyLink: 'Privacy Policy',
      consent1mid: ' and ',
      termsLink: 'Terms',
      consent1end: '.',
      consent2:
        'I am over 18, or a parent or guardian authorises this application and will be the contact.',
      back: 'Back',
      send: 'Send to Clearway →',
      next: 'Next →',
      successTitle: 'That is your profile.',
      successBody:
        'This is what the Clearway team sees. If it fits what a club is looking for, they get in touch themselves.',
      footNote:
        'Building your profile is free. The three month evaluation has a cost, set out in the Clearway contract. ',
      footTermsLink: 'Terms'
    }
  },
  es: {
    hero: {
      chapter: 'El jugador invisible',
      hl1a: 'Puedes ser ',
      hl1b: 'bueno',
      hl2: 'y aun así',
      hl3: 'nunca ser visto.',
      leadA: 'Medido con el mismo estándar que usa un club profesional. ',
      leadB: 'La mayoría todavía no lo alcanza.',
      stat1: 'superan el filtro',
      stat2: 'clubes en Europa',
      cue: 'Aquí empieza la historia'
    },
    card: {
      namePlaceholder: 'Escribe tu nombre',
      nameAria: 'Tu nombre',
      euPass: 'PASE UE',
      ageCat: 'CAT. EDAD',
      position: 'POSICIÓN',
      ctaAria: 'Esta podría ser tu tarjeta. Constrúyela',
      ctaA: 'Esta podría ser tu tarjeta. ',
      ctaB: 'Constrúyela →',
      note: 'Gratis de crear · Jugadores de México y del mundo'
    },
    truth: {
      headA: 'La parte ',
      headB: 'que otros omiten.',
      c1t: 'Tu prueba es real',
      c1a: 'Algunos te cobran por pisar un campo y esperar que alguien te mire. ',
      c1b: 'La tuya es con un club que ya dijo que quiere verte.',
      c2t: 'Lo que cuesta, sin rodeos',
      c2a: 'Crear tu perfil es gratis. ',
      c2b: 'La evaluación de tres meses tiene un costo',
      c2c: ', fijado en un contrato de Clearway. Tú cubres tu video y tus viajes.',
      c3t: 'Lo que prometemos',
      c3a: 'Garantizamos la ',
      c3b: 'prueba, no el fichaje',
      c3c: '. Nadie puede garantizar un fichaje. Lo que prometemos es la puerta, y los trámites del permiso de trabajo y la GBE para Inglaterra.'
    },
    guides: {
      headA: 'No es un ',
      headThin: 'formulario en un cajón.',
      headIt: 'Gente que ya lo ha hecho.',
      jamesRole: 'Fundador y CEO',
      jamesDesc:
        'Registrado en la FA en Identificación de Talento, con acceso a más de 100 clubes en Inglaterra y Europa.',
      cyrilRole: 'Director de Fútbol Europeo',
      cyrilDesc:
        'Más de 15 años en la Ligue 1 — Lens, Bordeaux, Nice y Marseille. Internacional sub-21 con Francia.',
      timoRole: 'Director de Fútbol de EE. UU. y México',
      timoDesc:
        'Exdefensa profesional francés con quince años en Lyon, Nice, Saint-Étienne, Sevilla, Borussia Mönchengladbach y Tigres. Campeón de la UEFA Europa League. Lidera la identificación de talento en EE. UU. y México.'
    },
    filter: {
      h2a: 'Siete de ',
      h2thin: 'cada cien',
      h2it: 'pasan.',
      p: 'Ese número es bajo a propósito. No es que seamos difíciles, es que somos transparentes sobre lo que el fútbol profesional realmente exige. Preferimos decirte la verdad pronto antes que desperdiciar tu verano.',
      ctaA: '¿Crees que eres uno de los siete? ',
      ctaB: 'Demuéstralo →'
    },
    ribbon:
      'Acceso a más de 100 clubes · Inglaterra · España · Francia · Italia · Alemania · Austria · Bélgica · Hungría',
    close: {
      h2a: 'De invisible ',
      h2it: 'a visto.',
      p: 'Crea tu perfil. Si encaja, el equipo de Clearway te contactará. Si no, también lo sabrás. En cualquier caso, sin adivinanzas.',
      cta: 'Crear mi perfil'
    },
    modal: {
      kick: 'Solicitud de jugador · Clearway',
      title: 'Crea tu perfil de jugador',
      close: 'Cerrar',
      steps: ['Lo esencial', 'Quién eres', 'Tu juego', 'Tu trayectoria', 'Tu video'],
      stepWord: 'Paso',
      ofWord: 'de',
      sent: 'Solicitud enviada',
      positionLabel: 'Posición principal',
      positionPh: 'p. ej. Delantero, Defensa central',
      ageLabel: 'Categoría de edad',
      agePh: 'Sub-17, Sub-20, absoluta',
      euLabel: '¿Tienes pasaporte europeo o de la UE?',
      euOptions: ['Sí', 'No', 'En trámite'],
      euHint: 'Esto cambia cómo te ubicamos. Hay un camino en cualquier caso.',
      natLabel: 'Nacionalidad deportiva',
      natPh: 'p. ej. mexicana, española, doble',
      nameLabel: 'Nombre completo',
      dobLabel: 'Fecha de nacimiento',
      dobPh: 'DD/MM/AAAA',
      countryLabel: 'País actual',
      emailLabel: 'Correo electrónico',
      whatsappLabel: 'WhatsApp',
      repLabel: '¿Tienes actualmente un representante o agente?',
      repOptions: ['Sí', 'No'],
      secPosLabel: 'Posición secundaria',
      footLabel: 'Pie hábil',
      footPh: 'Izquierdo / Derecho / Ambos',
      heightLabel: 'Estatura (cm)',
      weightLabel: 'Peso (kg)',
      clubLabel: 'Club y liga actuales',
      prevLabel: 'Clubes anteriores',
      levelLabel: 'Nivel',
      levelPh: 'Amateur / Semipro / Pro',
      seasonLabel: 'Esta temporada (partidos, goles, asistencias)',
      videoLabel: 'Enlaces de video (YouTube, Vimeo o Drive)',
      videoPh: 'Pega uno o varios, separados por comas',
      videoHint: 'Cuanto más metraje de partidos, mejor. Esto es lo que más importa.',
      igLabel: 'Instagram',
      coachLabel: 'Referencia y contacto de tu entrenador',
      consent1a: 'Acepto la ',
      privacyLink: 'Política de Privacidad',
      consent1mid: ' y los ',
      termsLink: 'Términos',
      consent1end: '.',
      consent2:
        'Soy mayor de 18 años, o un padre, madre o tutor autoriza esta solicitud y será el contacto.',
      back: 'Atrás',
      send: 'Enviar a Clearway →',
      next: 'Siguiente →',
      successTitle: 'Ese es tu perfil.',
      successBody:
        'Esto es lo que ve el equipo de Clearway. Si encaja con lo que busca un club, ellos mismos se ponen en contacto.',
      footNote:
        'Crear tu perfil es gratis. La evaluación de tres meses tiene un costo, establecido en el contrato de Clearway. ',
      footTermsLink: 'Términos'
    }
  }
};

export function ForPlayers() {
  const locale = useLocale();
  const c: Copy = COPY[locale === 'es' ? 'es' : 'en'];
  const [playing, setPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [card, setCard] = useState({name: '', pos: '', age: '', eu: ''});

  const pageRef = useRef<HTMLDivElement>(null);
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
    if (step < STEP_COUNT - 1) {
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
    ? c.modal.sent
    : `${c.modal.stepWord} ${step + 1} ${c.modal.ofWord} ${STEP_COUNT} · ${c.modal.steps[step]}`;

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

      {/* NAV — shared header with the "Build my profile" pill next to the menu
          on the right (opens the profile modal). */}
      <SiteHeader cta={{type: 'players', onClick: openModal}} />

      {/* ===== CAP 01 · HERO ===== */}
      <section className={cx('hero')} id="hero">
        <div className={cx('hero-bg')} aria-hidden="true" />
        <div className={cx('hero-inner')}>
        <div className={cx('stage')}>
          <div className={cx('chapter')}>{c.hero.chapter}</div>
          <div className={cx('headline')}>
            <span className={cx('hl', 'hl1', 'reveal-line')}>
              <span>
                {c.hero.hl1a}<b>{c.hero.hl1b}</b>
              </span>
            </span>
            <span className={cx('hl', 'hl2', 'reveal-line')}>
              <span>{c.hero.hl2}</span>
            </span>
            <span className={cx('hl', 'hl3', 'anim', 'd4')}>{c.hero.hl3}</span>
          </div>
          <div className={cx('undertext', 'anim', 'd5')}>
            <p className={cx('lead')}>
              {c.hero.leadA}
              <b>{c.hero.leadB}</b>
            </p>
            <div className={cx('stats')}>
              <div className={cx('stat')}>
                <div className={cx('n')}>7/100</div>
                <div className={cx('l')}>{c.hero.stat1}</div>
              </div>
              <div className={cx('stat')}>
                <div className={cx('n')}>100+</div>
                <div className={cx('l')}>{c.hero.stat2}</div>
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
                  placeholder={c.card.namePlaceholder}
                  aria-label={c.card.nameAria}
                />
              </div>
              <div className={cx('pcard-footer')}>
                <div className={cx('pcard-fc')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg><div className={cx('pcard-fc-lbl')}>{c.card.euPass}</div><div className={cx('pcard-fc-val')} id="cEu">{u(card.eu, '—')}</div></div>
                <div className={cx('pcard-fc')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><div className={cx('pcard-fc-lbl')}>{c.card.ageCat}</div><div className={cx('pcard-fc-val')} id="cAge">{u(card.age, '—')}</div></div>
                <div className={cx('pcard-fc')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg><div className={cx('pcard-fc-lbl')}>{c.card.position}</div><div className={cx('pcard-fc-val')}></div></div>
              </div>
            </div>
          </div>
          <div className={cx('card-cta-wrap')}>
            <span className={cx('card-cta-halo')} aria-hidden="true" />
            <button
              type="button"
              className={cx('card-cta')}
              onClick={openModal}
              aria-label={c.card.ctaAria}
            >
              <span className={cx('card-cta-text')} aria-hidden="true">
                <span className={cx('card-cta-track')}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span className={cx('card-cta-item')} key={i}>
                      {c.card.ctaA}<b>{c.card.ctaB}</b>
                    </span>
                  ))}
                </span>
              </span>
            </button>
          </div>
          <div className={cx('card-note')}>{c.card.note}</div>
        </div>
        </div>
        <div className={cx('scroll-cue', 'anim', 'd5')}>
          <span className={cx('bar')} />
          <span>{c.hero.cue}</span>
        </div>
      </section>

      {/* ===== CAP 02 · TRUTH ===== */}
      <section className={cx('truth')}>
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
                  {c.truth.headA}<span className={cx('it')}>{c.truth.headB}</span>
                </h2>
              </div>
            </div>
            <div className={cx('tgrid')}>
              <div className={cx('tcard', 'reveal')} data-d="1">
                <h3>{c.truth.c1t}</h3>
                <p>
                  {c.truth.c1a}
                  <strong>{c.truth.c1b}</strong>
                </p>
              </div>
              <div className={cx('tcard', 'reveal')} data-d="2">
                <h3>{c.truth.c2t}</h3>
                <p>
                  {c.truth.c2a}
                  <strong>{c.truth.c2b}</strong>{c.truth.c2c}
                </p>
              </div>
              <div className={cx('tcard', 'reveal')} data-d="3">
                <h3>{c.truth.c3t}</h3>
                <p>
                  {c.truth.c3a}<strong>{c.truth.c3b}</strong>{c.truth.c3c}
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
              {c.guides.headA}<span className={cx('thin')}>{c.guides.headThin}</span>
              <br />
              <span className={cx('it')}>{c.guides.headIt}</span>
            </h2>
          </div>
          <div className={cx('teamGrid')}>
            <div className={cx('tmcard', 'reveal')} data-d="1">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/james.webp" alt="James Fox" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>James</span> Fox
                </div>
                <div className={cx('trole')}>{c.guides.jamesRole}</div>
                <p className={cx('tdesc')}>{c.guides.jamesDesc}</p>
              </div>
            </div>
            <div className={cx('tmcard', 'reveal')} data-d="2">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cyril.webp" alt="Cyril Rool" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Cyril</span> Rool
                </div>
                <div className={cx('trole')}>{c.guides.cyrilRole}</div>
                <p className={cx('tdesc')}>{c.guides.cyrilDesc}</p>
              </div>
            </div>
            <div className={cx('tmcard', 'reveal')} data-d="3">
              <div className={cx('tphoto')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/timothee.webp" alt="Timothée Kolodziejczak" />
              </div>
              <div className={cx('tinfo')}>
                <div className={cx('tname')}>
                  <span>Timothée</span> Kolodziejczak
                </div>
                <div className={cx('trole')}>{c.guides.timoRole}</div>
                <p className={cx('tdesc')}>{c.guides.timoDesc}</p>
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
            {c.filter.h2a}<span className={cx('thin')}>{c.filter.h2thin}</span>{' '}
            <span className={cx('it')}>{c.filter.h2it}</span>
          </h2>
          <p className={cx('reveal')}>{c.filter.p}</p>
          <button
            type="button"
            className={cx('inline-cta', 'reveal')}
            onClick={openModal}
          >
            {c.filter.ctaA}<b>{c.filter.ctaB}</b>
          </button>
        </div>
      </section>

      {/* ===== RIBBON · scrolling clubs/countries band ===== */}
      <div className={cx('ribbon-band')}>
        <div className={cx('ribbon')} aria-hidden="true">
          <div className={cx('ribbon-track')}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span className={cx('ribbon-item')} key={i}>
                {c.ribbon}
                <span className={cx('ribbon-dot')}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CAP 06 · CLOSE ===== */}
      <section className={cx('close')}>
        <div className={cx('wrap')}>
          <h2 className={cx('disp', 'reveal')}>
            {c.close.h2a}<span className={cx('it')}>{c.close.h2it}</span>
          </h2>
          <p className={cx('reveal')}>{c.close.p}</p>
          <button type="button" className={cx('cta', 'reveal')} onClick={openModal}>
            {c.close.cta} <span>→</span>
          </button>
        </div>
        <div className={cx('crowd-close')} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/publico.png?v=1782294646" alt="" />
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

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
                <div className={cx('kick')}>{c.modal.kick}</div>
                <div className={cx('t')}>{c.modal.title}</div>
              </div>
              <button
                type="button"
                className={cx('x')}
                onClick={closeModal}
                aria-label={c.modal.close}
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
                <div className={cx('mstepn')}>{c.modal.steps[0]}</div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>
                      {c.modal.positionLabel} <span className={cx('req')}>*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      placeholder={c.modal.positionPh}
                      className={errCls('position')}
                      onChange={(e) => setCard((cd) => ({...cd, pos: e.target.value}))}
                    />
                  </div>
                  <div className={cx('mf')}>
                    <label>
                      {c.modal.ageLabel} <span className={cx('req')}>*</span>
                    </label>
                    <input
                      type="text"
                      name="age_category"
                      placeholder={c.modal.agePh}
                      className={errCls('age_category')}
                      onChange={(e) => setCard((cd) => ({...cd, age: e.target.value}))}
                    />
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>
                    {c.modal.euLabel}{' '}
                    <span className={cx('req')}>*</span>
                  </label>
                  <div className={cx('mseg', errors.has('eu_passport') && 'err')}>
                    {c.modal.euOptions.map((v) => (
                      <label key={v}>
                        <input
                          type="radio"
                          name="eu_passport"
                          value={v}
                          onChange={() => setCard((cd) => ({...cd, eu: v}))}
                        />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                  <div className={cx('hint')}>{c.modal.euHint}</div>
                </div>
                <div className={cx('mf')}>
                  <label>
                    {c.modal.natLabel} <span className={cx('req')}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sporting_nationality"
                    placeholder={c.modal.natPh}
                    className={errCls('sporting_nationality')}
                  />
                </div>
              </div>

              {/* STEP 2 */}
              <div className={cx('mstep', step === 1 && 'active')}>
                <div className={cx('mstepn')}>{c.modal.steps[1]}</div>
                <div className={cx('mf')}>
                  <label>
                    {c.modal.nameLabel} <span className={cx('req')}>*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    className={errCls('full_name')}
                    onChange={(e) => setCard((cd) => ({...cd, name: e.target.value}))}
                  />
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>
                      {c.modal.dobLabel} <span className={cx('req')}>*</span>
                    </label>
                    <input
                      type="text"
                      name="dob"
                      placeholder={c.modal.dobPh}
                      className={errCls('dob')}
                    />
                  </div>
                  <div className={cx('mf')}>
                    <label>
                      {c.modal.countryLabel} <span className={cx('req')}>*</span>
                    </label>
                    <input type="text" name="country" className={errCls('country')} />
                  </div>
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>
                      {c.modal.emailLabel} <span className={cx('req')}>*</span>
                    </label>
                    <input type="email" name="email" className={errCls('email')} />
                  </div>
                  <div className={cx('mf')}>
                    <label>{c.modal.whatsappLabel}</label>
                    <input type="text" name="whatsapp" />
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>
                    {c.modal.repLabel}{' '}
                    <span className={cx('req')}>*</span>
                  </label>
                  <div className={cx('mseg', errors.has('has_representative') && 'err')}>
                    {c.modal.repOptions.map((v) => (
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
                <div className={cx('mstepn')}>{c.modal.steps[2]}</div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>{c.modal.secPosLabel}</label>
                    <input type="text" name="secondary_position" />
                  </div>
                  <div className={cx('mf')}>
                    <label>{c.modal.footLabel}</label>
                    <input type="text" name="strong_foot" placeholder={c.modal.footPh} />
                  </div>
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>{c.modal.heightLabel}</label>
                    <input type="text" name="height_cm" />
                  </div>
                  <div className={cx('mf')}>
                    <label>{c.modal.weightLabel}</label>
                    <input type="text" name="weight_kg" />
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              <div className={cx('mstep', step === 3 && 'active')}>
                <div className={cx('mstepn')}>{c.modal.steps[3]}</div>
                <div className={cx('mf')}>
                  <label>{c.modal.clubLabel}</label>
                  <input type="text" name="current_club" />
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>{c.modal.prevLabel}</label>
                    <input type="text" name="previous_clubs" />
                  </div>
                  <div className={cx('mf')}>
                    <label>{c.modal.levelLabel}</label>
                    <input type="text" name="level" placeholder={c.modal.levelPh} />
                  </div>
                </div>
                <div className={cx('mf')}>
                  <label>{c.modal.seasonLabel}</label>
                  <input type="text" name="season_stats" />
                </div>
              </div>

              {/* STEP 5 */}
              <div className={cx('mstep', step === 4 && 'active')}>
                <div className={cx('mstepn')}>{c.modal.steps[4]}</div>
                <div className={cx('mf')}>
                  <label>
                    {c.modal.videoLabel}{' '}
                    <span className={cx('req')}>*</span>
                  </label>
                  <input
                    type="text"
                    name="video_links"
                    placeholder={c.modal.videoPh}
                    className={errCls('video_links')}
                  />
                  <div className={cx('hint')}>{c.modal.videoHint}</div>
                </div>
                <div className={cx('mrow2')}>
                  <div className={cx('mf')}>
                    <label>{c.modal.igLabel}</label>
                    <input type="text" name="instagram" />
                  </div>
                  <div className={cx('mf')}>
                    <label>{c.modal.coachLabel}</label>
                    <input type="text" name="coach_reference" />
                  </div>
                </div>
                <div className={cx('mconsent')}>
                  <label>
                    <input type="checkbox" name="consent_terms" id="mPriv" />
                    <span>
                      {c.modal.consent1a}
                      <Link href="/privacy" target="_blank">
                        {c.modal.privacyLink}
                      </Link>
                      {c.modal.consent1mid}
                      <Link href="/terms" target="_blank">
                        {c.modal.termsLink}
                      </Link>
                      {c.modal.consent1end} <span className={cx('req')}>*</span>
                    </span>
                  </label>
                  <label>
                    <input type="checkbox" name="consent_age" id="mAge" />
                    <span>
                      {c.modal.consent2}{' '}
                      <span className={cx('req')}>*</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* success */}
            <div className={cx('msuccess', submitted && 'show')}>
              <div className={cx('chk')}>✓</div>
              <h3>{c.modal.successTitle}</h3>
              <p>{c.modal.successBody}</p>
            </div>

            {!submitted && (
              <div className={cx('modal-foot')}>
                <button
                  type="button"
                  className={cx('mbtn', 'mbtn-ghost')}
                  onClick={onBack}
                  style={{visibility: step === 0 ? 'hidden' : 'visible'}}
                >
                  {c.modal.back}
                </button>
                <button type="button" className={cx('mbtn', 'mbtn-solid')} onClick={onNext}>
                  {step === STEP_COUNT - 1 ? c.modal.send : c.modal.next}
                </button>
              </div>
            )}
            <div className={cx('mfoot-note')}>
              {c.modal.footNote}
              <Link href="/terms">{c.modal.footTermsLink}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
