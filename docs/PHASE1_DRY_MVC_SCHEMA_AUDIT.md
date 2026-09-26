# Phase 1 — Audit Report (read-only, no code changes)

**Repo:** `C:\wamp64\www\Kuba-hs` · HEAD `91641fa` · tree clean at audit time
**Stack:** `/backend` Laravel 12 (headless API) + `/frontend` Next.js 16 App Router · MySQL `home_service`
**Approvals received (Phase 2 gate):** B2 behaviour change **approved** · destructive list **approved per recommendations** · `public/assets/zogin` **delete** · C7/C8/D22 **in scope** · save report to `docs/` **approved**.

---

## 0. Ground truth established first

| Check | Result |
|---|---|
| `backend/routes/web.php` | No page routes. Comment L17–19: *"Legacy Inertia routes have been removed. All admin/provider/client UI is now served by the Next.js frontend."* |
| `Inertia::render` in `backend/app` | **0 hits** → the 100-file Inertia app has no renderer |
| `layout.tsx` count | 3 (root, `admin/`, `dashboard/`) for **85** `page.tsx` |
| Live DB vs migrations | `migrations` table = 81 rows, latest `2026_07_22_000000`. **5 migrations dated 2026-08-15/16 unapplied** (verified directly via mysql) |
| `faqs` live columns | `…is_active, order, question…` — column is `order`, code expects `sort_order` (verified) |

Independently re-verified (not trusted from sub-reports): `routes/api.php:214` → `MediaController::delete` (method absent — controller has `upload/uploadToModel/uploadGeneric/destroy/clearRelatedCache`); `FinanceController.php:44` `strftime` (SQLite-only); `BlogClient.tsx:112` `post.body`; `FinanceOverview.tsx:67` → `/api/admin/financials/charts` (no such route); `/assets/zogin` DB references = **0** across `site_settings`, `email_templates`, `blog_posts`, `page_features`.

---

## A. Layout & DRY

**Positive (verified, scoped out):** `Navbar`/`Footer` have exactly **one** importer (`components/layout/MarketingShell.tsx:1–2`); **zero** `page.tsx` renders `<nav>`/`<footer>`; **zero** third-party/analytics scripts (`gtag|GTM|hotjar|plausible` → 0 hits; no `<Script>`/`next/script`); single CSS entrypoint `globals.css`; home page already dynamic-imports 10 below-fold sections (`app/page.tsx:8–37`).

**The shell layer is clean; duplication sits one level down** (page headers, skeletons, auth cards, CTA blocks).

| ID | Finding | Path(s) | Sev | Effort | Risk |
|---|---|---|---|---|---|
| A1 | `login` ↔ `login/provider` **83.2 % identical** (347/346 lines; 193 identical non-blank lines). Diff = redirect targets + `useAuthPageContent("client_login"\|"provider_login")` + client-only `resetStatus` banner L147–151 | `frontend\src\app\login\page.tsx`, `frontend\src\app\login\provider\page.tsx` | High | M | Medium |
| A2 | `client/messages` ↔ `provider/messages` **88.2 % identical**; only `role`, greeting subtitle, bookings href differ | `frontend\src\app\dashboard\client\messages\page.tsx:37–79`, `…\provider\messages\page.tsx:37–79` | High | S | Low |
| A3 | **Two competing page headers** rendering the same `workspaceUi.greeting.title/subtitle`: `shared\DashboardPageHeader.tsx:14–29` (25 admin pages) vs `dashboard\workspace\DashboardGreetingBar.tsx:20–51` (22 files). **3 admin pages use the dashboard one**: `admin\investors\page.tsx:97`, `admin\messages\page.tsx:101`, `admin\quotes\page.tsx:101` | see paths | High | M | Low |
| A4 | **4 auth pages hand-roll card shells** outside `AuthPageShell` → 8 blocks: `auth\complete-profile\page.tsx:56–68,179–186`; `payment\verify\page.tsx:49,105,107` (×3 in one file); `register\page.tsx:12–16`; `auth\google\callback\page.tsx:40,56` (hardcoded `bg-black`, ignores dark mode) | see paths | High | M | Medium |
| A5 | Leaflet CSS loaded **globally and** in 4 components → ships twice on map routes and on **all 85 routes** incl. admin/dashboard where no map exists | `frontend\src\app\globals.css:4` + `components\map\InteractiveMap.tsx:5`, `components\map\LocationPicker.tsx:5`, `components\marketing\provider-profile\ProviderLocationMapView.tsx:6`, `components\shared\MapView.tsx:15` | High | S | Low |
| A6 | Uppy (3 CSS sheets + runtime) **statically** imported into public provider/service pages via `BookingModal` | `components\booking\BookingModal.tsx:11–13` ← `ProviderProfileClient.tsx`, `ServiceDetailClient.tsx` | High | M | Medium |
| A7 | **6 byte-identical** `Loader2` skeleton early-returns + 14 variants; `admin\workforce\verification\page.tsx:252` hand-rolls another while `DashboardSuspenseFallback` exists (12 adopters) | `dashboard\client\bookings\[id]:47–51`, `provider\availability:88–92`, `provider\bookings\[id]:41–45`, `provider\reviews:84–88`, `provider\services:101–105`, `provider\verification:72–76` | Med | S | Low |
| A8 | `error.tsx` **triplicated** (30 lines each, identical button className L24); **no `not-found.tsx` anywhere** | `app\error.tsx`, `app\admin\error.tsx`, `app\dashboard\error.tsx` | Med | S | Low |
| A9 | `CTABanner` adopted by only 2 of ~14 marketing pages; `about` hand-rolls the same "Ready to get started?" block; `landing\CTA.tsx` is a 3rd implementation | `app\about\page.tsx:52–83` vs `components\shared\CTABanner.tsx` | Med | S | Medium |
| A10 | `commercial` ↔ `cooperatives` **55.2 % structurally identical** (only CMS key prefix differs) | `app\commercial\page.tsx`, `app\cooperatives\page.tsx` | Med | M | Low |
| A11 | `register/client` ↔ `register/provider` **55.2 % identical** | `app\register\client\page.tsx`, `app\register\provider\page.tsx` | Med | M | Medium |
| A12 | `investors` half-migrated: imports `MarketingSection` at L5 but never uses it; renders raw `<section>` with a **nested** `max-w-7xl mx-auto px-4` inside `MarketingPage`'s `PageContainer` → latent layout bug | `app\investors\page.tsx:5,60–81,84–233` | Med | S | Low |
| A13 | `getSSRSettings()` awaited in root layout on every render. **Downgraded from "blocker"** — uses `next: { revalidate: 3600 }` (`lib\ssr-settings.ts:34`), cached 1h; on cold/revalidate it blocks TTFB up to 8 s (`PROD_TIMEOUT_MS`) | `app\layout.tsx:46,53` | Med | M | Medium |
| A14 | Eager heavy deps: `framer-motion` **41 files** (17 in `app/`); tiptap reached from 8 admin files incl. always-mounted settings; Echo+Pusher boot on **all 85 routes** via `GlobalNotificationListener` (`components\providers.tsx:33`) | see paths | Med | M–L | Medium |
| A15 | `react-beautiful-dnd` on React 19 with in-repo workaround `// Fix for react-beautiful-dnd invariant failure in React 18+` | `admin\settings\components\NavigationManager.tsx:29` (+ `admin\faqs:25`, `admin\testimonials:20`) | Med | M | **High** |
| A16 | `globals.css`: 50 `!important`, 19 `::-webkit` selectors; `rounded-[2.5rem]` magic value in **68 files / 100+ sites** | `app\globals.css`; src-wide | Med | M | Medium |
| A17 | Unused-dep candidates (**flagged, not asserted**): `@tanstack/react-table` (0 matches in `src`), `uppy` meta-pkg (0 direct imports), `@capacitor/*` (0 in `src` — needed by `android/`, **do not remove**) | `frontend\package.json` | Low | S | Medium (verify) |

### Proposed shared layout hierarchy

```
app/layout.tsx                          [exists] fonts, Providers, skip-link
├─ MarketingShell                       [exists] Navbar + Footer — already absorbs 100% nav/footer
│  └─ MarketingPage                     [exists] shell + hero + PageContainer
│     ├─ MarketingSection               [exists]
│     ├─ LandingSectionHeader           [exists, landing-only → adopt for section headings]
│     ├─ CTABanner                      [exists, 2 adopters → absorb A9]
│     └─ LegalPageLayout                [exists, 3 adopters — fully adopted]
├─ admin/layout.tsx → DashboardShell    [exists]
│  └─ dashboard/layout.tsx → DashboardShell [exists]
│     ├─ DashboardPageContainer         [exists, 47 files]
│     ├─ DashboardPageHeader            [MERGE with DashboardGreetingBar → A3]
│     └─ DashboardSuspenseFallback      [exists, extend → A7]
└─ AuthPageShell                        [exists, 9 adopters → absorb A1, A4, A11]
```

Page templates: `AuthFormPage` (A1/A11), `AuthStatusPage` (A4), `DashboardListPage` (A3/A7), `DashboardMessagesPage` (A2), `MarketingLandingPage` (A9/A10/A12), shared error/not-found boundary (A8).

---

## B. Database

Live schema is **structurally consistent with applied migrations**: 47 live tables, zero live-only tables, zero orphaned columns, all PKs/FKs present, 81/81 migrations matched. The problem is **code that moved ahead of the database**.

### Blockers (all verified by direct query)

| ID | Finding | Proof | Sev | Eff | Risk |
|---|---|---|---|---|---|
| B1 | `faqs.sort_order` / `testimonials.sort_order` **don't exist** → public `GET /api/faqs`, `GET /api/testimonials` + all admin CRUD/reorder throw SQL 1054. Cache cold (`cache` = 0 rows) so no stale fallback | `SELECT sort_order FROM faqs;` → ERROR 1054; `Api\Marketplace\MarketplaceContentController.php:19,27` | **Blocker** | S | Low |
| B2 | `users.two_factor_setup_required` **doesn't exist** → registration `INSERT` throws (`Auth\RegisteredUserController.php:40`), 2FA confirm throws (`TwoFactorController.php:80`). **Separate silent failure:** `EnsureTwoFactorSetup` reads it off the model → `null` → **the 2FA-setup gate is a no-op today** | ERROR 1054; `Http\Middleware\EnsureTwoFactorSetup.php:18` | **Blocker** | S | **Medium** |
| B3 | Table `email_login_codes` missing → all email-code login endpoints throw 1146 | `routes/api.php:31,35,59`; `Auth\EmailCodeController.php:38` | **Blocker** | S | Low |
| B4 | Table `webauthn_credentials` missing → all passkey endpoints throw 1146 | `routes/api.php:41–44,55–56`; `Auth\PasskeyController` | **Blocker** | S | Low |
| B5 | **SQLite-only SQL on MySQL**: `strftime('%Y-%m', created_at)` | `Admin\FinanceController.php:44`; `SELECT strftime(…)` → ERROR 1305 | **Blocker** | S | Low |

Fixes for B1–B4 already exist as unapplied migrations — no code to write, only running `php artisan migrate`. Rollbacks present (`renameColumn` back / `dropColumn` / `dropIfExists`).

### Other schema findings

| ID | Finding | Path | Sev | Eff | Risk |
|---|---|---|---|---|---|
| B6 | `BlogPostResource.php:21` returns `content`; `BlogClient.tsx:112` renders `post.body` → **blog detail body renders empty** | both paths | High | S | Low |
| B7 | Missing index `conversations.last_message_at` — `orderByDesc` on every chat list | `Api\ChatController.php:29`, `Admin\AdminChatController.php:15` | High | S | Low |
| B8 | Missing indexes: `users.role/is_active/created_at/deleted_at`; `deleted_at` on all 7 soft-delete tables; `bookings.mpesa_checkout_id` (`Api\MpesaController.php:104`); `payments.created_at/payment_method`; `site_settings.group`; `page_features.order_index/is_active`; `messages.read_at`; `service_categories.name`; `providers.is_verified`; `faqs`/`testimonials` `is_active+sort_order` | see paths | Med | S | Low |
| B9 | **3 redundant indexes**: `bookings.bookings_customer_id_status_index`, `bookings.bookings_provider_id_status_index`, `provider_services.provider_services_provider_id_index` | live schema | Low | S | Low |
| B10 | Pending migration `2026_08_16_123829_…` would add **3 duplicate indexes** (columns already indexed by their own FKs) | `database\migrations\2026_08_16_123829_*.php` | Low | S | Low |
| B11 | Naming: sort column = `service_categories.sort_order` / `page_features.order_index` / `faqs.order` / `testimonials.order`. Image column: 7 names. `provider_availability` singular. `providers.rating_avg` vs API `rating` | multiple | Low | S/M | Low/Med |
| B12 | `service_categories` / `services` have **no `slug` column**; slugs synthesized in PHP by loading all rows → 2 same-named categories resolve to the first | `MarketplaceCatalogController.php:95–97,123–135` | Med | M | Medium |
| B13 | `blog_posts.view_count` **doesn't exist**; `BlogPostResource.php:26` emits `0` always | `app\Http\Resources\BlogPostResource.php:26` | Low | S | Low |
| B14 | Spatie permission tables installed, 0 rows, **no app code calls** `hasRole`/`assignRole`/`Gate` — authz is `EnsureAdmin.php:14` string check | `config/permission.php`, `User.php:15` | Low | S | **High** if dropped |

**No orphaned table or column found.** Caveat: the column scan covers `where/orderBy/groupBy/select/sum/pluck/value` literals + `$fillable` + resources; dynamic `DB::table(...)->where($var)` would evade it — none found, but not mathematically exhaustive.

### DESTRUCTIVE LIST (approved per recommendations)

| # | Item | Approved? | Reversible? |
|---|---|---|---|
| X1 | Run `php artisan migrate` (5 pending) — B2 gate turns on for new registrations | ✅ **approved** | Yes (`migrate:rollback --step=4`) |
| X2 | Rename `faqs.order`→`sort_order`, `testimonials.order`→`sort_order` | ✅ **approved** | Yes (`down()` renames back) |
| X3 | Drop the 3 redundant indexes (B9) | ✅ **approved** | Yes (recreate exact definitions) |
| X4 | Delete migration `2026_08_16_123829_*` (B10) | ✅ **approved** | Yes (git) |
| X5 | Drop Spatie permission tables (B14) | ❌ **do NOT drop** (my recommendation, accepted) | n/a |
| X6 | Purge 94 MB MP4 from **git history** (`git filter-repo`) | ⏸ **deferred** — separate decision, rewrites shared history | No |
| X7 | Drop `public/assets/zogin/**` (7.8 MB) | ✅ **delete** | Yes (git) |

---

## C. MVC completeness

**Matrix highlights:** 32/32 models have ≥1 route · **0 duplicate method+URI** across 261 registered routes · all 75 controllers routed · create/edit UI verified to live inside dialogs before being called a gap.

### Gaps that break the running app

| ID | Finding | Path | Sev | Eff | Risk |
|---|---|---|---|---|---|
| C1 | Frontend calls `DELETE /api/admin/media/{mediaId}` → **404**; only `/api/admin/media/revert` and `/api/media/{id}` exist | `frontend\src\components\shared\DashboardImageUpload.tsx:167` | **High** | S | Low |
| C2 | Route `DELETE /api/admin/media/revert` → `Admin\MediaController@delete` — **method does not exist** → guaranteed 500 | `backend\routes/api.php:214` + `Admin\MediaController.php` | **High** | S | Low |
| C3 | `GET /api/admin/financials/charts` → **no route** → finance charts silently render zeros | `frontend\src\components\admin\FinanceOverview.tsx:67`; `backend\routes\api.php:292–294` | **High** | S | Low |
| C4 | `PATCH api/chat/conversations/{id}/read` **never called** — `ChatInterface` zeroes locally → **read state never persisted** | `frontend\src\components\chat\ChatInterface.tsx` | **High** | S | Low |
| C5 | Address **edit has no UI**: `PUT`/`GET api/client/addresses/{address}` orphaned | `Client\AddressController`, `AddressFormDialog.tsx` | Med | M | Low |

### Orphaned routes / dead attack surface (~20)

`GET api/admin/finance`, `GET api/admin/finance/transactions` (page is a redirect stub) · `GET api/featured-services` ×3 · `GET api/top-providers`, `GET api/providers` · `GET api/categories/{category}`, `GET api/categories/{slug}/{slug}` (both frontend pages redirect stubs) · `GET/PATCH api/client/bookings/{id}`, `PATCH api/client/bookings/{id}/cancel`, `GET api/provider/bookings/{id}` · `PATCH api/admin/bookings/{id}/status`, `GET api/admin/bookings/{id}` · `POST api/chat/messages` · `POST api/auth/email-code/login` · `GET api/dashboard` (closure) · `GET api/payments/receipt/{booking}` (closure) · `POST api/admin/promo-codes/validate` · the `show` leg of every `apiResource` (11 entities) · `GET api/providers/{provider}/reviews`. Severity **medium**, effort **M**, risk **low**.

### Conflicting/overlapping implementations

| ID | Finding | Path | Sev | Eff | Risk |
|---|---|---|---|---|---|
| C6 | **Booking status implemented 3×**; `Admin\BookingController::updateStatus` (middleware only, **no policy**) vs `Api\…` (`$this->authorize`) vs `Client\…::cancel`. **Admin completing/cancelling awards/reverts no loyalty points** | `Admin\BookingController.php:51–68`, `Api\BookingController.php:22–46`, `Client\BookingController.php:58–79` | **Blocker** | M | Medium |
| C7 | **Dual 2FA stacks**: custom `api/auth/two-factor*` (used) **and** Fortify auto-routes `user/two-factor-*`, `two-factor-challenge` | `routes\api.php`, `vendor/laravel/fortify` | Med | L | **High** — **in scope (approved)** |
| C8 | **Dual auth entry points**: `routes/auth.php` web `POST login/register/…` vs `api/auth/*` (SPA) | `routes\auth.php` vs `routes\api.php` | Med | M | Medium — **in scope (approved)** |
| C9 | Two finance controllers: `Admin\FinanceController` (unused) vs `Api\Admin\FinancialController` (used), different shapes | both | Med | M | Medium |
| C10 | Same handler registered twice (different URIs): `POST /api/media/upload` (`:117`) + `POST /api/admin/media/upload` (`:213`); `GET /api/settings` + `GET /api/admin/settings` | `routes\api.php` | Low | S | Low |
| C11 | `Api\VerificationController` serves admin + provider routes with different authz; re-checks role though route has `middleware('admin')` | `Api\VerificationController.php:17–31,83` | Low | S | Medium |
| C12 | 3 models never referenced by class name in controllers — reachable via relations/services: `ProviderAvailability`, `ProviderScheduleException`, `BookingActivityLog`. **Not dead** (all have routes) | see paths | Low | S | Low |

**Uncertain / flagged:** 2 closure routes (`GET /dashboard`, `GET /payments/receipt/{booking}`) have no `Controller@method`; route names under `api.admin.*` never used (frontend uses literal URLs).

---

## D. Redundancy

### Dead code (every claim backed by the search that proves it)

| ID | Suspect | Size | Searches run (pattern → path → hits) | Confidence | Sev/Eff/Risk |
|---|---|---|---|---|---|
| D1 | `backend/documentation/**` — 94 MB `GG1M7488.mp4` + 5 abandoned scaffolds (`web-app` 33 F, `mobile-app` 12 F, `user/provider/review-service` 17 F each) | 115 F / **94.79 MB** | `documentation/` @root → **1** (self-ref in own `.md`); scaffold names @backend → **0**; CI + `cpanel.yml` + `scripts/*` → **0**; `Test-Path …/node_modules` → False; pack 150.85 MiB, MP4 = **62 %** | **High** | **High**/S/Low |
| D2 | `backend/resources/js/**` — complete legacy Inertia React app | 100 F / 10,732 L | `Inertia::render` @root → **0**; `view('app')` → **0**; `PublicLayout\|Pages/Welcome` → 40, **100 % internal**; its `route('marketplace.search'…)` → **no such named routes** (100+ calls); `public/build` → False; tests/CI/frontend → 0 | **High** | **High**/M/Medium |
| D3 | `backend/templates/zogin-master/**` purchased HTML theme | 145 F / 10.6 MB / ~12.7 k text lines | `templates/zogin\|zogin-master` @root → **0**; `zogin` @root → 99, all inside this dir or dead suspects; build configs + CI → **0** | **High** | Med/S/Low |
| D4 | `backend/resources/views/app.blade.php` + `resources/css/zogin-styles.css` | 31 L / 249 L | `app\.blade` @root → **0**; `view(['"]app['"])` → **0**; `zogin-styles` → **1** (`resources/js/app.jsx:2`, dead) | **High** (delete with D2) | Med/S/Low |
| D5 | Stray debug files, all tracked **and deployed**: `backend\public\settings_debug.json` (**web-readable**), `all_output.txt`, `check_services.php`, `list_all.php`, `inject_corporate_keys.php` (refs non-existent `App\Models\Setting`), `FIXES_PHASE1_SUMMARY.md` | 6 files | ref-grep each name @root → **0** | **High** | **High** (security)/S/Low |
| D6 | `frontend\src\lib\api-endpoints.ts` dead registry | 147 L | `from "@/lib/api-endpoints"\|API.<group>.` → 24, **all in its own test**; ~100 URLs hard-coded instead | **High** | Med/M/Low |
| D7 | `Support\ApiResponse` used once of 75 controllers; `LoyaltyService::awardPointsForReview` never called; `Cache::forget('api_page_features_all')` ×3 with **0** `remember`; 5 seeders absent from `DatabaseSeeder::$call` | various | search log #23,25,29,40 | **High** (flagged, not deleted) | Low/S/Low |
| D8 | `backend\public\assets\zogin\*\*` | 101 F / 7.8 MB | `zogin` @frontend → **0**; `/assets/` @frontend → 20, **all `/assets/branding/*`**; live DB `site_settings`/`email_templates`/`blog_posts`/`page_features` → **0** rows matching `%zogin%` | **High** (DB check closed) — residual caveat: unreferenced `SiteSettingSeeder.php` could be run manually | Med/S/**Medium** |

**Deploy impact (verified):** `deploy.yml:36` `tar -C ./backend --exclude=public,vendor,storage,…` and `cpanel.yml:6` `cp -R backend/*` ship **D1+D2+D3** every release ≈ **106 MB of ~107 MB backend payload** (real runtime ≈ 1 MB).

### Duplicate implementations

| ID | Finding | Path(s) | Sev/Eff/Risk |
|---|---|---|---|
| D9 | **Booking-status loyalty rule triplicated**; admin path awards/reverts nothing (same root as C6) | `Admin\BookingController.php:51`, `Api\BookingController.php:22`, `Client\BookingController.php:58` | **Blocker**/M/Medium |
| D10 | Booking **authorization ×11 sites / 5 mechanisms**: `BookingPolicy` (unreachable branch `:44–48`), `HasProviderAuthorization`, `BookingService.php:151–162`, `Client\BookingController:34,61`, `routes/api.php:175–179`, + 6 inline `403`s | see paths | High/M/Medium |
| D11 | **Revenue 2 incompatible definitions in 5 controllers**: `SUM(platform_fee)` (`Dashboard:23`, `Analytics:44,45,78`), `SUM(amount)` (`Finance:19–21,44`, `Payment:33–36`) vs `SUM(final_price,estimated_price)` (`Api\Admin\Financial:25–31`) | see paths | High/M/Medium |
| D12 | User+Provider provisioning **×4 divergent defaults** | `Admin\ProviderController.php:66–105`, `Api\ProviderApplicationController.php:16–48`, `ProviderManagementService.php:51–78`, `Models\User.php:155–170` | High/M/Medium |
| D13 | Payments list/search query built **near-verbatim twice** | `Admin\PaymentController.php:11–31` ↔ `Admin\FinanceController.php:55–78` | Med/S/Low |
| D14 | Customer-name `LIKE` search block **×6–9** | `AdminChatController:21`, `FeedbackController:25`, `PaymentController:19`, `UserController:24`, `ProviderController:31`, `DashboardSearchController:143,189,213,241`, `Api\Admin\FinancialController:52`, `Models\Booking.php:162` | Med/M/Low |
| D15 | Base-URL resolution **×7** | `lib\api-base-url.ts:7,34`, `lib\utils.ts:48`, `admin\workforce\verification:79`, `DashboardImageUpload:47`, `auth\google\callback:24`, `lib\ssr-settings.ts:8`, `next.config.ts` | Med/S/Low |
| D16 | Currency ×3 definitions + 22 inline; 36 ad-hoc `toLocaleDateString` | `PaymentDetailSheet.tsx:37` ≡ `admin\payments\page.tsx:135`, `admin\analytics:91`, `FinanceOverview:92…`, `CheckoutDialog`, `VirtualReceipt` | Med/S/Low |
| D17 | Status **filter tables ×4**; `admin\bookings\page.tsx:153–156` **missing `in_progress`**; `admin\contact\page.tsx:162` bypasses `lib\status-styles.ts` (color maps themselves **are** centralized — lead suspect disproved) | see paths | Med/S/Low |
| D18 | 3 overlapping fetch hooks + 4 ad-hoc SWR fetchers + `/api/categories` fetched in **8 places** | `useData.ts`, `useLandingFetch.ts:14–51`, `usePageFeatures.ts:15–36`, `app\services\page.tsx:84`, `GlobalSearch:142`, `HeroSearchModal:155`, `ServiceMegamenu:111`, `MarketingFilterSidebar:55`, `FeaturedServices:30`, `Categories:102` | Med/M/Med |
| D19 | Deprecated re-exports duplicating canonical helper | `lib\chat-utils.ts:6,8`, `lib\provider-services-api.ts:5` vs `lib\api-response.ts:5` | Low/S/Low |
| D20 | Backend npm: 5 deps imported by **nothing**: `@hookform/resolvers:33`, `@tanstack/react-table:46`, `@laravel/echo-react:12`, `zod:64`, bare `radix-ui:57` | `backend\package.json` | Low/S/Low |
| D21 | **Security:** OpenSSH **private key on disk** `github-actions-kuba-home-service` (+`.pub`) — gitignored, not committed | repo root | High/S/n-a |
| D22 | 4 response-envelope shapes coexist; `ApiResponse` used once | `Admin\BlogController:15`, `Api\BlogController:31`, `Admin\FeedbackController:15`, `Api\BookingController:42` | Low/**L**/**High** — **in scope (approved)** |

---

## Consolidated register — safest & highest value first

| # | ID | Finding | Sev | Eff | Risk |
|---|---|---|---|---|---|
| 1 | B1–B5 | 5 unapplied migrations + SQLite `strftime` + `post.body`/`content` | **Blocker** | S | Low–Med |
| 2 | C1–C3 | Admin media 404/500 + `financials/charts` 404 | **High** | S | Low |
| 3 | C6/D9 | Booking-status loyalty divergence | **Blocker** | M | Medium |
| 4 | C4 | Chat read-state never persisted | **High** | S | Low |
| 5 | D5 | `settings_debug.json` publicly served | **High** | S | Low |
| 6 | D1 | 94 MB MP4 + 5 scaffolds in git & every deploy | **High** | S | Low |
| 7 | A2 | messages pages 88.2 % duplicate | High | S | Low |
| 8 | A3/A5 | competing headers; Leaflet CSS ×2 globally | High | S/M | Low |
| 9 | A1 | login pair 83.2 % duplicate | High | M | Medium |
| 10 | B7/B8 | missing indexes | High/Med | S | Low |
| 11 | D2/D3/D4/D8 | dead Inertia app, theme, blade, zogin assets | High | M | Med |
| 12 | C5, C7, C8 | address edit UI; dual 2FA; dual auth | Med | M–L | **High** |
| 13 | D10–D14 | authz ×11, revenue ×5, provisioning ×4 | High | M | Medium |
| 14 | A4–A12 | remaining layout consolidation | High/Med | M | Low–Med |
| 15 | D22 | response-envelope unification | Low | L | **High** |

---

## Search log (compressed — full re-runnable list in session)

| # | Pattern | Path | Result |
|---|---|---|---|
| 1 | `zogin` | repo root | 99 — only seeders, `app.blade.php`, `resources/js`, `zogin-styles.css`, `settings_debug.json`, theme itself |
| 2 | `Inertia::render` | repo root | **0** |
| 3 | `templates/zogin\|zogin-master` | repo root | **0** |
| 4 | `zogin-styles` | repo root | 1 (`resources/js/app.jsx:2`) |
| 5 | `PublicLayout\|Pages/Welcome` | repo root | 40, 100 % inside `resources/js` |
| 6 | `app\.blade` / `view(['"]app['"])` | repo root | **0 / 0** |
| 7 | `zogin` | `frontend/` | **0** |
| 8 | `resources/js` | repo root | 7 (build config + docs only) |
| 9 | `view('` | `backend/app/**` | 2 — `invoices.booking`, `emails.unsubscribed` |
| 10 | `@routes\|ziggy` | repo root | 9 — real use only `app.blade.php:23` |
| 11 | `documentation/` | repo root | 1 self-ref |
| 12 | `GG1M7488` | repo root | **0** |
| 13 | `api_page_features_all` | `backend/` | 3 — all `Cache::forget`, never `remember` |
| 14 | `LoyaltyPoint::create\|awardPoints\|revertPoints` | `backend/` | 27 |
| 15 | `ApiResponse::` | `backend/` | **1** usage of 75 controllers |
| 16 | `axios.create\|baseURL` | `frontend/src` | 2 (both `lib/axios.ts`) |
| 17 | `from "@/lib/api-endpoints"\|API.<group>.` | `frontend/src` | 24 — all in its own test file |
| 18 | `formatKES\|formatCurrency\|KES` | `frontend/src` | 100+ |
| 19 | `next/script\|<Script\|gtag\|GTM-\|hotjar\|plausible` | `frontend/src` | **0** |
| 20 | `@tanstack\|from "uppy"` | `frontend/src` | **0 / 0** |
| 21 | `@/components/layout/Navbar\|Footer` | `frontend/src` | 2, both in `MarketingShell.tsx` |
| 22 | `financials/charts` | `frontend/src` | 1 (`FinanceOverview.tsx:67`) |
| 23 | `admin/media` | `frontend/src` | 3 (`DashboardImageUpload.tsx:136,167`, dead registry) |
| 24 | `SELECT`/`SHOW`/`information_schema` | MySQL `home_service` | 47 tables, 81 migrations, 0 `%zogin%` rows, 5 pending migrations, `faqs.order` present |


---

## Phase 1 execution log (appended after the read-only audit)

### Phase 0 - verified runtime blockers (all fixed first)

| Commit | Item | Fix |
|---|---|---|
| `2387be9` | finance monthly revenue used SQLite `strftime` | `DATE_FORMAT` for MySQL |
| `3c467be` | the fix above broke the SQLite test suite | branch on `DB::getDriverName()` |
| `2d81812` | blog post rendered `post.body`, API returns `content` | read `content` |
| `7c0e0c8` | `DELETE /media/revert` pointed at a nonexistent action | route to `MediaController@destroy` |
| `c7a0773` | `GET /api/admin/financials/charts` had no route | added to admin group |
| `07b936a` | public `settings_debug.json` + 4 debug scripts | deleted, summary moved to `docs/` |

C4 (chat read-state) was a **false positive**: `ChatController::getConversation:61-64`
already persists `read_at` on every message fetch, so `ChatInterface` needs no PATCH.
The `PATCH .../conversations/{id}/read` route stays orphaned (see C-register).

### Phase 1 - layout consolidation

| Item | Commit | Result |
|---|---|---|
| A2 messages pages (88.2%) | `616a3d6` | `MessagesWorkspace`, both pages are delegates |
| A7 six identical spinners | `8338510` | `DashboardLoadingPage` |
| A5 Leaflet CSS on all 85 routes | `0f1e59f` | global import removed, 4 component imports kept |
| A8 triplicated error.tsx + no 404 | `ee3ebbf` | shared `RouteError` + `app/not-found.tsx` |
| A12 investors double container | `baa3972` | nested `max-w-7xl px-4` removed, unused import dropped |
| A3 competing page headers | `301dd35` | unified on `DashboardGreetingBar`, `DashboardPageHeader` deleted |
| A1 login pair (83.2%) | `d931401` | shared `LoginForm`, -663 lines across the two pages |
| A11 register pair (55.2%) | `f3e566c` | shared `RegisterCredentialFields` only |

### Decisions taken during execution

- **A9 - skipped** (user decision). `about`'s plain two-button CTA and `CTABanner`'s
  coloured one-button card are different designs; adopting CTABanner would drop the
  second CTA and change `/about`. `landing/CTA.tsx` is **not** dead - `app/page.tsx:33`
  imports it dynamically. Three CTA implementations are accepted variance.
- **A4 - skipped** (analysis). The "8 hand-rolled card shells" are all
  `min-h-screen ... flex items-center justify-center` wrappers around unrelated
  content (role-choice grid, spinner, error). Tailwind already owns that string;
  a component would be over-abstraction rather than deduplication.
- **A3 note**: `mb-8` is passed explicitly at every migrated call site so vertical
  rhythm is unchanged; the accepted visual change is the wrapper alignment and the
  actions container coming from `DashboardGreetingBar`.
- **A1 note**: the reset-success banner now renders in both login variants. It can
  only ever appear on `/login`, because `reset-password` always pushes
  `/login?reset=success`, so provider output is unchanged.

### Verification gates run after each change

`npx tsc --noEmit` (only the pre-existing `useCrudForm.test.ts:64` TS2345 remains),
`npx eslint src` on touched files, `npm test` (30 suites / 235 tests),
`npm run build` (exit 0), backend `php artisan test` (418 passed, 1 pre-existing risky),
`php artisan route:list --json` (262 routes, 0 duplicate method+URI).
`npm run lint` is unusable - Next 16 removed `next lint`.
