import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Plus_Jakarta_Sans, Cormorant_Garamond} from 'next/font/google';

import {routing} from '@/i18n/routing';
import {SmoothScroll} from '@/components/SmoothScroll';

import '../globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap'
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Clearway Performance Group',
  description:
    'International talent identification and club recruitment. The clear path to English football.'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params
}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${cormorant.variable}`}
      // Browser extensions (e.g. Google Tag Assistant) inject attributes like
      // data-tag-assistant-present onto <html> before React hydrates, which
      // triggers a harmless hydration attribute mismatch. Suppress it on this
      // element only — it does not affect children.
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
