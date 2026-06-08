'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const LINK_KEYS = ['clubs', 'players', 'methodology', 'about'] as const;
const HASH: Record<(typeof LINK_KEYS)[number], string> = {
  clubs: '/#clubs',
  players: '/#players',
  methodology: '/#process',
  about: '/#about'
};

export function MobileMenu() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('openMenu')}
        aria-expanded={open}
        className="bg-transparent border-0 cursor-pointer flex flex-col gap-[5px] p-1"
      >
        <span className="block w-6 h-px bg-cloud transition-all duration-300" />
        <span className="block w-6 h-px bg-cloud transition-all duration-300" />
        <span className="block w-6 h-px bg-cloud transition-all duration-300" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={[
          'fixed inset-0 z-[150] bg-black/50 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        ].join(' ')}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={[
          'fixed top-0 right-0 bottom-0 z-[200] w-[320px] bg-ink-2',
          'border-l border-[var(--border-soft)]',
          'flex flex-col pt-20 pb-12 px-12',
          'transition-transform duration-[400ms]'
        ].join(' ')}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t('closeMenu')}
          className="absolute top-7 right-8 bg-transparent border-0 cursor-pointer text-2xl leading-none"
          style={{color: 'var(--muted)'}}
        >
          ×
        </button>

        <nav className="flex flex-col">
          {LINK_KEYS.map((key) => (
            <Link
              key={key}
              href={HASH[key]}
              onClick={() => setOpen(false)}
              className={[
                'block font-sans text-[28px] font-light text-cloud no-underline',
                'py-[18px] border-b border-[var(--border-soft)]',
                'transition-colors duration-200 hover:text-dew'
              ].join(' ')}
              style={{letterSpacing: '-0.01em'}}
            >
              <strong className="font-bold">
                {t(`linksLead.${key}` as const)}
              </strong>{' '}
              {t(`links.${key}` as const)}
            </Link>
          ))}
        </nav>

        <div className="mt-10">
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="text-[14px] font-semibold uppercase text-dew no-underline"
            style={{letterSpacing: '0.18em'}}
          >
            {t('getInTouch')} →
          </Link>
        </div>
      </aside>
    </>
  );
}
