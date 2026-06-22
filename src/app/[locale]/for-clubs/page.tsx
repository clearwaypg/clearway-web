import {getTranslations, setRequestLocale} from 'next-intl/server';

import {PlaceholderPage} from '@/components/PlaceholderPage';

export default async function ForClubsPage({
  params
}: PageProps<'/[locale]/for-clubs'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Pages');

  return (
    <PlaceholderPage
      title={t('forClubs')}
      backLabel={t('backHome')}
      tone="navy"
    />
  );
}
