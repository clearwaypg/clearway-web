'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';
import {useParams} from 'next/navigation';
import Image from 'next/image';

import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import styles from './ForPlayers.module.css';

/* Join scoped module classes by their guide names, dropping falsy values:
   cx('proc-card', active && 'kept') → "ForPlayers_proc-card__x ForPlayers_kept__y" */
const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

/* The 7 of 100 dots that "advance" through the Clearway filter. */
const KEPT = [12, 27, 34, 46, 58, 63, 79];

/* Full language names in their own language, for the section-menu toggle. */
const LOCALE_NAMES: Record<string, string> = {en: 'English', es: 'Español'};

type Copy = {
  navSub: string;
  menuEyebrow: string;
  menu: {href: string; label: string}[];
  heroEyebrow: string;
  heroSub: string;
  heroCta: string;
  heroScroll: string;
  countries: string[];
  truthLabel: string;
  filterLabel: string;
  filterP: string;
  filterCountLabel: string;
  filterCountLabelDone: string;
  processLabel: string;
  procCards: {num: string; title: string; body: string; tag: string}[];
  procHint: string;
  jamesEyebrow: string;
  jamesName1: string;
  jamesName2: string;
  jamesTitle: string;
  jamesBio: string;
  jamesPhotoLabel: string;
  ctaEyebrow: string;
  ctaTag: string;
  ctaRightP: string;
  ctaList: string[];
  ctaBtn: string;
  formSoon: string;
  footTag: string;
  footNavigate: string;
  footLegal: string;
  footCopy: string;
};

const COPY: Record<'en' | 'es', Copy> = {
  es: {
    navSub: 'Performance Group',
    menuEyebrow: 'Secciones',
    menu: [
      {href: '#hero', label: 'Inicio'},
      {href: '#truth', label: 'Sin letras chiquitas'},
      {href: '#filter', label: 'El filtro'},
      {href: '#process', label: 'El recorrido'},
      {href: '#james', label: 'James Fox'},
      {href: '#cta', label: 'Aplicar'}
    ],
    heroEyebrow: 'we form champions',
    heroSub:
      'Evaluamos jugadores de México y el mundo, y los ponemos frente a clubes en Europa que ya quieren verlos. Hombres y mujeres.',
    heroCta: 'Aplicar ahora',
    heroScroll: 'Desliza',
    countries: [
      'Inglaterra',
      'España',
      'Francia',
      'Italia',
      'Alemania',
      'Austria',
      'Bélgica',
      'Hungría'
    ],
    truthLabel: 'Sin letras chiquitas',
    filterLabel: 'The Clearway Filter',
    filterP:
      'No mandamos a todos. Solo ponemos frente a un club a quien sabemos que ese club querría ver. Es el mismo estándar que aplican ellos — preferimos aplicarlo nosotros primero.',
    filterCountLabel: 'jugadores\nevaluados',
    filterCountLabelDone: 'avanzan a\nuna prueba',
    processLabel: 'El recorrido',
    procCards: [
      {
        num: '01',
        title: 'Llena tu perfil',
        body: 'Quién eres, en qué posición juegas, tu material de video. Esta parte no cuesta nada.',
        tag: 'Sin costo'
      },
      {
        num: '02',
        title: 'James te revisa',
        body: 'Cada aplicación la evalúa él. Sin algoritmo. Si tienes lo que buscamos, te contacta directo.',
        tag: 'Revisión personal'
      },
      {
        num: '03',
        title: 'Firmas el contrato',
        body: 'Tres meses de evaluación con todo por escrito. Lo que hacemos y lo que puedes esperar, sin ambigüedad.',
        tag: 'Evaluación 3 meses'
      },
      {
        num: '04',
        title: 'Tu prueba real',
        body: 'Frente a un club que ya quiere verte. Garantizamos la prueba, no el fichaje. Eso es exactamente lo que hacemos.',
        tag: 'Prueba garantizada'
      }
    ],
    procHint: '← Desliza para ver el recorrido →',
    jamesEyebrow: 'Quién te evalúa',
    jamesName1: 'James',
    jamesName2: 'Fox.',
    jamesTitle: 'Fundador, Clearway Performance Group',
    jamesBio:
      'Más de 30 años en el deporte profesional como atleta, entrenador y manager. Ha trabajado junto a campeones olímpicos, campeones de Wimbledon, números uno del mundo y futbolistas de la EFL. Fundó Clearway en 2023 con una idea simple: el talento existe, lo que falta es que alguien lo vea.',
    jamesPhotoLabel: 'James Fox',
    ctaEyebrow: 'Tu inscripción',
    ctaTag: 'we form champions',
    ctaRightP:
      'Aplicar no cuesta nada. Llenas tu perfil, compartes tus mejores jugadas y James lo revisa. Si tienes lo que buscamos, te lo decimos. Si no, también.',
    ctaList: [
      'Aplicación completamente gratuita',
      'Revisión personal por James Fox',
      'Respuesta directa, sin intermediarios'
    ],
    ctaBtn: 'Enviar mi inscripción',
    formSoon: 'Formulario de inscripción — próximamente',
    footTag: 'we form champions',
    footNavigate: 'Navegar',
    footLegal: 'Legal',
    footCopy: '© 2026 Clearway Performance Group'
  },
  en: {
    navSub: 'Performance Group',
    menuEyebrow: 'Sections',
    menu: [
      {href: '#hero', label: 'Home'},
      {href: '#truth', label: 'No fine print'},
      {href: '#filter', label: 'The filter'},
      {href: '#process', label: 'The journey'},
      {href: '#james', label: 'James Fox'},
      {href: '#cta', label: 'Apply'}
    ],
    heroEyebrow: 'we form champions',
    heroSub:
      'We evaluate players from Mexico and the world, and put them in front of clubs in Europe that already want to see them. Men and women.',
    heroCta: 'Apply now',
    heroScroll: 'Scroll',
    countries: [
      'England',
      'Spain',
      'France',
      'Italy',
      'Germany',
      'Austria',
      'Belgium',
      'Hungary'
    ],
    truthLabel: 'No fine print',
    filterLabel: 'The Clearway Filter',
    filterP:
      "We don't send everyone. We only put in front of a club someone we know that club would want to see. It's the same standard they apply — we'd rather apply it first.",
    filterCountLabel: 'players\nevaluated',
    filterCountLabelDone: 'advance to\na trial',
    processLabel: 'The journey',
    procCards: [
      {
        num: '01',
        title: 'Fill out your profile',
        body: 'Who you are, what position you play, your video material. This part costs nothing.',
        tag: 'No cost'
      },
      {
        num: '02',
        title: 'James reviews you',
        body: 'He evaluates every application himself. No algorithm. If you have what we look for, he contacts you directly.',
        tag: 'Personal review'
      },
      {
        num: '03',
        title: 'You sign the contract',
        body: 'Three months of evaluation with everything in writing. What we do and what you can expect, no ambiguity.',
        tag: '3-month evaluation'
      },
      {
        num: '04',
        title: 'Your real trial',
        body: "In front of a club that already wants to see you. We guarantee the trial, not the signing. That's exactly what we do.",
        tag: 'Guaranteed trial'
      }
    ],
    procHint: '← Slide to see the journey →',
    jamesEyebrow: 'Who evaluates you',
    jamesName1: 'James',
    jamesName2: 'Fox.',
    jamesTitle: 'Founder, Clearway Performance Group',
    jamesBio:
      "Over 30 years in professional sport as an athlete, coach and manager. He has worked alongside Olympic champions, Wimbledon champions, world number ones and EFL footballers. He founded Clearway in 2023 with a simple idea: talent exists, what's missing is for someone to see it.",
    jamesPhotoLabel: 'James Fox',
    ctaEyebrow: 'Your application',
    ctaTag: 'we form champions',
    ctaRightP:
      "Applying costs nothing. You fill out your profile, share your best plays and James reviews it. If you have what we look for, we'll tell you. If not, we'll tell you too.",
    ctaList: [
      'Completely free application',
      'Personal review by James Fox',
      'Direct response, no middlemen'
    ],
    ctaBtn: 'Send my application',
    formSoon: 'Application form — coming soon',
    footTag: 'we form champions',
    footNavigate: 'Navigate',
    footLegal: 'Legal',
    footCopy: '© 2026 Clearway Performance Group'
  }
};

export function ForPlayers() {
  const locale = useLocale() as Locale;
  const t = COPY[locale === 'es' ? 'es' : 'en'];
  const isEs = locale === 'es';

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const [struck, setStruck] = useState(false);
  const [filterNum, setFilterNum] = useState(100);
  const [filterDone, setFilterDone] = useState(false);

  const truthRef = useRef<HTMLElement>(null);
  const filterRef = useRef<HTMLElement>(null);
  const jamesRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const curtainRef = useRef<HTMLDivElement>(null);
  const nameRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const credsRef = useRef<HTMLDivElement>(null);

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.replace(
      // @ts-expect-error -- pathname/params share the same shape; next-intl types this strictly
      {pathname, params},
      {locale: next}
    );
  }

  // Scroll-spy — track the most visible section to highlight it in the menu.
  useEffect(() => {
    const ids = t.menu.map((m) => m.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        );
        let bestId = '';
        let bestR = 0;
        ratios.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      {threshold: [0.1, 0.25, 0.5, 0.75]}
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [t.menu]);

  // Section menu — lock scroll while open, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // TRUTH — strike-through when the statement scrolls into view.
  useEffect(() => {
    const el = truthRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setStruck(true), 400);
          io.disconnect();
        }
      },
      {threshold: 0.5}
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // FILTER — dim 93 dots, count 100→7, then light the 7 kept.
  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;
    let ran = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || ran) return;
        ran = true;
        io.disconnect();

        const dots = dotsRef.current;
        let dim = 0;
        dots.forEach((d, i) => {
          if (!d || KEPT.includes(i)) return;
          const t0 = setTimeout(
            () => d.classList.add(styles.dimmed),
            600 + dim * 22
          );
          timers.push(t0);
          dim++;
        });

        const startCount = setTimeout(() => {
          let n = 100;
          const iv = setInterval(() => {
            n -= Math.ceil((n - 7) / 8);
            if (n <= 7) {
              n = 7;
              clearInterval(iv);
              setFilterNum(7);
              setFilterDone(true);
              KEPT.forEach((k, i) => {
                const t1 = setTimeout(
                  () => dotsRef.current[k]?.classList.add(styles.kept),
                  i * 90
                );
                timers.push(t1);
              });
            } else {
              setFilterNum(n);
            }
          }, 45);
          timers.push(iv as unknown as ReturnType<typeof setTimeout>);
        }, 700);
        timers.push(startCount);
      },
      {threshold: 0.4}
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((tm) => clearTimeout(tm));
    };
  }, []);

  // JAMES — curtain lift, name slide, title fade, typewriter bio, creds stagger.
  useEffect(() => {
    const el = jamesRef.current;
    if (!el) return;
    let ran = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || ran) return;
        ran = true;
        io.disconnect();

        const curtain = curtainRef.current;
        if (curtain) {
          curtain.style.transition =
            'transform 1.2s cubic-bezier(.16,1,.3,1)';
          curtain.style.transform = 'scaleY(0)';
        }

        timers.push(
          setTimeout(() => {
            nameRefs.current.forEach((s) => s?.classList.add(styles.vis));
          }, 400)
        );
        timers.push(
          setTimeout(() => titleRef.current?.classList.add(styles.vis), 800)
        );

        timers.push(
          setTimeout(() => {
            const cursor = cursorRef.current;
            const bioEl = bioRef.current;
            if (cursor) cursor.style.display = 'inline-block';
            if (!bioEl) return;
            const txt = t.jamesBio;
            let i = 0;
            bioEl.textContent = '';
            const tick = () => {
              if (i < txt.length) {
                bioEl.textContent += txt[i++];
                timers.push(setTimeout(tick, 16));
              } else {
                timers.push(
                  setTimeout(() => {
                    if (cursor) cursor.style.display = 'none';
                  }, 1000)
                );
                const creds = credsRef.current?.children;
                if (creds) {
                  Array.from(creds).forEach((cr, idx) =>
                    timers.push(
                      setTimeout(
                        () => cr.classList.add(styles.vis),
                        idx * 180
                      )
                    )
                  );
                }
              }
            };
            tick();
          }, 1200)
        );
      },
      {threshold: 0.35}
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((tm) => clearTimeout(tm));
    };
  }, [t.jamesBio]);

  const marquee = [...t.countries, ...t.countries];

  return (
    <div className={cx('page')}>
      {/* NAV */}
      <nav className={cx('nav')}>
        <div className={cx('nav-lang')}>
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={cx(l === locale && 'active')}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link href="/" className={cx('nav-logo')}>
          <div className={cx('nav-logo-main')}>
            CLEAR<b>WAY</b>
          </div>
          <div className={cx('nav-logo-sub')}>{t.navSub}</div>
        </Link>
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className={cx('nav-burger')}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* SECTION MENU */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className={cx('menu-overlay', menuOpen && 'open')}
      >
        <div className={cx('menu-lang')}>
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={cx(l === locale && 'active')}
            >
              {LOCALE_NAMES[l]}
            </button>
          ))}
        </div>
        <div className={cx('menu-logo')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logotipos/clearway-white.svg"
            alt="Clearway Performance Group"
          />
        </div>
        <button
          type="button"
          aria-label={isEs ? 'Cerrar' : 'Close'}
          onClick={() => setMenuOpen(false)}
          className={cx('menu-close')}
        >
          <span>{isEs ? 'Cerrar' : 'Close'}</span>×
        </button>
        <div className={cx('menu-eyebrow')}>{t.menuEyebrow}</div>
        <nav className={cx('menu-list')}>
          {t.menu.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cx(active === item.href.slice(1) && 'active')}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* HERO */}
      <section className={cx('hero')} id="hero">
        <div className={cx('hero-grid')} aria-hidden="true">
          <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            stroke="#d0d8e2"
            strokeWidth="1"
            opacity="0.18"
          >
            <rect x="40" y="40" width="1120" height="620" />
            <line x1="600" y1="40" x2="600" y2="660" />
            <circle cx="600" cy="350" r="110" />
            <rect x="40" y="220" width="150" height="260" />
            <rect x="1010" y="220" width="150" height="260" />
          </svg>
        </div>
        <div className={cx('hero-eyebrow')}>
          <span>{t.heroEyebrow}</span>
        </div>
        <h1 className={cx('hero-h1')}>
          {isEs ? (
            <>
              <span className={cx('line')}>
                <span>El talento</span>
              </span>
              <span className={cx('line')}>
                <span>
                  existe. <em>Ser visto</em>
                </span>
              </span>
              <span className={cx('line')}>
                <span>es lo difícil.</span>
              </span>
            </>
          ) : (
            <>
              <span className={cx('line')}>
                <span>Talent</span>
              </span>
              <span className={cx('line')}>
                <span>
                  exists. <em>Being seen</em>
                </span>
              </span>
              <span className={cx('line')}>
                <span>is the hard part.</span>
              </span>
            </>
          )}
        </h1>
        <div className={cx('hero-bottom')}>
          <p className={cx('hero-sub')}>{t.heroSub}</p>
          <a href="#cta" className={cx('hero-cta')}>
            {t.heroCta} <span>→</span>
          </a>
        </div>
        <div className={cx('hero-scroll')}>{t.heroScroll}</div>
      </section>

      {/* MARQUEE */}
      <div className={cx('marquee')} aria-hidden="true">
        <div className={cx('marquee-track')}>
          {marquee.map((country, i) => (
            <span key={`${country}-${i}`}>
              {country}
              <b> · </b>
            </span>
          ))}
        </div>
      </div>

      {/* TRUTH */}
      <section className={cx('truth')} id="truth" ref={truthRef}>
        <div className={cx('truth-inner')}>
          <div className={cx('truth-label')}>{t.truthLabel}</div>
          <p className={cx('truth-statement')}>
            {isEs ? (
              <>
                Hay quien te cobra por{' '}
                <span className={cx('strike', struck && 'struck')}>
                  pararte en una cancha a que alguien te mire
                </span>
                . Aquí no.{' '}
                <b>Tu prueba es con un club real que ya quiere verte.</b>
              </>
            ) : (
              <>
                Some charge you to{' '}
                <span className={cx('strike', struck && 'struck')}>
                  stand on a pitch hoping someone watches
                </span>
                . Not here.{' '}
                <b>Your trial is with a real club that already wants to see you.</b>
              </>
            )}
          </p>
          <div className={cx('truth-foot')}>
            {isEs ? (
              <>
                <p>
                  Aplicar y armar tu perfil es <b>gratis</b>. Lo que cuesta es
                  la evaluación de tres meses, con un contrato Clearway claro
                  donde sabes exactamente qué esperar.
                </p>
                <p>
                  Garantizamos la <b>prueba</b>, no el fichaje. Y hacemos todo
                  el papeleo del permiso de trabajo y GBE para Inglaterra — eso
                  ningún competidor lo cubre.
                </p>
              </>
            ) : (
              <>
                <p>
                  Applying and building your profile is <b>free</b>. What you
                  pay for is the three-month evaluation, with a clear Clearway
                  contract where you know exactly what to expect.
                </p>
                <p>
                  We guarantee the <b>trial</b>, not the signing. And we handle
                  all the work-permit and GBE paperwork for England — no
                  competitor covers that.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className={cx('filter')} id="filter" ref={filterRef}>
        <div className={cx('filter-inner')}>
          <div className={cx('filter-copy')}>
            <div className={cx('filter-copy-label')}>{t.filterLabel}</div>
            <h2>
              {isEs ? (
                <>
                  De cada cien,
                  <br />
                  <em>siete</em> avanzan.
                </>
              ) : (
                <>
                  Of every hundred,
                  <br />
                  <em>seven</em> advance.
                </>
              )}
            </h2>
            <p>{t.filterP}</p>
          </div>
          <div className={cx('filter-viz')}>
            <div className={cx('dot-grid')}>
              {Array.from({length: 100}).map((_, i) => (
                <span
                  key={i}
                  className={cx('dot')}
                  ref={(el) => {
                    dotsRef.current[i] = el;
                  }}
                />
              ))}
            </div>
            <div className={cx('filter-count')}>
              <div
                className={cx('filter-count-num')}
                style={filterDone ? {color: '#d0d8e2'} : undefined}
              >
                {filterNum}
              </div>
              <div
                className={cx('filter-count-label')}
                style={{whiteSpace: 'pre-line'}}
              >
                {filterDone ? t.filterCountLabelDone : t.filterCountLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={cx('process')} id="process">
        <div className={cx('process-head')}>
          <div className={cx('truth-label')}>{t.processLabel}</div>
          <h2>
            {isEs ? (
              <>
                De tu perfil a la cancha,
                <br />
                en cuatro pasos.
              </>
            ) : (
              <>
                From your profile to the pitch,
                <br />
                in four steps.
              </>
            )}
          </h2>
        </div>
        <div className={cx('process-rail')}>
          {t.procCards.map((card) => (
            <div className={cx('proc-card')} key={card.num}>
              <div className={cx('proc-num')}>{card.num}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <span className={cx('proc-tag')}>{card.tag}</span>
            </div>
          ))}
        </div>
        <div className={cx('proc-hint')}>{t.procHint}</div>
      </section>

      {/* JAMES */}
      <section className={cx('james')} id="james" ref={jamesRef}>
        <div className={cx('james-photo-wrap')}>
          <div className={cx('james-photo')}>
            <div className={cx('james-curtain')} ref={curtainRef} />
            <div className={cx('james-photo-grid')} aria-hidden="true">
              <svg
                viewBox="0 0 400 600"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                stroke="#d0d8e2"
                strokeWidth="1"
              >
                <line x1="0" y1="300" x2="400" y2="300" />
                <circle cx="200" cy="300" r="70" />
                <rect x="120" y="0" width="160" height="90" />
                <rect x="120" y="510" width="160" height="90" />
              </svg>
            </div>
            <div className={cx('james-photo-label')}>{t.jamesPhotoLabel}</div>
          </div>
        </div>
        <div className={cx('james-content')}>
          <div className={cx('james-eyebrow')}>{t.jamesEyebrow}</div>
          <div className={cx('james-name')}>
            <span
              ref={(el) => {
                nameRefs.current[0] = el;
              }}
            >
              {t.jamesName1}
            </span>
          </div>
          <div className={cx('james-name')}>
            <span
              ref={(el) => {
                nameRefs.current[1] = el;
              }}
              style={{transitionDelay: '.12s'}}
            >
              {t.jamesName2}
            </span>
          </div>
          <p className={cx('james-title')} ref={titleRef}>
            {t.jamesTitle}
          </p>
          <p className={cx('james-bio')}>
            <span ref={bioRef} />
            <span
              className={cx('james-cursor')}
              ref={cursorRef}
              style={{display: 'none'}}
            />
          </p>
          <div className={cx('james-creds')} ref={credsRef}>
            {isEs ? (
              <>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    <b>FA Talent Identification</b> — registrado en The Football
                    Association de Inglaterra.
                  </span>
                </div>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    Acceso a <b>más de 100 clubes</b> en ocho países vía socio
                    con licencia FIFA.
                  </span>
                </div>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    Gestión completa del <b>permiso de trabajo y GBE</b> para
                    Inglaterra.
                  </span>
                </div>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    Revisa <b>cada aplicación él mismo.</b> Sin intermediario.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    <b>FA Talent Identification</b> — registered with The
                    Football Association of England.
                  </span>
                </div>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    Access to <b>more than 100 clubs</b> across eight countries
                    via a FIFA-licensed partner.
                  </span>
                </div>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    Full management of the <b>work permit and GBE</b> for
                    England.
                  </span>
                </div>
                <div className={cx('james-cred')}>
                  <i />
                  <span>
                    Reviews <b>every application himself.</b> No middleman.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={cx('cta')} id="cta">
        <div className={cx('cta-watermark')} aria-hidden="true">
          apply
        </div>
        <div className={cx('cta-inner')}>
          <div>
            <div className={cx('cta-eyebrow')}>{t.ctaEyebrow}</div>
            <h2>
              {isEs ? (
                <>
                  El primer
                  <br />
                  paso es tuyo.
                </>
              ) : (
                <>
                  The first
                  <br />
                  step is yours.
                </>
              )}
            </h2>
            <p className={cx('cta-tag')}>{t.ctaTag}</p>
          </div>
          <div className={cx('cta-right')}>
            <p>{t.ctaRightP}</p>
            <div className={cx('cta-list')}>
              {t.ctaList.map((item) => (
                <div key={item}>
                  <i />
                  {item}
                </div>
              ))}
            </div>
            <button
              type="button"
              className={cx('cta-btn')}
              onClick={() => window.alert(t.formSoon)}
            >
              {t.ctaBtn} <span>→</span>
            </button>
            <p className={cx('cta-legal')}>
              {isEs ? (
                <>
                  Al continuar aceptas nuestra{' '}
                  <Link href="/privacy">Política de Privacidad</Link> y{' '}
                  <Link href="/terms">Términos y Condiciones</Link>.
                </>
              ) : (
                <>
                  By continuing you accept our{' '}
                  <Link href="/privacy">Privacy Policy</Link> and{' '}
                  <Link href="/terms">Terms &amp; Conditions</Link>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={cx('footer')}>
        <div className={cx('foot-inner')}>
          <div className={cx('foot-top')}>
            <div>
              <div className={cx('foot-logo-main')}>
                CLEAR<b>WAY</b>
              </div>
              <div className={cx('foot-tag')}>{t.footTag}</div>
            </div>
            <div>
              <div className={cx('foot-col-label')}>{t.footNavigate}</div>
              <div className={cx('foot-links')}>
                <Link href="/for-clubs">
                  {isEs ? 'Para Clubes' : 'For Clubs'}
                </Link>
                <Link href="/for-players">
                  {isEs ? 'Para Jugadores' : 'For Players'}
                </Link>
                <Link href="/about">
                  {isEs ? 'Sobre James Fox' : 'About James Fox'}
                </Link>
              </div>
            </div>
            <div>
              <div className={cx('foot-col-label')}>{t.footLegal}</div>
              <div className={cx('foot-links')}>
                <Link href="/privacy">
                  {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
                </Link>
                <Link href="/terms">
                  {isEs ? 'Términos y Condiciones' : 'Terms & Conditions'}
                </Link>
              </div>
            </div>
          </div>
          <div className={cx('foot-bottom')}>
            <span className={cx('foot-copy')}>{t.footCopy}</span>
            <Image
              src="/White-webtag.svg"
              alt="Created by SCNDAL"
              width={148}
              height={18}
              style={{height: 18, width: 'auto', opacity: 0.4}}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
