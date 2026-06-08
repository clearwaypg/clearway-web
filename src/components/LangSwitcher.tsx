'use client';

import {useTransition} from 'react';
import {useLocale} from 'next-intl';
import {useParams} from 'next/navigation';

import {usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {FlagUK} from './FlagUK';
import {FlagMX} from './FlagMX';

const FLAGS: Record<Locale, React.ReactNode> = {
  en: <FlagUK />,
  es: <FlagMX />
};

export function LangSwitcher() {
  const activeLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === activeLocale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname/params share the same shape, but next-intl types this strictly
        {pathname, params},
        {locale: next}
      );
    });
  }

  return (
    <div className="flex items-center gap-[6px]" data-pending={isPending}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span
              aria-hidden
              className="text-sm"
              style={{color: 'var(--border-strong)'}}
            >
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(locale)}
            className={[
              'flex items-center gap-[6px] bg-transparent border-0 cursor-pointer',
              'font-sans text-[11px] font-medium uppercase px-[10px] py-[6px]',
              'transition-colors duration-200',
              locale === activeLocale ? 'text-cloud' : 'text-[var(--muted)]'
            ].join(' ')}
            style={{letterSpacing: '0.12em'}}
            aria-pressed={locale === activeLocale}
            aria-label={locale === 'en' ? 'English' : 'Español'}
          >
            {FLAGS[locale]}
            <span>{locale.toUpperCase()}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
