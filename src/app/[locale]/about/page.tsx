import {getTranslations, setRequestLocale} from 'next-intl/server';

import {PlaceholderPage} from '@/components/PlaceholderPage';

export default async function AboutPage({
  params
}: PageProps<'/[locale]/about'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Pages');

  return <PlaceholderPage title={t('about')} backLabel={t('backHome')} />;
}
