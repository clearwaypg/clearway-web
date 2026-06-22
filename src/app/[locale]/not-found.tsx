import {Archivo, EB_Garamond} from 'next/font/google';

import {NotFound} from '@/components/NotFound';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800', '900'],
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

export default function NotFoundPage() {
  return (
    <div className={`${archivo.variable} ${ebGaramond.variable}`}>
      <NotFound />
    </div>
  );
}
