'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Logo} from './Logo';
import {LangSwitcher} from './LangSwitcher';

const LINK_KEYS = ['clubs', 'players', 'methodology', 'about'] as const;
const HASH: Record<(typeof LINK_KEYS)[number], string> = {
  clubs: '/#clubs',
  players: '/#players',
  methodology: '/#process',
  about: '/#about'
};
const LAST = LINK_KEYS.length - 1;

export function MobileMenu() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('openMenu')}
        aria-expanded={open}
        className="bg-transparent border-0 cursor-pointer flex flex-col gap-[5px] p-1"
      >
        <span className="block w-6 h-px bg-cloud" />
        <span className="block w-6 h-px bg-cloud" />
        <span className="block w-6 h-px bg-cloud" />
      </button>

      {/* Fullscreen overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className="fixed inset-0 z-[200] flex flex-col transition-opacity duration-500 ease-out"
        style={{
          background: '#0a0a0a',
          backgroundImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(27,42,74,0.45) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 90%, rgba(27,42,74,0.18) 0%, transparent 60%)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none'
        }}
      >
        {/* HEADER — logo center, close right */}
        <header className="relative flex justify-center items-center pt-8 pb-4">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('closeMenu')}
            className="absolute right-10 top-7 bg-transparent border-0 cursor-pointer leading-none transition-colors duration-200 hover:text-cloud"
            style={{color: 'var(--muted)', fontSize: 32}}
          >
            ×
          </button>
        </header>

        {/* NAV — centered links, stagger bottom→top on open */}
        <nav className="flex-1 flex flex-col items-center justify-center">
          <ul
            className="w-full max-w-[720px] flex flex-col"
            style={{borderTop: '1px solid var(--border-soft)'}}
          >
            {LINK_KEYS.map((key, i) => (
              <li
                key={key}
                className="text-center"
                style={{borderBottom: '1px solid var(--border-soft)'}}
              >
                <Link
                  href={HASH[key]}
                  onClick={() => setOpen(false)}
                  className="block font-sans font-light text-cloud no-underline transition-colors duration-200 hover:text-dew"
                  style={{
                    fontSize: 'clamp(48px, 6vw, 80px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    padding: '28px 24px',
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(40px)',
                    transition:
                      'opacity 600ms ease-out, transform 600ms ease-out',
                    transitionDelay: open
                      ? `${(LAST - i) * 90 + 200}ms`
                      : '0ms'
                  }}
                >
                  {t(`linksLead.${key}` as const)}{' '}
                  <strong className="font-bold">
                    {t(`links.${key}` as const)}
                  </strong>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* FOOTER — CTA + lang switcher */}
        <footer
          className="flex items-center justify-between px-16 pb-12 pt-6"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
            transitionDelay: open ? '550ms' : '0ms'
          }}
        >
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className={[
              'border border-[var(--border-strong)] bg-transparent text-cloud',
              'font-sans text-[11px] font-semibold uppercase no-underline whitespace-nowrap',
              'transition-all duration-[250ms] hover:bg-cloud hover:text-ink'
            ].join(' ')}
            style={{padding: '12px 28px', letterSpacing: '0.18em'}}
          >
            {t('getInTouch')}
          </Link>
          <LangSwitcher />
        </footer>
      </div>
    </>
  );
}
