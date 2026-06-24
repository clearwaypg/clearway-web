'use client';

import {useEffect, useState, useTransition} from 'react';
import {useLocale} from 'next-intl';
import {useParams} from 'next/navigation';

import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import styles from './SiteHeader.module.css';

/* =========================================================
   SHARED SITE HEADER
   Identical header for home, /for-clubs and /for-players:
   transparent at the top, a floating glassmorphism card on scroll,
   and a hamburger toggle that opens a full-screen overlay menu with
   numbered links and the EN/ES toggle.
   ========================================================= */

const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

/* Same labels the home menu already uses. */
const NAV_COPY = {
  en: {clubs: 'For Clubs', players: 'For Players', about: 'About'},
  es: {clubs: 'Para Clubes', players: 'Para Jugadores', about: 'Sobre'}
} as const;

export function SiteHeader({
  floatingOnScroll = true,
  cta
}: {
  floatingOnScroll?: boolean;
  /* When provided, the header shows this pill button instead of the three-dots
     menu, and the overlay menu is not rendered. */
  cta?: {label: string; onClick: () => void};
} = {}) {
  const locale = useLocale();
  const copy = NAV_COPY[locale === 'es' ? 'es' : 'en'];

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Header gets a glassmorphism background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll and close the menu overlay on Escape while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const links = [
    {href: '/for-clubs', label: copy.clubs},
    {href: '/for-players', label: copy.players},
    {href: '/about', label: copy.about}
  ] as const;

  return (
    <>
      {/* NAV */}
      <nav className={cx('nav', scrolled && 'scrolled', !floatingOnScroll && 'pinned')}>
        <Link href="/" className={cx('logo')} aria-label="Clearway Performance Group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logotipos/clearway-white.svg" alt="Clearway Performance Group" />
        </Link>
        {cta ? (
          <button
            type="button"
            className={cx('headerCta')}
            onClick={cta.onClick}
          >
            {cta.label}
          </button>
        ) : (
          <button
            type="button"
            className={cx('burger')}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </nav>

      {/* FULL-SCREEN MENU OVERLAY — only when the header shows the menu (no cta) */}
      {!cta && (
        <div
          id="site-menu"
          className={cx('menu', menuOpen && 'menuOpen')}
          role="dialog"
          aria-modal="true"
          aria-hidden={!menuOpen}
        >
          <button
            type="button"
            className={cx('menuClose')}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <span />
            <span />
          </button>
          <nav className={cx('menuLinks')}>
            {links.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx('menuLink')}
                onClick={() => setMenuOpen(false)}
              >
                <span className={cx('menuNum')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={cx('menuLabel')}>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className={cx('menuFooter')}>
            <LangToggle />
          </div>
        </div>
      )}
    </>
  );
}

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
