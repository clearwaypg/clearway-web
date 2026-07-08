import {setRequestLocale} from 'next-intl/server';
import {Golos_Text, Archivo_Narrow, Fraunces} from 'next/font/google';

import {ForPlayers} from '@/components/ForPlayers';

const golos = Golos_Text({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-golos',
  display: 'swap'
});

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo-narrow',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['italic'],
  variable: '--font-fraunces',
  display: 'swap'
});

export default async function ForPlayersPage({
  params
}: PageProps<'/[locale]/for-players'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div
      className={`${golos.variable} ${archivoNarrow.variable} ${fraunces.variable}`}
    >
      <ForPlayers />
    </div>
  );
}
