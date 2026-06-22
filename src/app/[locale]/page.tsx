import {setRequestLocale} from 'next-intl/server';
import {Archivo, EB_Garamond} from 'next/font/google';

import {LandingHome} from '@/components/LandingHome';

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

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className={`${archivo.variable} ${ebGaramond.variable}`}>
      <LandingHome />
    </div>
  );
}
