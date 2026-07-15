# Clearway Web — Descripción completa del proyecto

> Documento de contexto para retomar el proyecto en una conversación nueva de Claude.
> Sitio web de marketing (marca **Clearway Performance Group**), bilingüe EN/ES,
> construido con Next.js 16 (App Router) + next-intl. Es un sitio **estático de
> contenido/marketing** (no hay backend ni base de datos): identifica y coloca
> talento futbolístico en clubes de Inglaterra/Europa/USA/México.

---

## 1. Stack tecnológico

| Área | Tecnología | Versión |
|------|-----------|---------|
| Framework | **Next.js** (App Router) | `16.2.7` |
| React | react / react-dom | `19.2.4` |
| i18n | **next-intl** | `^4.13.0` |
| Estilos | **Tailwind CSS v4** (vía `@tailwindcss/postcss`) + **CSS Modules** | `^4` |
| 3D | **three** + **@react-three/fiber** (sin drei) | three `^0.184`, r3f `^9.6.1` |
| Scroll suave | **lenis** | `^1.3.23` |
| Lenguaje | TypeScript (strict) | `^5` |
| Lint | eslint + eslint-config-next (core-web-vitals + typescript) | `^9` |
| Gestor | npm (hay `package-lock.json`) |

Scripts: `dev` (`next dev`), `build` (`next build`), `start`, `lint` (`eslint`).

### ⚠️ Convención crítica del repo (AGENTS.md / CLAUDE.md)
El repo incluye una advertencia importante: **esta versión de Next.js (16) tiene
breaking changes respecto a versiones anteriores**. Antes de escribir código hay
que leer la guía relevante en `node_modules/next/dist/docs/`. Ejemplos que ya se
aplican en el código:
- **`params` es asíncrono**: `const {locale} = await params;` en cada page/layout.
- Tipos generados de rutas: `PageProps<'/[locale]/for-clubs'>`, `LayoutProps<'/[locale]'>`.
- El middleware ahora se llama **`src/proxy.ts`** (no `middleware.ts`) y exporta `default function proxy(...)`.

---

## 2. Estructura de carpetas

```
src/
  app/
    globals.css                 # Tailwind v4 import + tokens de marca + reset básico
    favicon.ico
    [locale]/
      layout.tsx                # Root layout: html/body, fuentes, i18n provider, SmoothScroll
      page.tsx                  # Home  → <LandingHome/>
      for-clubs/page.tsx        # → <ForClubs/>
      for-players/page.tsx      # → <ForPlayers/>
      about/page.tsx            # → <PlaceholderPage/>
      privacy/page.tsx          # → <PlaceholderPage/>
      terms/page.tsx            # → <PlaceholderPage/>
      maintenance/page.tsx      # Pantalla de mantenimiento (inline styles)
      not-found.tsx             # → <NotFound/>
      [...rest]/page.tsx        # Catch-all → notFound() (404 localizado)
  components/
    LandingHome.tsx / .module.css     # HOME (~1150 líneas tsx)
    ForClubs.tsx   / .module.css      # FOR CLUBS (~1190 líneas)
    ForPlayers.tsx / .module.css      # FOR PLAYERS (~1160 líneas)
    SiteHeader.tsx / .module.css      # Header compartido (nav + toggle idioma + menú overlay)
    SiteFooter.tsx / .module.css      # Footer compartido (usado en clubs/players)
    FooterHome.tsx                    # Footer específico del home (fixed, revelado por scroll)
    NotFound.tsx   / .module.css      # Página 404
    PlaceholderPage.tsx               # Shell para rutas sin contenido real
    SmoothScroll.tsx                  # Wrapper Lenis (expone getLenis())
    Ball3D.tsx                        # Balón 3D con three/r3f (GLB)
  i18n/
    routing.ts                  # defineRouting: locales ['en','es'], default 'en'
    request.ts                  # getRequestConfig → carga messages/{locale}.json
    navigation.ts               # Link, redirect, usePathname, useRouter (localizados)
  proxy.ts                      # Middleware next-intl + flag de mantenimiento
messages/
  en.json / es.json             # Mensajes i18n (mayormente LEGACY, ver nota §7)
public/                         # Assets (ver §9)
next.config.ts                  # withNextIntl(nextConfig)  (nextConfig vacío)
postcss.config.mjs              # @tailwindcss/postcss
tsconfig.json                   # paths: "@/*" → "./src/*"
AGENTS.md / CLAUDE.md           # CLAUDE.md solo hace @AGENTS.md (la advertencia de Next 16)
```

---

## 3. Internacionalización (next-intl)

- **`src/i18n/routing.ts`**: `locales: ['en', 'es']`, `defaultLocale: 'en'`, `localePrefix: 'always'` (siempre `/en/...` o `/es/...`).
- **`src/i18n/request.ts`**: carga dinámicamente `messages/{locale}.json`; hace fallback a `defaultLocale` si el locale no es válido.
- **`src/i18n/navigation.ts`**: exporta `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` localizados. **Siempre importar `Link` desde `@/i18n/navigation`**, no desde `next/link`.
- **`src/proxy.ts`**: aplica el middleware de next-intl. Tiene una constante `MAINTENANCE = false`; si se pone en `true`, reescribe todo hacia `/{defaultLocale}/maintenance`. Matcher excluye `api`, `_next`, `_vercel` y archivos con extensión.

### Estado del toggle EN/ES
- El sistema i18n completo está montado y **ambos locales activos** (`['en','es']`).
- El `LangToggle` (en SiteHeader) se **auto-oculta** si solo hay un locale activo. Con ambos activos, se muestra `EN / ES`.
- Hay un comentario histórico en `routing.ts` explicando cómo se deshabilitaba ES temporalmente (quitándolo de `locales`). Hoy está reactivado.

---

## 4. Layout raíz y fuentes (`app/[locale]/layout.tsx`)

- Envuelve todo en `<html lang={locale}>` con `suppressHydrationWarning` (por extensiones de navegador que inyectan atributos).
- `<body>` → `NextIntlClientProvider` → `SmoothScroll` → children.
- **Fuentes globales** (vía `next/font/google`, expuestas como CSS variables):
  - `Plus_Jakarta_Sans` → `--font-jakarta` (sans base)
  - `Cormorant_Garamond` → `--font-cormorant` (serif)
- **Fuentes por página** (declaradas en cada `page.tsx` y aplicadas en un wrapper `<div>`):
  - Home / ForClubs: `Golos_Text` (`--font-golos`) + `Fraunces` italic (`--font-fraunces`)
  - ForPlayers: además `Archivo_Narrow` (`--font-archivo-narrow`)
  - NotFound: `Golos_Text` + `Fraunces`
- `generateStaticParams()` genera las rutas para cada locale.
- Cada page llama `setRequestLocale(locale)` (requisito de next-intl para renderizado estático).

Metadata global: title `"Clearway Performance Group"`, description sobre identificación de talento.

---

## 5. Componentes compartidos

### `SiteHeader.tsx` (client)
Header unificado para todas las páginas. Layout: **[ EN/ES ] — [ logo centrado ] — [ CTA opcional ] [ menú ··· ]**.
- Transparente arriba; al hacer scroll (`window.scrollY > 8`) colapsa a una tarjeta glassmorphism (estado `scrolled`).
- Logo siempre centrado (`/Logotipos/clearway-white.svg`), enlaza a `/`.
- Botón hamburguesa abre un **overlay full-screen** con los links numerados (01 Home, 02 For Players, 03 For Clubs). Bloquea el scroll del body y cierra con Escape.
- Prop opcional `cta={{type:'players'|'clubs', onClick}}`: muestra una píldora CTA a la derecha con label largo/corto (responsive) tomado de `Header.cta.*` en los mensajes.
- `LangToggle`: usa `useRouter().replace({pathname, params}, {locale})` para cambiar idioma preservando la ruta. Se oculta si no hay otro locale.
- Links del nav se definen inline con `t('nav.home' | 'nav.players' | 'nav.clubs')`.

### `SiteFooter.tsx` (client) — usado en ForClubs y ForPlayers
Tarjeta oscura inset con glow azul, 3 columnas: menú (izq), logo + ubicación (centro: "London · United Kingdom"), más info/legales (der: Privacy, Terms). Copy **bilingüe inline** en un objeto `COPY = {en, es}` (elige por `useLocale()`). Barra inferior: `© 2026 Clearway Performance Group` + tag de SCNDAL (link a scndal.com con `/White-webtag.svg`).

### `FooterHome.tsx` (client) — solo el Home
Footer **fixed** al fondo (z-1), detrás del contenido split-screen que se desliza hacia arriba para revelarlo. Fondo negro `#191919`. Columnas Navigate / Legal. Copy bilingüe inline. Usa `next/image` para el tag de SCNDAL.

### `SmoothScroll.tsx` (client)
Inicializa **Lenis** (`lerp: 0.13`, `smoothWheel: true`, `syncTouch: false`). Respeta `prefers-reduced-motion` (no crea Lenis). Expone un singleton `getLenis()` para que otros componentes hagan scroll programático (ej. el cue "Who we are" del home) sin pelear con el rAF de Lenis.

### `Ball3D.tsx` (client)
Balón de fútbol 3D. Carga `/models/balon-futbol.glb` con `GLTFLoader` de three (vía `useLoader` de r3f, **sin drei**). Clona la escena, la recentra y normaliza a tamaño unitario; gira sobre un eje inclinado (`rotation.y += delta*1.1`, `x += 0.45`). Canvas transparente, cámara fov 35, luces ambient + 2 direccionales. `useLoader.preload` al final.

### `PlaceholderPage.tsx` (server)
Shell mínimo para rutas pendientes (about/privacy/terms). Recibe `title`, `backLabel`, `tone`. Monta `SiteHeader` + un `<h1>` + link de volver. Fondo navy `#072c68` por defecto.

---

## 6. Las tres páginas principales

Todas comparten el mismo patrón:
- Componente `'use client'` grande (~1150 líneas) con toda su copy en un objeto local **`COPY = {en:{...}, es:{...}}`** y seleccionan `const c = COPY[locale]`.
- Helper `cx(...)` para unir clases de CSS Modules (cae al string crudo si no existe la clase).
- Helper `rich(str)` que convierte `**frase**` en `<b>` para resaltar dentro del body copy.
- Animaciones de entrada por `IntersectionObserver` sobre elementos con la clase `.reveal` (+ `data-d` para escalonar el delay).
- Fondos animados dibujados en **`<canvas>` 2D** (líneas/partículas/pases) además del balón 3D o balones 2D.
- Montan `SiteHeader` (con su CTA) arriba y `SiteFooter` (o `FooterHome`) abajo.

### 6.1 HOME — `LandingHome.tsx`
Fuentes Golos + Fraunces. Secciones (en orden):
1. **Hero** split-screen: dos videos de fondo (`/teams-1.mp4` clubs, `/players-1.mp4` players) que hacen fade-in al hacer hover sobre los botones **Clubs / Players**. Tagline "International talent identification" + "Performance Group". Cue "Who we are" que hace scroll suave (Lenis) a la siguiente sección. Canvas de campo (`pitchRef`).
2. **What / Who we are** (`whatRef` + `whatCanvasRef`): "Most promise the dream. We measure it." + párrafo: *"Clearway is an international football talent identification company. Our standard is the one professional clubs actually use. The door opens to over 100 clubs across England, Europe and the Americas."*
3. **Story** ("Founded to create genuine opportunities…"): grid imagen + texto (imagen `/clearway-whoeweare.webp`).
4. **Doors / Pathways**: dos tarjetas-enlace (For Clubs / For Players).
5. **Team** (`section.team`, canvas balón 2D `teamBallRef`): heading + `teamPromise` + grid de 3 tarjetas. **Orden: Cyril → James (centro) → Timothée.** Copy en `COPY.*.team` (roles, descripciones, `jamesCreds`, etc.).
6. **Proof / The Numbers** (`numbersRef`): stats con contador animado (`data-count`).
7. **Footer**: `<SiteFooter/>`.

> Nota: el Home es la **referencia canónica** para la sección de equipo (orden de tarjetas y textos). James va al centro y su descripción es su bio propia.

### 6.2 FOR PLAYERS — `ForPlayers.tsx`
Fuentes Golos + Archivo Narrow + Fraunces. Estructura por "capítulos":
- **CAP 01 · Hero**: "You have the **talent**. We open the door." Capítulo "Your journey starts here". Stat `100+ clubs in Europe`. Silueta + glow.
- **CAP 02 · Truth**: "Real Opportunities, Real Clubs, Real Pathways" — 3 tarjetas: (1) Tu prueba (el club ya pidió verte), (2) Lo que cuesta (lista de 4 puntos: perfil gratis, primera reunión gratis, pathway 3 meses con costo, video/viajes por cuenta del jugador), (3) Lo que prometemos (trial garantizado con el club adecuado).
- **CAP 04 · Guides** (equipo): heading "The team who have been there and done it" + grid de 3 tarjetas (`tmcard`). **Orden: Cyril → James (centro) → Timothée**, copy en `COPY.*.guides`.
- **Ribbon**: banda scroll horizontal con clubes/países.
- **CAP 06 · Close**: "From Potential to Opportunity" + CTA "Build my profile".
- **Modal**: formulario de aplicación multi-paso (estado `modalOpen`, `step`, `submitted`, `errors`, `card`). Detrás del modal hay un **canvas táctico** (jugadores que driblan/pasan el balón y reaccionan al cursor). Bloquea scroll + cierra con Escape.
- CTA del header: `type: 'players'`.

### 6.3 FOR CLUBS — `ForClubs.tsx`
Fuentes Golos + Fraunces. Secciones:
- **Hero** (sticky): título + subtítulo, glow.
- **Process** ("The Process — Six steps. One clear path."): lista ordenada `<ol>` de 6 pasos (subir perfil → revisión/charla → pathway → evaluación 3 meses → asistir a entrenamientos/partidos → trial garantizado). Copy en `COPY.*.process`.
- **Versus** ("Every player, already cleared"): 4 stats (7% pasan el filtro / 3 meses de evaluación / En persona / Garantizado).
- **Aud / Map** (`mapCanvasRef`): mapa con **canvas 2D** que dibuja nodos y líneas. 4 nodos: **USA, Mexico, United Kingdom, Europe** + nota "the network keeps expanding to more countries". Dos `mapCard`: (1) talento filtrado en el que confiar, (2) "A window into our talent" (cualquier club del mundo puede registrarse para ver jugadores).
- **People** (equipo): "Three careers behind every player" + grid de 3 tarjetas (`tcard`). **Orden: Cyril → James (centro) → Timothée**, copy anidada en `COPY.*.people.{james,cyril,timo}.{role,desc}`.
- **End / Enquiry**: tarjeta de cierre con formulario multi-paso (estado `enqOpen`, `cur` 0..4, `data`, `errors`, `flagged`) + canvas.
- **Footer**: `<SiteFooter/>`. CTA del header: `type: 'clubs'`.

### 6.4 NotFound — `NotFound.tsx`
Página 404 (~490 líneas) con su propio CSS module. Renderizada por `[locale]/not-found.tsx` y disparada por el catch-all `[...rest]/page.tsx`.

---

## 7. Contenido / Copy — arquitectura importante

- **La copy real vive INLINE** en objetos `COPY = {en, es}` dentro de cada componente grande (LandingHome, ForClubs, ForPlayers, SiteFooter, FooterHome). Para editar textos, se editan estos objetos, **no** los JSON.
- **`messages/en.json` y `messages/es.json` son en su mayoría LEGACY**: solo se usan activamente las secciones `Header` (labels de nav + CTAs) y `Pages` (títulos de placeholder + "back to home"). El resto (`Landing`, `Hero`, `Pathways`, `Philosophy`, `Stats`, `Process`, `Evaluation`, `Contact`, `Footer`) son de una versión anterior del sitio y no se renderizan. ⚠️ No confundir estos JSON con la copy vigente.
- Todo cambio de texto debe hacerse **en paralelo EN + ES** dentro del objeto COPY correspondiente.

### Equipo (los 3 perfiles) — deben ser consistentes en todas las páginas
- **Orden**: Cyril Rool → **James Fox (centro)** → Timothée Kolodziejczak.
- **James Fox** — Founder & CEO. Bio (texto vigente, igual en Home/Clubs/Players):
  *"Has spent 30 years in elite sport across 66 countries as a professional athlete, coach and manager. Working alongside Olympic Gold Medalists, Wimbledon champions and world number ones, he brings global experience understanding the demands, discipline and mindset required to help talented athletes become professionals."*
- **Cyril Rool** — Director of European Football (Ligue 1: RC Lens, Bordeaux, OGC Nice, Marseille; Francia Sub-21).
- **Timothée Kolodziejczak** — Director of USA & Mexico Football (Lyon, Nice, Saint-Étienne, Sevilla, Mönchengladbach, Tigres; ganó la Europa League con el Sevilla).
- Imágenes: `/cyril.webp`, `/james.webp`, `/timothee.webp`.

---

## 8. Sistema de estilos

- **Tailwind v4** vía `@import "tailwindcss"` en `globals.css` (sin `tailwind.config.js`; el tema se define con `@theme inline`).
- **Tokens de marca** (en `globals.css`, como CSS vars y colores Tailwind):
  - `--ink: #131210`, `--ink-2: #0e0d0c`, `--navy: #1B2A4A`, `--dew: #B8C8D8`, `--cloud: #F4F0E8`.
  - `body`: fondo `--ink`, texto `--cloud`, `overflow-x: hidden`, `scroll-behavior: smooth`.
- **CSS Modules** por componente para todo el diseño pesado (cada `.tsx` grande tiene su `.module.css` de 1500–1740 líneas). Se combinan con el helper `cx()`.
- Algunos componentes chicos usan clases Tailwind directas (FooterHome, PlaceholderPage) e inline styles.

---

## 9. Assets en `public/`

- **Logos**: `/Logotipos/clearway-white.svg` (el usado en header/footer), `clearway-black.svg`, y una carpeta completa `Logotipos/{EPS,JPG,PNG,SVG}` con variantes de color (black, blue dew, blue navy, gray 1/2, beige). También `logo.png`, `logo_2.png`, `logo_bordado.png`.
- **Equipo**: `james.webp`/`Cyril.png`/`cyril.webp`/`timothee.webp`, `clearway-whoeweare.webp`.
- **Video**: `players-1.mp4`, `teams-1.mp4` (fondos del hero home).
- **3D**: `/models/balon-futbol.glb`.
- **SVG decorativos**: `mapa_mundo.svg`, `money.svg`, `sign.svg`, `White-webtag.svg` (tag SCNDAL), `silueta_atras.png`, `silueta_dos.png`, `publico.png`, `navmenu.jpg`.

---

## 10. Notas, quirks y estado actual

- **Git**: rama `main`. Autores recientes: Alejandro Moreno y Andrea Monterrubio Vargas. El sitio lo desarrolla **SCNDAL** (agencia; tag en footers → scndal.com).
- **`MAINTENANCE`** en `proxy.ts` está en `false`. Ponerlo en `true` activa la pantalla de mantenimiento en todo el sitio.
- El helper `cx()` **cae al string crudo** si la clase no existe en el module — cuidado con typos silenciosos.
- `suppressHydrationWarning` en `<html>` es intencional (extensiones de navegador).
- Middleware = `src/proxy.ts` (convención de Next 16), no `middleware.ts`.
- Al editar cualquier texto: mantener **EN y ES sincronizados** y respetar que la copy vive en los objetos `COPY`, no en los JSON.
- Antes de tocar APIs de Next: **consultar `node_modules/next/dist/docs/`** (Next 16 tiene breaking changes; ver AGENTS.md).

### Trabajo reciente (últimas sesiones)
1. **Cambio de tono de copy ("Copy changes from James")**: todo el sitio pasó de un tono negativo/escéptico ("the invisible player", "93 trials nobody needed", "7 de cada 100") a uno positivo/aspiracional ("You have the talent. We open the door.", "The Process — six steps", "Real Opportunities, Real Clubs, Real Pathways"). Se eliminaron secciones "Filter" (ForPlayers) y "Cost/old-way-vs-Clearway" (ForClubs), reemplazadas por Process + Versus stats. Geografía ampliada a USA/México/Europa/UK. Limpieza de CSS y imports muertos.
2. **Unificación de la sección de equipo** (última tarea): se igualaron las tarjetas y textos del equipo en For Clubs y For Players tomando el **Home como referencia** — mismo orden (Cyril, James centro, Timothée) y la bio correcta de James (antes tenían una versión vieja distinta). Verificado con typecheck.
