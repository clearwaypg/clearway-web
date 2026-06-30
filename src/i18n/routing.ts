import {defineRouting} from 'next-intl/routing';

/* =========================================================
   LOCALES — Spanish temporarily disabled during development.

   The whole i18n system stays in place (next-intl, routes, the EN/ES
   toggle, and both messages/en.json + messages/es.json). Only the list of
   *active* locales is reduced to English, so:
     - only /en is served (any /es URL 404s),
     - the language toggle auto-hides (nothing to switch to),
     - no half-translated Spanish is ever shown.

   TO RE-ENABLE SPANISH later, once the copy is approved:
     1. add 'es' back to `locales` below  ->  ['en', 'es']
     2. fill in the Spanish strings (messages/es.json and the per-component
        COPY objects in LandingHome / FooterHome / ForPlayers).
   Nothing else needs rebuilding — the toggle and /es routes come back on.
   ========================================================= */
export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];
