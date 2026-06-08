import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {Logo} from './Logo';
import {LangSwitcher} from './LangSwitcher';
import {MobileMenu} from './MobileMenu';

export async function Nav() {
  const t = await getTranslations('Nav');

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] grid items-center"
      style={{
        gridTemplateColumns: '1fr auto 1fr',
        padding: '24px 64px',
        background:
          'linear-gradient(to bottom, rgba(19,18,16,0.98) 0%, transparent 100%)'
      }}
    >
      <div className="flex items-center justify-start">
        <LangSwitcher />
      </div>

      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="flex items-center justify-end gap-5">
        <Link
          href="/#contact"
          className={[
            'border border-[var(--border-strong)] bg-transparent text-cloud',
            'font-sans text-[10px] font-semibold uppercase no-underline whitespace-nowrap',
            'transition-all duration-[250ms] hover:bg-cloud hover:text-ink'
          ].join(' ')}
          style={{
            padding: '9px 22px',
            letterSpacing: '0.18em'
          }}
        >
          {t('getInTouch')}
        </Link>
        <MobileMenu />
      </div>
    </nav>
  );
}
