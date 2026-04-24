# Mia Romagna — Documentazione Tecnica

> Fotografia tecnica completa dello stato attuale del progetto.
> Ultimo aggiornamento: 2026-04-24

---

## 1. Identità del Progetto

**Mia Romagna** è una piattaforma web (PWA-ready) che funge da guida turistica intelligente per la Romagna. Aggrega Punti di Interesse (POI), eventi, esperienze, ristoranti, webcam, meteo e contenuti editoriali (es. "Respiro del Mare", "Oggi in Romagna", "Famiglia"), con un sistema di moderazione e contributi dal territorio.

- **URL preview**: https://id-preview--7f888800-0019-4dbe-84c7-f7d697e11b19.lovable.app
- **URL pubblicato**: https://content-cascade-supabase.lovable.app
- **Dominio custom**: https://miaromagna.it

---

## 2. Stack Tecnologico

### Frontend
| Categoria | Tecnologia |
|---|---|
| Build tool | **Vite 5** (plugin `@vitejs/plugin-react-swc`) |
| Linguaggio | **TypeScript 5** |
| Framework UI | **React 18** |
| Routing | **react-router-dom v6** (con `React.lazy` per code splitting per rotta) |
| Styling | **Tailwind CSS v3** + `tailwindcss-animate` + `@tailwindcss/typography` |
| Component library | **shadcn/ui** (Radix UI primitives) |
| Icone | `lucide-react` |
| Animazioni | `framer-motion` |
| State server | `@tanstack/react-query` |
| Form | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Carousel | `embla-carousel-react` |
| Date | `date-fns`, `react-day-picker` |
| Rich text | `quill` / `react-quill` |
| Sanitizzazione HTML | `dompurify` |
| Mappe | `@googlemaps/js-api-loader` + `@types/google.maps` |
| Notifiche toast | `sonner` + shadcn toast |
| Charts | `recharts` |

### Tipografia (Design System)
- **Playfair Display** (serif) per H1/H2/H3 — eleganza editoriale.
- **Inter** (sans-serif) per body, UI, H4 — leggibilità.
- Scala definita in `src/styles/typography-official.css` e variabili CSS in `:root`.

### Backend (BaaS)
- **Supabase** (Lovable Cloud) — Postgres + Auth + Storage + Edge Functions Deno.
- Project ID: `jxkelzoxxsixqfblnjwj`.
- Client SDK: `@supabase/supabase-js` v2.

---

## 3. Struttura delle Cartelle

```
src/
├── pages/                # 22 pagine route-level (lazy loaded in App.tsx)
├── components/
│   ├── ui/               # shadcn components (button, card, dialog, ...)
│   ├── admin/            # Pannello moderazione, form POI, CSV uploader
│   ├── auth/             # Login, signup, Google sign-in
│   ├── dashboard/        # Mappa, filtri, carousel personalizzati, mobile/desktop
│   ├── homepage/         # Hero, sezioni carousel, teaser
│   ├── hero/             # Hero sections, video background
│   ├── poi/              # Card, dettaglio, mini-map, gallery
│   ├── territory/        # Wizard di submission POI per promotori
│   ├── navigation/       # Navbar, bottom sheet mobile
│   ├── sidebar/          # Sidebar con sezione utente e menu
│   ├── weather/          # Weather widget base
│   ├── webcam/           # Card e filtri webcam
│   ├── restaurants/      # Hero, grid, filtri ristoranti
│   ├── family/, oggi/, partner/, passport/, respiro/, brand/, profile/
│   └── filters/, carousel/, hero/
├── hooks/                # ~55 custom hook (POI data, mappa, filtri, auth, ...)
├── services/             # 14 servizi (cache, API client, fallback, metriche)
├── contexts/             # AuthContext, LocationContext, MenuStateContext
├── config/               # Tailwind config split, menu, filtri, z-index, categorie
├── constants/, types/, utils/, data/
├── styles/               # CSS modulari (base, glassmorphism, animations, ...)
├── integrations/supabase/ # client.ts (auto-generato) + types.ts
├── App.tsx               # Router + Providers
├── main.tsx              # Entry point React
└── index.css             # Tailwind directives + import CSS modulari

supabase/
├── functions/            # 6 Edge Functions Deno
│   ├── get-weather/
│   ├── maps-proxy/
│   ├── search-places/
│   ├── send-partner-request/
│   ├── send-poi-notification/
│   └── upload-image/
├── migrations/           # SQL versionato (read-only via tooling)
└── config.toml
```

---

## 4. Routing (`src/App.tsx`)

Tutte le pagine sono **lazy loaded** con `React.lazy` per code splitting e racchiuse in `<Suspense>` con `PageLoader`.

| Path | Pagina | Scopo |
|---|---|---|
| `/` | `Index` | Homepage con hero e sezioni carousel |
| `/dashboard` | `Dashboard` | Vista mappa + filtri + POI personalizzati |
| `/profile` | `Profile` | Dati utente, avatar, preferenze viaggio |
| `/my-passport` | `MyPassport` | Diario viaggi, badge, mappa esplorata |
| `/events` | `Events` | Lista eventi |
| `/oggi` | `OggiInRomagna` | Sezione "cosa fare oggi" |
| `/favorites` | `Favorites` | POI salvati |
| `/itineraries` | `Itineraries` | Itinerari personalizzati |
| `/webcams` | `Webcams` | Webcam live della Romagna |
| `/partner` | `Partner` | Form richiesta partnership |
| `/chi-siamo` | `ChiSiamo` | About |
| `/privacy-policy` | `PrivacyPolicy` | Privacy |
| `/auth` | `Auth` | Login / Signup (no navbar) |
| `/admin-moderation` | `AdminModerationPage` | Moderazione submissions (admin) |
| `/admin-roles` | `AdminRoles` | Gestione ruoli utente (admin) |
| `/promotore-territorio` | `TerritoryPromoter` | Wizard inserimento POI (promoter/admin) |
| `/respiro-del-mare` | `RespiroDelMare` | Iniziativa donazioni con video YouTube |
| `/restaurants` | `Restaurants` | Lista ristoranti |
| `/experiences` | `Experiences` | Esperienze |
| `/family` | `Family` | Sezione famiglie |
| `/poi/:id` | `POIDetail` | Pagina dettaglio singolo POI |
| `*` | `NotFound` | 404 |

La `MainNavbar` è globale ed è nascosta solo su `/auth`. Padding-top condizionale per pagine "cinematiche" (`/`, `/respiro-del-mare`).

---

## 5. Provider Globali

In `App.tsx`:
1. `QueryClientProvider` (`@tanstack/react-query`)
2. `Toaster` (sonner)
3. `AuthProvider` (custom — gestisce sessione Supabase)
4. `BrowserRouter`
5. `ScrollToTop` (auto-scroll on route change)

Provider aggiuntivi disponibili (`src/contexts/`):
- **AuthContext** — `user`, `session`, `loading`, `signOut`, listener `onAuthStateChange`.
- **LocationContext** — geolocalizzazione utente (per filtri vicinanza, mappa).
- **MenuStateContext** — apertura/chiusura sidebar e bottom sheet mobile.

---

## 6. Backend — Supabase

### 6.1 Connessione
File **auto-generato**: `src/integrations/supabase/client.ts`
```ts
const SUPABASE_URL = "https://jxkelzoxxsixqfblnjwj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "<anon key pubblica>";
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```
Tipi DB in `src/integrations/supabase/types.ts` (read-only, generati).

### 6.2 Tabelle principali

| Tabella | Scopo | RLS |
|---|---|---|
| `user_profiles` | Profilo esteso (avatar, preferenze vacanza, famiglia) | Solo owner |
| `user_roles` | Ruoli (`admin`, `moderator`, `promoter`, `user`) — separata per evitare privilege escalation | Read own / admin manage |
| `points_of_interest` | POI approvati (places + experiences/events) | Public read se `status='approved'`, write authenticated |
| `poi_submissions` | Submissions in moderazione dai promoter | Submitter vede le sue; admin vede tutto |
| `eventi_passati` | Archivio eventi scaduti (popolato da trigger) | Solo admin |
| `events` | Tabella eventi legacy | Public read |
| `favorites` / `user_favorites` | POI/eventi preferiti | Solo owner |
| `user_visits` | Tracciamento visite per passaporto | Solo owner |
| `itineraries` + `itinerary_stops` | Itinerari custom (privati o pubblici) | Owner + public se `is_public` |
| `reviews` | Recensioni POI/eventi | Public read, owner write |
| `bookings` | Prenotazioni | Solo owner |
| `carousel_metrics` + `ab_test_variants` | Telemetria carousel + A/B testing | Insert authenticated, read own/admin |

### 6.3 Funzioni DB (Postgres)
- `has_role(_user_id, _role)` — `SECURITY DEFINER`, base per controlli RLS senza ricorsione.
- `is_admin()` — admin via ruolo o email hardcoded `luca.litti@gmail.com`.
- `calculate_priority_score()` + trigger `update_priority_score_trigger` — calcola un punteggio (rating + recency + reviews) per ranking POI.
- `set_submitter_id` — auto-popola `submitter_id` con `auth.uid()` su insert.
- `move_expired_events()` + `check_and_move_expired_events` — sposta esperienze scadute in `eventi_passati`.
- `update_updated_at_column` / `trigger_set_timestamp` — touch automatici.

### 6.4 Sistema Ruoli (anti privilege escalation)
- Enum Postgres `app_role`: `admin | moderator | promoter | user`.
- Tabella `user_roles` separata da `user_profiles`.
- Tutti i controlli passano da `has_role()` / `is_admin()` (security definer).
- Hook frontend: `useUserRoles.ts` (CRUD admin) e `useAdminAuth.ts`.

### 6.5 Storage Buckets
- `avatars` (pubblico) — immagini profilo utente.
- `assets` (pubblico) — media POI, foto eventi.

### 6.6 Edge Functions (Deno, in `supabase/functions/`)

| Function | Scopo | Secrets usati |
|---|---|---|
| `get-weather` | Proxy meteo (chiamata API esterna lato server, non espone chiave) | (interno) |
| `maps-proxy` | Proxy Google Maps per nascondere/limitare API key | `GOOGLE_MAPS_API_KEY` |
| `search-places` | Ricerca su Google Places API | `GOOGLE_MAPS_API_KEY` |
| `send-partner-request` | Email transazionale richiesta partner via Resend | `RESEND_API_KEY` |
| `send-poi-notification` | Email notifica admin per nuova submission POI | `RESEND_API_KEY` |
| `upload-image` | Upload immagini su ImgBB (alternativa a Storage) | `IMGBB_API_KEY` |

### 6.7 Secrets configurati (Supabase)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`
- `GOOGLE_MAPS_API_KEY`
- `RESEND_API_KEY` (email transazionali)
- `IMGBB_API_KEY` (upload immagini)
- `LOVABLE_API_KEY` (AI Gateway, disponibile)

---

## 7. Servizi Esterni

| Servizio | Uso | Integrazione |
|---|---|---|
| **Supabase** | DB, Auth, Storage, Edge Functions | SDK ufficiale + REST |
| **Google Maps Platform** | Mappe interattive, autocomplete indirizzi, Places | `@googlemaps/js-api-loader` + edge proxy |
| **Resend** | Email transazionali (partner, notifiche admin) | Edge function |
| **ImgBB** | Hosting immagini (upload da admin/promoter) | Edge function |
| **Unsplash CDN** | Immagini placeholder/hero (con `?auto=format` per WebP) | URL diretto |
| **YouTube Embed** | Video background pagina Respiro del Mare | iframe API |
| **Open-Meteo / API meteo** | Dati meteo costieri | Via edge `get-weather` |

---

## 8. Flusso Dati Utente

### 8.1 Autenticazione
```
[Auth.tsx]
  ↓ email/password OR Google OAuth
[supabase.auth.signInWithPassword / signInWithOAuth]
  ↓ session JWT
[AuthContext.onAuthStateChange]
  ↓ user/session in React state
[Componenti consumano useAuth()]
```
- Trigger DB crea automaticamente `user_profiles` riga al primo login.
- Ruoli letti via `useUserRoles` / `useAdminAuth`.
- Conferma email gestita dal dialog `EmailConfirmationDialog`.

### 8.2 Visualizzazione POI (Dashboard)
```
[Dashboard.tsx]
  → useStableFilters / useURLFilters (stato filtri sincronizzato con URL)
  → useSimplifiedPOIData / useOptimizedPOIData
      → simplifiedPOIService → supabase.from('points_of_interest').select()
      → intelligentCacheService (cache geografica + LRU)
      → fallbackManager (fallback se API down)
  → useGeoFiltering / useDynamicLimits
  → SimpleInteractiveMap (Google Maps) con useMarkerPool
  → SectionCarousel (embla) per categorie
  → carouselMetrics → insert su `carousel_metrics`
```

### 8.3 Submission POI (Promoter)
```
[/promotore-territorio → TerritoryPromoter.tsx]
  → controllo ruolo via useAdminAuth (richiede 'promoter' o 'admin')
  → WizardController (4 step: Tipo → Info → Luogo → Orari/Media)
  → usePOIFormData (state form) + usePOIFormValidation (zod)
  → TerritoryMediaUploader → edge `upload-image` → ImgBB URL
  → AddressAutocomplete → Google Places via edge `search-places`
  → usePOIFormSubmission
      → supabase.from('poi_submissions').insert(...)
      → trigger DB set_submitter_id
      → edge `send-poi-notification` → email admin via Resend
```

### 8.4 Moderazione (Admin)
```
[/admin-moderation → AdminModerationPage.tsx]
  → usePOISubmissions → fetch poi_submissions (RLS: is_admin)
  → ModerationTabs (pending / approved / rejected)
  → useModerationActions:
      - approve → INSERT in points_of_interest + UPDATE submission status
      - reject → UPDATE status + admin_notes
      - edit → EditSubmissionModal / EditApprovedModal
  → useApprovedExperiences gestisce esperienze già approvate
```

### 8.5 Preferiti & Passaporto
```
FavoriteButton → useFavorites → user_favorites (insert/delete)
VisitButton → useUserVisits → user_visits (insert)
MyPassport → useUserAchievements + ExplorerMap + TravelDiary
```

### 8.6 Meteo & Stato Costa
```
PersonalizedWeather / WeatherWidgetBase
  → useWeatherAPI → weatherApiService
  → fetch edge function `get-weather`
  → cache in geographicCacheService

CoastalStatusWidget → useCoastalStatus
```

---

## 9. Pattern Architetturali Notabili

- **Code splitting per rotta** — tutte le pagine in `App.tsx` sono `lazy`.
- **React.memo** su componenti pure (`MiaRomagnaLogo`, `ValuePropositionSection`, `Footer`).
- **Custom hooks come unità di logica** — separazione netta tra UI (componenti) e data layer (hooks + services).
- **Service layer** intermedio tra hooks e Supabase (per cache, fallback, metriche, retry).
- **Error boundaries** dedicati: `DashboardErrorBoundary`, `MapErrorBoundary`, `WeatherErrorBoundary`, `APIErrorBoundary`, `CarouselErrorBoundary`.
- **Mobile-first split** — `MobileDashboardView` vs `DesktopDashboardView`, hook `useMobileOptimization`, `use-mobile`.
- **Design tokens semantici** — colori HSL via CSS variables in `index.css` + `tailwind.config.ts`, mai colori hardcoded.
- **Sicurezza ruoli** — tabella `user_roles` separata + funzione `has_role` security definer (no role su profilo).
- **RLS su ogni tabella** — nessuna scrittura senza policy esplicita.
- **Edge functions come proxy** per nascondere API keys (Google Maps, Resend, ImgBB).

---

## 10. Configurazione Build & Tooling

- **Vite** (`vite.config.ts`) — alias `@/` → `src/`, plugin React SWC.
- **Tailwind** (`tailwind.config.ts`) — modulare via `src/config/tailwind/{colors,animations,typography,plugins}.ts`.
- **ESLint** (`eslint.config.js`) — flat config, `@typescript-eslint/no-unused-vars: "warn"`.
- **TypeScript** — `tsconfig.json` con path aliases.
- **PostCSS** (`postcss.config.js`) — Tailwind + autoprefixer.

### File CSS modulari (importati da `index.css`)
- `base.css`
- `typography-official.css` (sistema tipografico ufficiale Playfair + Inter)
- `mobile-typography.css`, `mobile-performance.css`
- `glassmorphism.css`, `hover-scale.css`, `brand-logotype.css`
- `components.css`, `services-optimized.css`, `animations.css`

---

## 11. Stato Attuale e Pulizia Recente

Pulizia codice morto effettuata:
- Rimossi componenti non utilizzati: `SubmissionsList` (admin & territory), `WeatherWidget` wrapper, hook `useGoogleMaps` legacy.
- Rimosso CSS duplicato `typography.css` (mantenuto solo `typography-official.css`).
- Attivato warning ESLint per variabili non utilizzate.

Ottimizzazioni performance attive:
- Lazy loading rotte.
- `React.memo` su componenti puri.
- Immagini Unsplash con `?auto=format` (WebP automatico).
- Cache geografica + LRU per POI.
- Marker pooling Google Maps.

---

## 12. Punti di Attenzione / Debito Tecnico

- Email admin hardcoded in funzione `is_admin()` (`luca.litti@gmail.com`) — fallback temporaneo, andrebbe sostituito da soli ruoli DB.
- Coesistono due tabelle preferiti (`favorites` vs `user_favorites`) — possibile consolidamento.
- Coesistono `events` (legacy) e `points_of_interest` con `poi_type='experience'` — strategia da unificare.
- Numerosi hook con responsabilità sovrapposte (`usePOIData`, `useOptimizedPOIData`, `useSimplifiedPOIData`, `useSmartPOIFetching`) — refactor verso un'unica fonte di verità consigliato.
- Service worker / PWA non ancora attivi.

---

*Questo documento è una fotografia tecnica generata sull'analisi del codebase. Aggiornare quando vengono introdotte nuove pagine, tabelle, edge functions o servizi esterni.*
