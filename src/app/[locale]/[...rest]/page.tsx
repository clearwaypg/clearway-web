import {notFound} from 'next/navigation';

/* Any unmatched path under a locale (e.g. /en/does-not-exist) lands here and
   triggers the localized not-found boundary ([locale]/not-found.tsx). Without
   this catch-all, Next falls back to its default global 404 because [locale]
   is a dynamic segment. */
export default function CatchAllNotFound() {
  notFound();
}
