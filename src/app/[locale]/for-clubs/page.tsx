import {setRequestLocale} from 'next-intl/server';
import {Golos_Text, Fraunces} from 'next/font/google';

import {ForClubs} from '@/components/ForClubs';

const golos = Golos_Text({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-golos',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['italic'],
  variable: '--font-fraunces',
  display: 'swap'
});

export default async function ForClubsPage({
  params
}: PageProps<'/[locale]/for-clubs'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className={`${golos.variable} ${fraunces.variable}`}>
      <ForClubs />
    </div>
  );
}
