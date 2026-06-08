import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {StatueModel} from '@/components/StatueModel';

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('Hero');
  const tPath = await getTranslations('Pathways');

  return (
    <main>
      {/* HERO */}
      <section className="hero relative min-h-screen grid items-center overflow-hidden px-16 pt-[100px] grid-cols-2">
        {/* Ambient radial glow behind the hero */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 75% 50%, rgba(27,42,74,0.35) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(27,42,74,0.15) 0%, transparent 60%)'
          }}
        />

        {/* LEFT */}
        <div className="relative z-[2]">
          <Eyebrow uppercase={false}>{tHero('eyebrow')}</Eyebrow>

          <h1
            className="font-sans font-light text-cloud"
            style={{
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 28
            }}
          >
            {tHero('headline')}
          </h1>

          <p
            className="font-light"
            style={{
              fontSize: 15,
              color: 'var(--muted)',
              lineHeight: 1.8,
              maxWidth: 420,
              marginBottom: 52
            }}
          >
            {tHero('paragraph')}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/#clubs"
              className="inline-block bg-cloud text-ink font-sans font-bold uppercase no-underline transition-all duration-[250ms] hover:bg-dew"
              style={{
                padding: '16px 40px',
                fontSize: 11,
                letterSpacing: '0.18em'
              }}
            >
              {tHero('ctaClub')}
            </Link>
            <Link
              href="/#players"
              className="inline-block border bg-transparent text-cloud font-sans font-medium uppercase no-underline transition-all duration-[250ms] hover:border-cloud"
              style={{
                padding: '16px 40px',
                fontSize: 11,
                letterSpacing: '0.18em',
                borderColor: 'var(--border-strong)'
              }}
            >
              {tHero('ctaPlayer')}
            </Link>
          </div>
        </div>

        {/* RIGHT — 3D zone */}
        <div className="relative z-[2] flex items-center justify-center h-screen">
          <div
            id="statueZone"
            className="relative flex items-center justify-center w-full h-screen"
          >
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                inset: -60,
                background:
                  'radial-gradient(ellipse at center, rgba(184,200,216,0.06) 0%, transparent 70%)'
              }}
            />
            <StatueModel />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute flex items-center gap-4 font-semibold uppercase"
          style={{
            bottom: 48,
            left: 64,
            fontSize: 10,
            letterSpacing: '0.25em',
            color: 'var(--muted)'
          }}
        >
          <span
            className="block animate-pulse"
            style={{
              width: 1,
              height: 48,
              background: 'var(--border-strong)'
            }}
          />
          {tHero('scroll')}
        </div>
      </section>

      <SepLine />

      {/* PATHWAYS */}
      <div className="grid grid-cols-2 gap-[2px]">
        <PathwayCard
          id="clubs"
          href="/#clubs"
          ghost="01"
          tag={tPath('clubs.tag')}
          title={tPath('clubs.title')}
          titleEmphasis={tPath('clubs.titleEmphasis')}
          description={tPath('clubs.description')}
          cta={tPath('clubs.cta')}
        />
        <PathwayCard
          id="players"
          href="/#players"
          ghost="02"
          tag={tPath('players.tag')}
          title={tPath('players.title')}
          titleEmphasis={tPath('players.titleEmphasis')}
          description={tPath('players.description')}
          cta={tPath('players.cta')}
        />
      </div>

      <SepLine />
    </main>
  );
}

function Eyebrow({
  children,
  uppercase = true
}: {
  children: React.ReactNode;
  uppercase?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center font-semibold text-dew ${
        uppercase ? 'uppercase' : ''
      }`}
      style={{
        gap: 14,
        fontSize: 10,
        letterSpacing: '0.3em',
        marginBottom: 36
      }}
    >
      <span
        aria-hidden
        className="block"
        style={{width: 40, height: 1, background: 'var(--dew)'}}
      />
      {children}
    </div>
  );
}

function SepLine() {
  return (
    <div
      className="w-full"
      style={{height: 1, background: 'var(--border-soft)'}}
    />
  );
}

type PathwayCardProps = {
  id: string;
  href: string;
  ghost: string;
  tag: string;
  title: string;
  titleEmphasis: string;
  description: string;
  cta: string;
};

function PathwayCard({
  id,
  href,
  ghost,
  tag,
  title,
  titleEmphasis,
  description,
  cta
}: PathwayCardProps) {
  return (
    <Link
      id={id}
      href={href}
      className="group relative block bg-ink-2 no-underline text-cloud overflow-hidden transition-colors duration-[400ms] hover:bg-[#161412]"
      style={{padding: '80px 64px'}}
    >
      {/* Ghost numeral */}
      <div
        aria-hidden
        className="absolute font-sans font-bold pointer-events-none"
        style={{
          right: 48,
          top: 24,
          fontSize: 140,
          color: 'rgba(244, 240, 232, 0.03)',
          lineHeight: 1,
          letterSpacing: '-0.05em'
        }}
      >
        {ghost}
      </div>

      {/* Bottom hover line */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 right-0 origin-left scale-x-0 transition-transform duration-[400ms] group-hover:scale-x-100"
        style={{height: 1, background: 'var(--dew)'}}
      />

      <div
        className="font-semibold uppercase text-dew"
        style={{
          fontSize: 10,
          letterSpacing: '0.3em',
          marginBottom: 24
        }}
      >
        {tag}
      </div>

      <div
        className="font-sans font-light"
        style={{
          fontSize: 44,
          lineHeight: 1.05,
          marginBottom: 20
        }}
      >
        {title}
        <strong className="block font-bold">{titleEmphasis}</strong>
      </div>

      <p
        className="font-light"
        style={{
          fontSize: 14,
          color: 'var(--muted)',
          lineHeight: 1.8,
          maxWidth: 360,
          marginBottom: 44
        }}
      >
        {description}
      </p>

      <span
        className="inline-flex items-center font-semibold uppercase text-cloud"
        style={{
          gap: 16,
          fontSize: 11,
          letterSpacing: '0.2em'
        }}
      >
        {cta}
        <span
          aria-hidden
          className="relative inline-block bg-cloud transition-all duration-300 group-hover:w-[60px]"
          style={{width: 40, height: 1}}
        >
          <span
            className="absolute"
            style={{
              right: 0,
              top: -3,
              width: 7,
              height: 7,
              borderTop: '1px solid var(--cloud)',
              borderRight: '1px solid var(--cloud)',
              transform: 'rotate(45deg)'
            }}
          />
        </span>
      </span>
    </Link>
  );
}
