'use client';

import {useEffect, useState, useTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';

import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import styles from './SiteHeader.module.css';

/* =========================================================
   SHARED SITE HEADER
   One unified header for every page. Layout is always the same:

     [ EN / ES ]            [ logo ]            [ cta? ] [ ··· ]

   - The EN/ES language toggle is pinned on the LEFT and visible on
     every page (no longer hidden inside the overlay).
   - The logo is always centred — at the top and on scroll.
   - The RIGHT side always shows the three-dots menu, plus an optional
     page CTA pill sitting next to it (e.g. "Build my profile" on
     /for-players, "Start your search" on /for-clubs).
   - The header is transparent at the top and collapses into a floating
     glassmorphism card on scroll. The three dots open a full-screen
     overlay menu with the numbered navigation links.
   ========================================================= */

const cx = (...names: Array<string | false | null | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => styles[n as string] ?? (n as string))
    .join(' ');

export function SiteHeader({
  cta
}: {
  /* Optional page CTA shown as a pill next to the menu on the right. The
     three-dots menu is always present regardless. `type` selects the
     localized label (long + short) from the Header messages — the short
     one is used on narrow screens so the pill, the centred logo and the
     menu never crowd each other. */
  cta?: {type: 'players' | 'clubs'; onClick: () => void};
} = {}) {
  const t = useTranslations('Header');

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
    {href: '/for-clubs', label: t('nav.clubs')},
    {href: '/for-players', label: t('nav.players')},
    {href: '/about', label: t('nav.about')}
  ] as const;

  return (
    <>
      {/* NAV */}
      <nav className={cx('nav', scrolled && 'scrolled')}>
        {/* LEFT — language toggle, always visible */}
        <div className={cx('left')}>
          <LangToggle />
        </div>

        {/* CENTER — logo, always centred */}
        <Link href="/" className={cx('logo')} aria-label="Clearway Performance Group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logotipos/clearway-white.svg" alt="Clearway Performance Group" />
        </Link>

        {/* RIGHT — optional CTA pill + three-dots menu */}
        <div className={cx('actions')}>
          {cta && (
            <button
              type="button"
              className={cx('headerCta', 'hasShort')}
              onClick={cta.onClick}
            >
              <span className={cx('ctaFull')}>{t(`cta.${cta.type}.long`)} →</span>
              <span className={cx('ctaShort')}>{t(`cta.${cta.type}.short`)}</span>
            </button>
          )}
          <button
            type="button"
            className={cx('burger')}
            aria-label={t('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* FULL-SCREEN MENU OVERLAY */}
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
          aria-label={t('closeMenu')}
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
      </div>
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

  // Nothing to switch to while a single locale is active (Spanish disabled in
  // development). The toggle returns automatically once 'es' is re-enabled.
  const switchTargets = routing.locales.filter((l) => l !== activeLocale);
  if (switchTargets.length === 0) return null;

  return (
    <div className={cx('lang')}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className={cx('langItem')}>
          {i > 0 && <span className={cx('langSep')} aria-hidden>/</span>}
          <button
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={locale === activeLocale}
            className={cx(locale === activeLocale && 'langActive')}
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
