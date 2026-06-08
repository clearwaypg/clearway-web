import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type Props = {
  size?: number;
  className?: string;
};

export async function Logo({size = 20, className = ''}: Props) {
  const t = await getTranslations('Logo');

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center leading-none no-underline ${className}`}
      style={{fontSize: `${size}px`}}
      aria-label="Clearway Performance Group"
    >
      <span className="flex items-baseline">
        <span
          className="font-sans font-light uppercase text-cloud"
          style={{letterSpacing: '0.05em'}}
        >
          CLEAR
        </span>
        <span
          className="font-sans font-bold uppercase text-cloud"
          style={{letterSpacing: '0.02em'}}
        >
          WAY
        </span>
      </span>
      <span
        className="font-sans font-normal uppercase text-center mt-[3px]"
        style={{
          fontSize: '0.36em',
          letterSpacing: '0.32em',
          color: 'var(--muted)'
        }}
      >
        {t('tagline')}
      </span>
    </Link>
  );
}
