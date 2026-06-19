import {setRequestLocale} from 'next-intl/server';

import {ForPlayers} from '@/components/ForPlayers';

export default async function ForPlayersPage({
  params
}: PageProps<'/[locale]/for-players'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <ForPlayers />;
}
