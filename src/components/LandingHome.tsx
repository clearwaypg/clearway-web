'use client';

import {useEffect, useRef, useState, useTransition, ViewTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';

import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {FooterHome} from './FooterHome';

/* =========================================================
   CLEARWAY PERFORMANCE GROUP — HOME
   Brand tokens (approved by James Fox, June 2026)
   navy  #072c68  · black #191919 · dew #d0d8e2 · white #f3f3f3
   Display font: Archivo  → next/font Plus Jakarta Sans (--font-sans)
   Accent font:  Optima italic → Cormorant Garamond italic (--font-serif)

   Footer reveal: the footer is fixed behind the content. The split-screen
   content layer slides up (GSAP) to expose the static footer — the footer
   itself never moves.
   ========================================================= */
const NAVY = '#072c68';
const BLACK = '#191919';
const DEW = '#d0d8e2';
const WHITE = '#f3f3f3';

/* 22 players on a percentage grid of the split-screen container:
   x: 0 = left edge, 50 = halfway line, 100 = right edge · y: 0 = top, 100 = bottom.
   Left (For Clubs) is a 4-3-3 attacking toward x=100; right (For Players) is a
   4-2-3-1 attacking toward x=0. Debug numbers 1-22 map to array indices 0-21. */
type Player = {team: 'left' | 'right'; x: number; y: number};

const PLAYERS: Player[] = [
  // ----- LEFT — 4-3-3 (debug 1-11) -----
  {team: 'left', x: 5, y: 50}, // 1  GK
  {team: 'left', x: 18, y: 22}, // 2
  {team: 'left', x: 15, y: 40}, // 3
  {team: 'left', x: 15, y: 60}, // 4
  {team: 'left', x: 18, y: 78}, // 5
  {team: 'left', x: 32, y: 30}, // 6
  {team: 'left', x: 30, y: 50}, // 7
  {team: 'left', x: 32, y: 70}, // 8
  {team: 'left', x: 44, y: 28}, // 9
  {team: 'left', x: 46, y: 50}, // 10
  {team: 'left', x: 44, y: 72}, // 11
  // ----- RIGHT — 4-2-3-1 (debug 12-22) -----
  {team: 'right', x: 95, y: 50}, // 12 GK
  {team: 'right', x: 82, y: 22}, // 13
  {team: 'right', x: 85, y: 40}, // 14
  {team: 'right', x: 85, y: 60}, // 15
  {team: 'right', x: 82, y: 78}, // 16
  {team: 'right', x: 70, y: 42}, // 17
  {team: 'right', x: 70, y: 58}, // 18
  {team: 'right', x: 60, y: 28}, // 19
  {team: 'right', x: 58, y: 50}, // 20
  {team: 'right', x: 60, y: 72}, // 21
  {team: 'right', x: 54, y: 50} // 22
];

export function LandingHome() {
  const t = useTranslations('Landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setFooterRevealed] = useState(false);
  const [hovered, setHovered] = useState<'clubs' | 'players' | null>(null);

  const clubsVideoRef = useRef<HTMLVideoElement>(null);
  const playersVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const revealedRef = useRef(false);
  const menuOpenRef = useRef(false);
  const playerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ballRef = useRef<HTMLDivElement>(null);

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

  // Lock page scroll: the landing owns the full viewport (everything fixed).
  useEffect(() => {
    const {documentElement, body} = document;
    const prevHtml = documentElement.style.overflow;
    const prevBody = body.style.overflow;
    documentElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      documentElement.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  // Keep menu state available to the (window-level) scroll handlers.
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Reveal / cover the static footer by sliding the content layer.
  useEffect(() => {
    function reveal(show: boolean) {
      if (menuOpenRef.current) return;
      if (show === revealedRef.current) return;
      revealedRef.current = show;
      setFooterRevealed(show);
      const offset = footerRef.current?.offsetHeight ?? 0;
      gsap.to(contentRef.current, {
        y: show ? -offset : 0,
        duration: 0.8,
        ease: 'power3.inOut'
      });
    }

    function onWheel(e: WheelEvent) {
      if (e.deltaY > 30) reveal(true);
      else if (e.deltaY < -30) reveal(false);
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      const dy = touchStartY - e.touches[0].clientY; // >0 when swiping up
      if (dy > 40) reveal(true);
      else if (dy < -40) reveal(false);
    }

    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Esc closes the menu overlay.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scripted, seamless team animation — no cursor input. Possession `p` eases
  // between +1 (left attacking, right defending) and -1 (right attacking, left
  // defending) on a slow plateaued sine, so the two phases flow into one another
  // continuously: the players never snap, they transition out of one attack
  // straight into the opposite one, and the loop has no visible cut. All maths
  // in viewport px.
  useEffect(() => {
    const ball = ballRef.current;
    const els = playerRefs.current;
    const field = contentRef.current;
    if (!ball || !field) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const baseOf = (i: number) => ({
      x: (PLAYERS[i].x / 100) * W,
      y: (PLAYERS[i].y / 100) * H
    });

    // How far forward each player drives when their team attacks: forwards push
    // hard, the back line holds, the keeper barely moves. 0 (GK) … 1 (striker).
    const roleF = PLAYERS.map((p) =>
      p.team === 'left' ? (p.x - 5) / 41 : (95 - p.x) / 41
    );

    const cur = PLAYERS.map((_, i) => baseOf(i)); // live player positions (px)
    const ballCur = {x: W / 2, y: H / 2};
    let time = 0;
    let raf = 0;

    // Plateaued wave: dwells near ±1 so each attack/defend shape is held a beat
    // before the possession swings to the other side.
    const wave = (ph: number) => {
      const s = Math.sin(ph);
      return Math.sign(s) * Math.pow(Math.abs(s), 0.6);
    };

    function frame() {
      time += 0.016;
      W = window.innerWidth;
      H = window.innerHeight;
      const cx = W / 2;
      const cy = H / 2;

      const p = wave(time * 0.42); // -1 … +1 possession (full swing ≈ 15s)
      const leftPoss = Math.max(0, p); // left has the ball, attacking →
      const rightPoss = Math.max(0, -p); // right has the ball, attacking ←

      const PUSH = 0.18 * W; // forward drive of the attacking team
      const DROP = 0.07 * W; // retreat of the defending team toward its goal
      const COMPRESS = 0.32; // vertical squeeze of the defending block

      PLAYERS.forEach((pl, i) => {
        const base = baseOf(i);
        const dir = pl.team === 'left' ? 1 : -1; // attack direction in +x
        const att = pl.team === 'left' ? leftPoss : rightPoss;
        const def = pl.team === 'left' ? rightPoss : leftPoss;

        // Attack: drive toward the far goal, scaled by attacking role.
        let dx = dir * att * PUSH * roleF[i];
        let dy = 0;

        // Defend: drop back toward own goal and compress to the centre line;
        // forwards track back further than the holding defenders.
        dx += -dir * def * DROP * (0.45 + 0.55 * roleF[i]);
        dy += (cy - base.y) * def * COMPRESS;

        // Organic off-ball drift so the shape always breathes.
        dx += Math.sin(time * 0.6 + i * 1.7) * 9;
        dy += Math.cos(time * 0.5 + i * 2.3) * 7;

        const tx = base.x + dx;
        const ty = base.y + dy;
        cur[i].x += (tx - cur[i].x) * 0.07;
        cur[i].y += (ty - cur[i].y) * 0.07;

        const el = els[i];
        if (el)
          el.style.transform = `translate(-50%, -50%) translate(${cur[i].x - base.x}px, ${cur[i].y - base.y}px)`;
      });

      // Ball is passed between the attacking team's players — never sitting on
      // top of one, but in the space just in front of the carrier, toward the
      // rival goal. As the attack builds (att 0→1) the chosen carrier advances
      // from midfield to the strikers, so the ball hops forward pass by pass.
      const attackTeam = p >= 0 ? 'left' : 'right';
      const att = Math.abs(p);
      const adir = attackTeam === 'left' ? 1 : -1; // toward the rival goal in +x
      const targetAdv = 0.45 + 0.55 * att; // midfield → striker as it progresses
      let carrier = -1;
      let bestD = Infinity;
      PLAYERS.forEach((pl, i) => {
        if (pl.team !== attackTeam) return;
        const d = Math.abs(roleF[i] - targetAdv);
        if (d < bestD) {
          bestD = d;
          carrier = i;
        }
      });
      const BALL_AHEAD = 26; // px the ball leads in front of its carrier
      const bx =
        carrier >= 0 ? cur[carrier].x + adir * BALL_AHEAD : cx;
      const by =
        carrier >= 0 ? cur[carrier].y + Math.sin(time * 1.3) * 8 : cy;
      ballCur.x += (bx - ballCur.x) * 0.08;
      ballCur.y += (by - ballCur.y) * 0.08;
      ball!.style.transform = `translate(-50%, -50%) translate(${ballCur.x - cx}px, ${ballCur.y - cy}px)`;

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Split the label into a light lead word ("For" / "Para") and a bold
  // display word ("Clubs" / "Players") for the two-line typographic hierarchy.
  const [clubsLead, ...clubsRest] = t('forClubs').split(' ');
  const clubsMain = clubsRest.join(' ');
  const [playersLead, ...playersRest] = t('forPlayers').split(' ');
  const playersMain = playersRest.join(' ');

  return (
    <main
      className="fixed inset-0 overflow-hidden font-sans"
      style={{background: WHITE, color: BLACK}}
    >
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} t={t} />

      {/* STATIC FOOTER — fixed behind everything, never moves */}
      <FooterHome ref={footerRef} />

      {/* CONTENT LAYER — slides up to reveal the footer */}
      <div
        ref={contentRef}
        className="fixed inset-0 z-[10]"
        style={{background: WHITE, willChange: 'transform'}}
      >
        {/* Football pitch — side-to-side SVG */}
        <svg
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke={NAVY} strokeWidth="0.8" fill="none" opacity="0.2">
            <rect x="0" y="0" width="1440" height="900" />
            <line x1="720" y1="0" x2="720" y2="900" />
            <circle cx="720" cy="450" r="130" />
            <circle cx="720" cy="450" r="3" fill={NAVY} stroke="none" />
            <rect x="0" y="275" width="200" height="350" />
            <rect x="1240" y="275" width="200" height="350" />
            <rect x="0" y="360" width="70" height="180" />
            <rect x="1370" y="360" width="70" height="180" />
            <circle cx="180" cy="450" r="3" fill={NAVY} stroke="none" />
            <circle cx="1260" cy="450" r="3" fill={NAVY} stroke="none" />
            <path d="M 200 360 A 80 80 0 0 1 200 540" />
            <path d="M 1240 360 A 80 80 0 0 0 1240 540" />
            <path d="M 0 20 A 20 20 0 0 1 20 0" />
            <path d="M 1420 0 A 20 20 0 0 1 1440 20" />
            <path d="M 1440 880 A 20 20 0 0 1 1420 900" />
            <path d="M 20 900 A 20 20 0 0 1 0 880" />
          </g>
        </svg>

        {/* Aerial player shadows — above the pitch, below the labels */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          {PLAYERS.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                playerRefs.current[i] = el;
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'rgba(7, 44, 104, 0.15)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Ball — darker so it reads against the players */}
          <div
            ref={ballRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: NAVY,
              opacity: 0.35,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        {/* Center dividing line */}
        <div
          className="pointer-events-none fixed top-0 left-1/2 z-[5] h-full w-px -translate-x-1/2"
          style={{background: DEW}}
        />

        {/* Split background panels (hover only). Each panel shares a
            view-transition-name with its destination hero so the navy morphs
            (expands) from the clicked panel into the full-screen hero. */}
        <div className="fixed inset-0 z-[1] flex">
          <ViewTransition name="hero-clubs" share="morph">
          <Link
            href="/for-clubs"
            aria-label={t('forClubs')}
            onMouseEnter={() => {
              setHovered('clubs');
              playVideo(clubsVideoRef);
            }}
            onMouseLeave={() => {
              setHovered(null);
              resetVideo(clubsVideoRef);
            }}
            className="group relative h-full flex-1 cursor-pointer overflow-hidden"
          >
            <video
              ref={clubsVideoRef}
              src="/teams-1.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-30"
            />
            {/* Vignette — keeps the label legible over the video */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]"
              style={{background: NAVY}}
            />
          </Link>
          </ViewTransition>
          <ViewTransition name="hero-players" share="morph">
          <Link
            href="/for-players"
            aria-label={t('forPlayers')}
            onMouseEnter={() => {
              setHovered('players');
              playVideo(playersVideoRef);
            }}
            onMouseLeave={() => {
              setHovered(null);
              resetVideo(playersVideoRef);
            }}
            className="group relative h-full flex-1 cursor-pointer overflow-hidden"
          >
            <video
              ref={playersVideoRef}
              src="/players-1.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-30"
            />
            {/* Vignette — keeps the label legible over the video */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]"
              style={{background: BLACK}}
            />
          </Link>
          </ViewTransition>
        </div>

        {/* NAV */}
        <nav
          className="fixed top-0 right-0 left-0 z-[100] grid items-center"
          style={{
            gridTemplateColumns: '1fr auto 1fr',
            padding: '1.5rem 2.5rem'
          }}
        >
          <div className="flex items-center">
            <LangToggle />
          </div>

          <Link
            href="/"
            className="flex justify-center no-underline"
            aria-label="Clearway Performance Group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logotipos/clearway-black.svg"
              alt="Clearway Performance Group"
              height={34}
              style={{height: 34, width: 'auto', display: 'block'}}
            />
          </Link>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('menu.clubs')}
              aria-expanded={menuOpen}
              className="flex cursor-pointer flex-col gap-[5px] border-0 bg-transparent p-1"
            >
              <span className="block h-px w-[22px]" style={{background: BLACK}} />
              <span className="block h-px w-[22px]" style={{background: BLACK}} />
              <span className="block h-px w-[22px]" style={{background: BLACK}} />
            </button>
          </div>
        </nav>

        {/* ENTRY LABELS */}
        <Link
          href="/for-clubs"
          className="pointer-events-none fixed z-20 text-left no-underline"
          style={{left: '2.5rem', bottom: '2.5rem'}}
        >
          <div
            className="transition-all duration-700"
            style={{
              letterSpacing: hovered === 'clubs' ? '0.07em' : '0.04em',
              color: hovered === 'clubs' ? WHITE : BLACK
            }}
          >
            <span
              className="block font-light"
              style={{
                fontSize: '1rem',
                lineHeight: 1.1,
                letterSpacing: '0.12em'
              }}
            >
              {clubsLead}
            </span>
            <span
              className="block font-bold leading-none"
              style={{fontSize: 'clamp(3.5rem, 7vw, 7rem)'}}
            >
              {clubsMain}
            </span>
          </div>
        </Link>

        <Link
          href="/for-players"
          className="pointer-events-none fixed z-20 text-right no-underline"
          style={{right: '2.5rem', bottom: '2.5rem'}}
        >
          <div
            className="transition-all duration-700"
            style={{
              letterSpacing: hovered === 'players' ? '0.07em' : '0.04em',
              color: hovered === 'players' ? WHITE : BLACK
            }}
          >
            <span
              className="block font-light"
              style={{
                fontSize: '1rem',
                lineHeight: 1.1,
                letterSpacing: '0.12em'
              }}
            >
              {playersLead}
            </span>
            <span
              className="block font-bold leading-none"
              style={{fontSize: 'clamp(3.5rem, 7vw, 7rem)'}}
            >
              {playersMain}
            </span>
          </div>
        </Link>

        {/* Center dot */}
        <div
          className="pointer-events-none fixed left-1/2 z-20 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{bottom: '28%', background: DEW}}
        />

      </div>
    </main>
  );
}

/* ----- Menu overlay ----- */
function MenuOverlay({
  open,
  onClose,
  t
}: {
  open: boolean;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<'Landing'>>;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className="fixed inset-0 z-[200] flex transition-opacity duration-300"
      style={{
        background: '#0a1628',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none'
      }}
    >
      {/* LEFT — language top-left, menu options bottom-left */}
      <div className="relative flex-1">
        {/* Language selector — top-left corner */}
        <div style={{position: 'absolute', top: '1.75rem', left: '2.5rem'}}>
          <LangToggle variant="menu" />
        </div>

        {/* Close — top-right of the content area, off the image */}
        <button
          type="button"
          onClick={onClose}
          className="absolute cursor-pointer border-0 bg-transparent transition-colors duration-200 hover:text-[#d0d8e2]"
          style={{
            top: '1.75rem',
            right: '2.5rem',
            fontSize: '1.3rem',
            color: WHITE,
            zIndex: 10
          }}
        >
          {t('menu.close')} ×
        </button>

        {/* Menu options — bottom-left, large and tight */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}
        >
          <MenuLink href="/for-clubs" onClick={onClose}>
            {t('menu.clubs')}
          </MenuLink>
          <MenuLink href="/for-players" onClick={onClose}>
            {t('menu.players')}
          </MenuLink>
          <MenuLink href="/about" onClick={onClose}>
            {t('menu.about')}
          </MenuLink>
        </div>
      </div>

      {/* RIGHT — image, one third of the page */}
      <div className="relative" style={{width: '33.3333%'}}>
        <Image
          src="/navmenu.jpg"
          alt=""
          fill
          sizes="33vw"
          aria-hidden
          style={{objectFit: 'cover', objectPosition: 'center center'}}
        />
      </div>
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="font-light no-underline hover:animate-bounce"
      style={{
        fontSize: 'clamp(2.4rem, 5vw, 4rem)',
        lineHeight: 1.05,
        letterSpacing: '0.05em',
        color: hover ? DEW : WHITE,
        transition: 'color 200ms ease'
      }}
    >
      {children}
    </Link>
  );
}

/* ----- Language toggle (EN / ES) ----- */
const LOCALE_NAMES: Record<string, string> = {en: 'English', es: 'Español'};

function LangToggle({variant = 'nav'}: {variant?: 'nav' | 'menu'}) {
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

  const isMenu = variant === 'menu';

  return (
    <div className={isMenu ? 'flex gap-4' : 'flex gap-[0.15rem]'}>
      {routing.locales.map((locale) => {
        const active = locale === activeLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={active}
            className="cursor-pointer border-0 border-b bg-transparent transition-colors duration-200"
            style={{
              fontSize: isMenu ? '0.65rem' : '0.62rem',
              fontWeight: isMenu ? 600 : 500,
              letterSpacing: isMenu ? '0.02em' : '0.15em',
              padding: isMenu ? '0.4rem 0.8rem' : '0.3rem 0.5rem',
              color: isMenu ? (active ? WHITE : '#555') : BLACK,
              borderBottomColor: active
                ? isMenu
                  ? WHITE
                  : BLACK
                : 'transparent'
            }}
          >
            {isMenu ? LOCALE_NAMES[locale] : locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
