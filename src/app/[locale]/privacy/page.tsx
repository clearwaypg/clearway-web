import {getTranslations, setRequestLocale} from 'next-intl/server';

import {PlaceholderPage} from '@/components/PlaceholderPage';

export default async function PrivacyPage({
  params
}: PageProps<'/[locale]/privacy'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Pages');

  return <PlaceholderPage title={t('privacy')} backLabel={t('backHome')} />;
}
