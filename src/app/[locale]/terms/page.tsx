import {getTranslations, setRequestLocale} from 'next-intl/server';

import {PlaceholderPage} from '@/components/PlaceholderPage';

export default async function TermsPage({
  params
}: PageProps<'/[locale]/terms'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Pages');

  return <PlaceholderPage title={t('terms')} backLabel={t('backHome')} />;
}
