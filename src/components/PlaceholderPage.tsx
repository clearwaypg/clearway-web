import {ViewTransition} from 'react';

import {Link} from '@/i18n/navigation';

type Props = {
  title: string;
  backLabel: string;
  /* 'navy' gives the placeholder a navy hero so the home → panel route morph
     expands into a matching navy surface. Defaults to the light shell. */
  tone?: 'light' | 'navy';
  /* When set, a full-screen surface carries this view-transition-name so it can
     morph from the matching home panel. */
  viewName?: string;
};

const NAVY = '#072c68';

/* Minimal placeholder shell for routes still pending real content. */
export function PlaceholderPage({
  title,
  backLabel,
  tone = 'light',
  viewName
}: Props) {
  const navy = tone === 'navy';
  const bg = navy ? NAVY : '#f3f3f3';
  const fg = navy ? '#fcfcfc' : '#191919';

  return (
    <main
      className="font-sans"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        background: bg,
        color: fg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '2rem',
        padding: '2rem'
      }}
    >
      {viewName && (
        <ViewTransition name={viewName} share="morph">
          <div
            aria-hidden
            style={{position: 'absolute', inset: 0, background: bg, zIndex: -1}}
          />
        </ViewTransition>
      )}
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
          color: navy ? '#d0d8e2' : 'var(--navy)',
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
