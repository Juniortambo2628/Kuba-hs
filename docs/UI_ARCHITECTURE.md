# UI Architecture — Single Source of Truth

## Layouts (no full page reload)

| Layer | Component | Used by |
|-------|-----------|---------|
| Root | `app/layout.tsx` | CMS + auth providers |
| Dashboard chrome | `DashboardShell` | `app/admin/layout.tsx`, `app/dashboard/layout.tsx` |
| Public marketing | `MarketingShell` | Public/legal pages |
| Public + hero | `MarketingPage` | Optional template (shell + `HighImpactHero` + container) |

`DashboardShell` uses `AnimatePresence` + `pathname` key for **client-side transitions** between routes. Use `next/link` / `router.push` — avoid `window.location` or `<a href>` full reloads.

## Navigation SSOT

| Role | Config |
|------|--------|
| Admin | `config/admin-navigation.tsx` → sidebar + command palette |
| Client / Provider | `config/dashboard-navigation.tsx` → `KubaSidebar` |

## Design tokens

| Surface | File |
|---------|------|
| Marketing typography/layout | `lib/design-system.ts` (layout aliases `ui-primitives.layout`) |
| Page widths (marketing + dashboard) | `lib/layout-ui.ts` → `pageContainerClass()` |
| Marketing browse listings | `lib/marketing-ui.ts` + `@/components/marketing` |
| Marketplace card chrome | `lib/marketplace-ui.ts` |
| Dashboard cards/buttons/containers | `lib/dashboard-ui.ts` |
| Cross-surface layout, pills, surfaces, filters, empty, CTAs | `lib/ui-primitives.ts` + `lib/layout-ui.ts` + `@/components/shared/ui` |

## Shared dashboard components

| Component | Purpose |
|-----------|---------|
| `DashboardPageContainer` | `max-w-*` + spacing (`width`: standard \| wide \| default) |
| `DashboardPageHeader` | Title + subtitle + actions |
| `DashboardCard` | Card variants: base, glass, premium, elevated |
| `DashboardButton` | CTA sizing/typography (wraps `AppButton`) |
| `AppButton` | Unified primary / secondary / marketing CTAs |
| `AppBadge` | Semantic badges: verified, rating, count, status |
| `AppPill` | Hero/section/accent/muted/count pills (replaces ad-hoc `rounded-full` caps) |
| `PageContainer` | `max-w-7xl` / narrow / prose / dashboard widths + optional section padding |
| `SectionHeader` | Title + subtitle + count pill row for listing/detail pages |
| `SurfaceCard` | `rounded-[2.5rem]` panels: card, elevated, panel, ctaPrimary |
| `FieldLabel` | Caps field labels in modals/forms (distinct from shadcn `FormLabel`) |
| `DashboardDataCard` | Table list wrapper (`glass` / `base` / `elevated`) |
| `DashboardTableHead` / `DashboardTableHeaderRow` | Unified table header cells |
| `DashboardAlertCancel` / `DashboardAlertAction` | Alert dialog button styling |
| `dashboard-ui.ts` | Table, alert, dropdown, chrome, empty-dashed tokens for admin + dashboards |
| `LandingSectionHeader` | Landing band titles — uses `AppPill` + design-system typography |
| `EmptyState` | Empty blocks: `dashboard` \| `marketing` \| `premium` |
| `FilterField`, `FilterSelect`, `FilterSegmentGroup`, `FilterCheckbox`, `FilterRatingGroup` | Listing & sidebar filters |
| `MetricCard` | KPI tiles |
| `DataToolbar` | Search/filter/export bar |
| `DashboardEmptyState` | Empty tables/lists |
| `DashboardPageSkeleton` | Loading state (`width`, `metrics`, `bodyHeight`) |
| `DashboardSuspenseFallback` | Standard Suspense wrapper (skeleton, no metrics) |

## Shared marketing components

| Component | Purpose |
|-----------|---------|
| `MarketingPage` | Shell + optional hero + container; `contained={false}` for full-bleed listings |
| `MarketingSection` | Section spacing; optional `band` for full-width background bands |
| `MarketingListingBody` | Listing content shell below hero (`/providers`, `/services`) |
| `MarketingFilterCard` | Shared sidebar filter panel |
| `MarketingViewToggle` | Grid / list / map view switcher |
| `MarketingListingToolbar` | Results count + toolbar actions |
| `MarketingEmptyState` | Listing empty results (wraps `EmptyState`) |
| `useMarketingHero(id)` | Hero props from `config/marketing-pages.ts` |
| `HighImpactHero` | CMS-driven hero (export `HighImpactHeroProps`) |
| `ContactForm` | Public contact form (pairs with `useContactSubmit`) |
| `ApplyFormLayout` | Shared apply flows (`split-card` \| `two-column`) |
| `LegalPageLayout` | Legal/docs pages (shell + title + prose container) |
| `FeatureCardGrid` | Page features |
| `CTABanner` | Closing CTAs |

## Marketplace cards (public listings)

| Component | Layout options | Used by |
|-----------|----------------|---------|
| `ServiceCategoryCard` | `grid` \| `list` (one visual design) | `/categories`, `/services` |
| `ServiceCard` | `grid` (canonical card) \| `row` (compact list in landing tabs) | All service listings + featured carousel |
| `ProviderCard` | `grid` \| `list` (one visual design) | `/providers`, landing featured carousel |
| `CategoryIconDisplay` | CMS media or Lucide fallback | All category cards |
| `MarketplaceCardLink` | `group` + hover wrapper | Category/service directory cards |
| `SearchResultRow` | `modal` \| `command` | Generic search/command palette row |
| `ProviderSearchRow` | `modal` \| `command` | Hero search + ⌘K provider hits |
| `ProviderSearchAvatar` / `ProviderSearchMeta` | — | Shared provider search chrome |
| `ProviderMapPopup` | — | Leaflet marker popups on `/providers` map |

Tokens: `lib/marketplace-ui.ts` (radius, hover, meta labels, price labels, search row). Import from `@/components/marketplace`.

## Scroll SSOT

| Token / class | Purpose |
|---------------|---------|
| `lib/scroll-ui.ts` | `scrollUi.y`, `scrollUi.xHidden`, etc. |
| `.kuba-scroll` | Thin scrollbar on nested panels (`html` only for page scroll) |
| `.kuba-scroll-hidden` | Scroll without visible bar |
| `ScrollRegion` | Wrapper combining overflow + scroll class |

## Data hooks (avoid duplicate fetch logic)

| Hook | Purpose |
|------|---------|
| `useApiData` / `useData` | SWR API reads |
| `useAdminInbox` | Contact + feedback + quotes hub |
| `useBookingDetail` | Booking show + `{ booking }` unwrap |
| `useDashboardBookingSync` | Echo updates without reload |

## Migrating a page

1. Wrap content in `<DashboardPageContainer width="standard">` (admin) or `width="default"` (role dashboard).
2. Replace repeated card classes with `<DashboardCard variant="glass|premium">`.
3. Use `<DashboardPageHeader title="" subtitle="" />` for headings.
4. Use `<DashboardButton tone="primary">` for primary actions.
5. Public pages: `<MarketingPage hero={useMarketingHero('about')}>` + `<MarketingSection>` for body blocks.
6. Admin loading: `if (isLoading) return <DashboardPageSkeleton width="narrow" metrics={4} />`.
7. Suspense: `<Suspense fallback={<DashboardSuspenseFallback />}>` on list pages with `useSearchParams`.

## Pages migrated

- **Layouts:** `admin/layout.tsx`, `dashboard/layout.tsx` → `DashboardShell` (shared chrome + route transitions)
- **Navigation:** `config/admin-navigation.tsx`, `config/dashboard-navigation.tsx` → `KubaSidebar`
- **Admin:** All main admin pages → `DashboardPageContainer` (width: `standard` | `wide` | `narrow` | `compact` | `xl`)
- **Client dashboard:** overview, bookings, billing, loyalty, messages, profile, services
- **Provider dashboard:** overview, bookings, messages, services, reviews, verification, availability, profile
- **Booking detail:** `BookingDetailView` + `AdminBookingClient` → `compact` / `standard`
- **Public:** Home → `MarketingShell`; marketing routes → `MarketingPage` + `useMarketingHero` (about, commercial, cooperatives, investors, contact, blog, services, providers, categories, quotes/apply, providers/apply)
- **Marketplace cards:** categories browse, services directory, providers directory, category/service detail grids, landing `FeaturedServices` / `FeaturedProviders` / category tab rows → `@/components/marketplace`
- **Search surfaces:** `HeroSearchModal`, `GlobalSearch` (provider hits), `MapView` popups → `ProviderSearchRow` / `SearchResultRow` / `ProviderMapPopup`
- **Legal:** terms, privacy, provider-agreement → `LegalPageLayout`
- **Search:** `config/global-search-static.ts` (unique entry IDs)
- **Admin loading / Suspense:** inline pulse blocks → `DashboardPageSkeleton`; repeated Suspense shells → `DashboardSuspenseFallback` (admin hub, users, bookings, contact, payments; provider bookings)

### Width guide

| Width | Use case |
|-------|----------|
| `standard` | Default admin lists (1400px) |
| `wide` | CMS settings, messaging hub, email templates |
| `default` | Client/provider overview (max-w-6xl) |
| `narrow` | Categories, providers, messages (1200px) |
| `compact` | Booking detail |
| `xl` | Testimonials gallery (7xl) |

Helper scripts (dev): `frontend/scripts/migrate-containers.mjs`, `fix-container-closes.mjs`, `verify-containers.mjs`.
