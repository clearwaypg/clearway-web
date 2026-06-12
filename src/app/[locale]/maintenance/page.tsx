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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logotipos/clearway-white.svg"
        alt="Clearway Performance Group"
        style={{
          width: 'clamp(220px, 40vw, 420px)',
          height: 'auto',
          display: 'block'
        }}
      />
      <p
        style={{
          marginTop: '2.5rem',
          fontSize: '1rem',
          opacity: 0.85
        }}
      >
        We are currently working on this site. Please check back later.
      </p>
    </main>
  );
}
