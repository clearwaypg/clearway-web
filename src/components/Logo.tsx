import {Link} from '@/i18n/navigation';

type Props = {
  height?: number;
  className?: string;
};

export function Logo({height = 26, className = ''}: Props) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center no-underline ${className}`}
      aria-label="Clearway Performance Group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logotipos/clearway-white.svg"
        alt="Clearway Performance Group"
        height={height}
        style={{height, width: 'auto', display: 'block'}}
      />
    </Link>
  );
}
