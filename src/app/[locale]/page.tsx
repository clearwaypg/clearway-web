import {setRequestLocale} from 'next-intl/server';

import {LandingHome} from '@/components/LandingHome';

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <LandingHome />;
}
