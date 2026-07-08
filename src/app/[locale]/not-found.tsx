import {Golos_Text, Fraunces} from 'next/font/google';

import {NotFound} from '@/components/NotFound';

const golos = Golos_Text({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
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

export default function NotFoundPage() {
  return (
    <div className={`${golos.variable} ${fraunces.variable}`}>
      <NotFound />
    </div>
  );
}
