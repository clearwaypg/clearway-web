import {setRequestLocale} from 'next-intl/server';
import {Archivo, Archivo_Narrow, EB_Garamond} from 'next/font/google';

import {ForPlayers} from '@/components/ForPlayers';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap'
});

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo-narrow',
  display: 'swap'
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-eb',
  display: 'swap'
});

export default async function ForPlayersPage({
  params
}: PageProps<'/[locale]/for-players'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div
      className={`${archivo.variable} ${archivoNarrow.variable} ${ebGaramond.variable}`}
    >
      <ForPlayers />
    </div>
  );
}
