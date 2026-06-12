export default function MaintenancePage() {
  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#062c68',
        color: '#e0ebf7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          letterSpacing: '0.05em',
          lineHeight: 1
        }}
      >
        <span style={{fontWeight: 300}}>CLEAR</span>
        <span style={{fontWeight: 700}}>WAY</span>
      </div>
      <div
        style={{
          marginTop: '0.75rem',
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.8
        }}
      >
        Performance Group
      </div>
      <p
        style={{
          marginTop: '2.5rem',
          fontSize: '1rem',
          opacity: 0.85
        }}
      >
        We&rsquo;ll be ready shortly.
      </p>
    </main>
  );
}
