'use client';

import Image from 'next/image';
import {useLocale} from 'next-intl';

import {Link} from '@/i18n/navigation';

/* Static footer for the home: it never moves — it sits fixed behind the
   split-screen content, which slides up to reveal it. */
const BLACK = '#191919';
const WHITE = '#f3f3f3';

const COPY = {
  en: {
    navigate: 'Navigate',
    legal: 'Legal',
    clubs: 'For Clubs',
    players: 'For Players',
    about: 'About',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    copyright: '© 2026 Clearway Performance Group'
  },
  es: {
    navigate: 'Navegar',
    legal: 'Legal',
    clubs: 'Para Clubes',
    players: 'Para Jugadores',
    about: 'Sobre',
    privacy: 'Política de Privacidad',
    terms: 'Términos y Condiciones',
    copyright: '© 2026 Clearway Performance Group'
  }
} as const;

type Props = {
  ref?: React.Ref<HTMLElement>;
};

export function FooterHome({ref}: Props) {
  const locale = useLocale();
  const c = COPY[locale === 'es' ? 'es' : 'en'];

  return (
    <footer
      ref={ref}
      className="fixed right-0 bottom-0 left-0 z-[1] font-sans"
      style={{background: BLACK, color: WHITE, padding: '3rem 2.5rem 1.75rem'}}
    >
      <div
        className="mx-auto grid"
        style={{
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: '3rem',
          maxWidth: 1200
        }}
      >
        {/* Brand — white logo */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logotipos/clearway-white.svg"
            alt="Clearway Performance Group"
            height={30}
            style={{height: 30, width: 'auto', display: 'block'}}
          />
        </div>

        <FooterCol title={c.navigate}>
          <FooterLink href="/for-clubs">{c.clubs}</FooterLink>
          <FooterLink href="/for-players">{c.players}</FooterLink>
          <FooterLink href="/about">{c.about}</FooterLink>
        </FooterCol>

        <FooterCol title={c.legal}>
          <FooterLink href="/privacy">{c.privacy}</FooterLink>
          <FooterLink href="/terms">{c.terms}</FooterLink>
        </FooterCol>
      </div>

      <div
        className="mx-auto flex items-center justify-between"
        style={{
          maxWidth: 1200,
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '0.5px solid #2a2a2a'
        }}
      >
        <span style={{fontSize: '0.62rem', color: '#777'}}>{c.copyright}</span>
        <a
          href="https://scndal.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Created by SCNDAL"
          style={{display: 'block', lineHeight: 0}}
        >
          <Image
            src="/White-webtag.svg"
            alt="Created by SCNDAL"
            width={164}
            height={20}
            style={{height: 20, width: 'auto', display: 'block', opacity: 0.85}}
          />
        </a>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4
        style={{
          fontSize: '0.52rem',
          letterSpacing: '0.2em',
          color: '#777',
          fontVariant: 'small-caps',
          marginBottom: '0.75rem',
          fontWeight: 500
        }}
      >
        {title}
      </h4>
      <ul className="list-none">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block no-underline transition-colors duration-200 text-[#9a9a9a] hover:text-[#d0d8e2]"
        style={{fontSize: '0.75rem', lineHeight: 2.2}}
      >
        {children}
      </Link>
    </li>
  );
}
