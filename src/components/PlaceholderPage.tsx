import {Link} from '@/i18n/navigation';

type Props = {
  title: string;
  backLabel: string;
};

/* Minimal placeholder shell for routes still pending real content. */
export function PlaceholderPage({title, backLabel}: Props) {
  return (
    <main
      className="font-sans"
      style={{
        minHeight: '100vh',
        background: '#f3f3f3',
        color: '#191919',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '2rem',
        padding: '2rem'
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 700,
          letterSpacing: '0.02em',
          lineHeight: 1.1
        }}
      >
        {title}
      </h1>
      <Link
        href="/"
        className="no-underline transition-opacity duration-200 hover:opacity-70"
        style={{
          color: 'var(--navy)',
          fontSize: '0.8rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase'
        }}
      >
        {backLabel}
      </Link>
    </main>
  );
}
