import {setRequestLocale} from 'next-intl/server';
import {Archivo, EB_Garamond} from 'next/font/google';

import {ForPlayers} from '@/components/ForPlayers';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
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
    <div className={`${archivo.variable} ${ebGaramond.variable}`}>
      <ForPlayers />
    </div>
  );
}
