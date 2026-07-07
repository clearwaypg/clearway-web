'use client';

import {useLocale} from 'next-intl';

import {Link} from '@/i18n/navigation';

import styles from './SiteFooter.module.css';

const COPY = {
  en: {
    menu: 'Menu',
    clubs: 'For Clubs',
    players: 'For Players',
    about: 'About Clearway',
    more: 'More information',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    locationCity: 'London · United Kingdom',
    locationLine: 'Talent identification across England & Europe',
    ariaMenu: 'Footer menu',
    ariaMore: 'More information',
    ariaHome: 'Clearway — home',
    ariaScndal: 'Created by SCNDAL'
  },
  es: {
    menu: 'Menú',
    clubs: 'Para Clubes',
    players: 'Para Jugadores',
    about: 'Sobre Clearway',
    more: 'Más información',
    privacy: 'Política de Privacidad',
    terms: 'Términos y Condiciones',
    locationCity: 'Londres · Reino Unido',
    locationLine: 'Identificación de talento en Inglaterra y Europa',
    ariaMenu: 'Menú del pie de página',
    ariaMore: 'Más información',
    ariaHome: 'Clearway — inicio',
    ariaScndal: 'Creado por SCNDAL'
  }
} as const;

/* Shared site footer — one inset dark card with a blue inner glow, split into
   three columns: a vertical menu (left), the logo + location (centre) and the
   remaining "more information" pages (right). Used on every page so the footer
   stays identical across the site. Bilingual (EN default / ES). */
export function SiteFooter() {
  const locale = useLocale();
  const c = COPY[locale === 'es' ? 'es' : 'en'];

  return (
    <footer className={styles.foot}>
      <div className={styles.card}>
        <div className={styles.grid}>
          {/* LEFT — vertical menu */}
          <nav className={styles.colMenu} aria-label={c.ariaMenu}>
            <span className={styles.eyebrow}>{c.menu}</span>
            <Link href="/for-clubs">{c.clubs}</Link>
            <Link href="/for-players">{c.players}</Link>
            <Link href="/">{c.about}</Link>
          </nav>

          {/* CENTRE — logo + location */}
          <div className={styles.colBrand}>
            <Link href="/" aria-label={c.ariaHome} className={styles.brandLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.logo}
                src="/Logotipos/clearway-white.svg"
                alt="Clearway"
              />
            </Link>
            <address className={styles.location}>
              <span>{c.locationCity}</span>
              <span>{c.locationLine}</span>
            </address>
          </div>

          {/* RIGHT — remaining pages / more information */}
          <nav className={styles.colMore} aria-label={c.ariaMore}>
            <span className={styles.eyebrow}>{c.more}</span>
            <Link href="/privacy">{c.privacy}</Link>
            <Link href="/terms">{c.terms}</Link>
          </nav>
        </div>

        <div className={styles.bar}>
          <span>© 2026 Clearway Performance Group</span>
          <a
            className={styles.scndalTag}
            href="https://scndal.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.ariaScndal}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/White-webtag.svg" alt="SCNDAL" />
          </a>
        </div>
      </div>
    </footer>
  );
}
