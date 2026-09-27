# Phase 1 — Audit Report (read-only, no code changes)

**Repo:** `C:\wamp64\www\Kuba-hs` · HEAD `61828e0` · tree clean at audit time
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
| X6 | Purge 94 MB MP4 from **git history** (`git filter-repo`) | ✅ **done** — 153.94 MiB → 59.90 MiB, every commit hash remapped (see the history note) | restore from `Kuba-hs-before-purge.bundle` |
| X7 | Drop `public/assets/zogin/**` (7.8 MB) | ✅ **delete** | Yes (git) |

---

## C. MVC completeness

**Matrix highlights:** 32/32 models have ≥1 route · **0 duplicate method+URI** across 261 registered routes (this check is structurally incapable of firing - see the Correction in Phase 2 part 4) · all 75 controllers routed · create/edit UI verified to live inside dialogs before being called a gap.

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
| `02d2406` | finance monthly revenue used SQLite `strftime` | `DATE_FORMAT` for MySQL |
| `86ae48f` | the fix above broke the SQLite test suite | branch on `DB::getDriverName()` |
| `63da8ed` | blog post rendered `post.body`, API returns `content` | read `content` |
| `9719acc` | `DELETE /media/revert` pointed at a nonexistent action | route to `MediaController@destroy` |
| `b548607` | `GET /api/admin/financials/charts` had no route | added to admin group |
| `a98dd23` | public `settings_debug.json` + 4 debug scripts | deleted, summary moved to `docs/` |

C4 (chat read-state) was a **false positive**: `ChatController::getConversation:61-64`
already persists `read_at` on every message fetch, so `ChatInterface` needs no PATCH.
The `PATCH .../conversations/{id}/read` route stays orphaned (see C-register).

### Phase 1 - layout consolidation

| Item | Commit | Result |
|---|---|---|
| A2 messages pages (88.2%) | `b194418` | `MessagesWorkspace`, both pages are delegates |
| A7 six identical spinners | `decf0a1` | `DashboardLoadingPage` |
| A5 Leaflet CSS on all 85 routes | `e1dd81d` | global import removed, 4 component imports kept |
| A8 triplicated error.tsx + no 404 | `4846903` | shared `RouteError` + `app/not-found.tsx` |
| A12 investors double container | `e10ff14` | nested `max-w-7xl px-4` removed, unused import dropped |
| A3 competing page headers | `76d097a` | unified on `DashboardGreetingBar`, `DashboardPageHeader` deleted |
| A1 login pair (83.2%) | `16bd0cf` | shared `LoginForm`, -663 lines across the two pages |
| A11 register pair (55.2%) | `cb80fb8` | shared `RegisterCredentialFields` only |

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

---

## Phase 2 log - schema, orphaned routes, dead code

Ordered by risk: reversible schema first, then dead-code deletions, then
route removals, then the behaviour fix. One commit each.

| Commit | Items | What changed |
| --- | --- | --- |
| `5e2032f` | X1, X4 | Dropped the bad FK-index migration (would have added three indexes duplicating `*_foreign`) and ran the four that were still pending: `webauthn_credentials`, `users.two_factor_setup_required`, `email_login_codes`, and the `order` -> `sort_order` rename on `faqs`/`testimonials`. Closes B1-B4. |
| `7f0b0f6` | X7 | Deleted `public/assets/zogin` (101 files, 7.8 MB) and removed the four `zogin` rows from `SiteSettingSeeder` - both proven unreferenced by the live frontend and by live MySQL. |
| `1e52d63` | B7, B8 | New `2026_09_26_000001_add_missing_query_indexes`: 27 indexes, 12 of them `deleted_at` (the register said 7; corrected against the models actually using `SoftDeletes`). Reversible. |
| `43b444c` | D1 | Deleted `backend/documentation` (115 files, 94.23 MB, incl. a 93.75 MB video - 62% of the git pack). `docs/` is canonical. |
| `0f967b6` | D2, D4 | Deleted the entire Inertia app (`resources/js`, `resources/css`, `resources/views/app.blade.php`) plus its toolchain (`vite.config.js`, `package.json`, `tailwind`/`postcss`/eslint configs) and `Vite::prefetch` from `AppServiceProvider`. Kept `routes/web.php` (CORS probes, `/` redirect, `cms-assets` proxy) and the three live views. |
| `813b57b` | D3 | Deleted `backend/templates/zogin-master` (145 files, 10.14 MB). |
| `95f7527` | orphan pass 1 | Removed five routes with zero refs in frontend, backend, tests or `route()` calls: `POST /api/auth/email-code/login`, `GET /api/categories/{slug}/{slug}`, `GET /api/dashboard`, `POST /api/chat/messages`, `POST /api/admin/promo-codes/validate` - with their controller methods. |
| `bebc21e` | orphan pass 2 | The four "obvious duplicates" only: `GET /api/admin/finance`, `GET /api/admin/finance/transactions`, `GET /api/chat/conversations/{id}/read`, `GET /api/featured-services/{id}/similar`. Tests retargeted to the surviving endpoint or dropped with the route. |
| `73d3fed` | C6, D9 | Loyalty moved into `BookingService::updateBookingStatus`; admin/client copies deleted; three regression tests added. |

### Route-count movement

262 -> 253. 0 duplicate method+URI at every checkpoint.

### Method note - two routes looked orphaned and were not

`GET /api/unsubscribe` has no frontend caller but is linked from every
outgoing email (`app/Mail/DynamicMail.php:48` -> `route('api.unsubscribe')` ->
`resources/views/emails/dynamic.blade.php:17`), and
`POST /api/payments/mpesa/callback` is the Safaricom webhook. Both kept.

The orphan search also has to ignore `frontend/src/lib/api-endpoints.ts`: it
is a dead registry (D6, its only importers are its own two test files) whose
stale entries would otherwise mark live routes as "called". Searching with a
param-aware pattern plus a terminator regex - `/[^/]+` for `{param}`, and
`(?=[^A-Za-z0-9_/-]|$)` so `/api/admin/finance` cannot match
`/api/admin/financials/...` - plus that file excluded is what makes the
result trustworthy.

### Verification gates after each Phase 2 change

`php -l` on every touched file, backend `php artisan test`,
`php artisan route:list --json` (0 duplicate method+URI).
Final: **253 routes, 419 passed (3 new), 1 pre-existing risky.**
---

## Phase 2 log - part 2 (dead code, register closures)

| Commit | Items | What changed |
| --- | --- | --- |
| `07ae378` | - | Phase 2 part 1 written up (9 commits, 262 -> 253 routes). |
| `0603d04` | D6 | Deleted `frontend/src/lib/api-endpoints.ts` plus its two tests. The registry had 147 lines, zero production importers, and its `api-contract` test was a placeholder that `readFileSync`'d the file and asserted it contains three strings. |
| `995af77` | D7 | Removed the three `Cache::forget('api_page_features_all')` calls - repo-wide, the key is written nowhere and `index()` queries the table every time, so invalidating it was a no-op. |
| `fb74fcd` | D7 | Deleted `LoyaltyService::awardPointsForReview` (0 callers, nothing in the API, UI or docs promises a review bonus). |
| `0230530` | D7/D8 | Deleted the five superseded `site_settings` seeders: `SiteSettingSeeder`, `LandingPageSettingsSeeder`, `ProfessionalSiteSettingSeeder`, `SegmentPageSettingsSeeder`, `InvestorSettingsSeeder`. |

### Register status after Phase 2 part 2

| # | IDs | Status |
| --- | --- | --- |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 6 | D1 | **closed** - `43b444c` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`; D8's residual caveat (an unreferenced `SiteSettingSeeder` could be run by hand) is now closed too by `0230530` |
| - | D6 | **closed** - `0603d04` |
| - | D7 | **closed** - `995af77`, `fb74fcd`, `0230530`; the `ApiResponse` fragment carries on as D22 |
| - | D13 | **closed** by `bebc21e` - the near-verbatim duplicate was `FinanceController::transactions()`, deleted as an orphan route |
| 13 | D10, D11, D12, D14 | **open** - next |
| 12 | C5, C7, C8 | **open** |
| 14 | A4-A12 | **open** (A4 skipped by decision, A5/A12 already done) |
| 15 | D22 | **open** |

### Two findings worth recording from D13

The duplicate half of D13 was already gone, but comparing it against the
surviving copy exposed a **precedence bug** in `Admin\PaymentController::index`:
the search block is not wrapped, so `transaction_id LIKE ? OR EXISTS(customer)`
is followed by `AND status = ?`, which MySQL reads as
`transaction_id LIKE ? OR (EXISTS(customer) AND status = ?)` - a transaction-id
match escapes the status filter. `Api\Admin\FinancialController::index` has the
same shape: its `whereHas(provider) OR reference_number` runs after an
ungrouped `status` where. Both closed under D14 - see part 3 below.

The surviving sites do group correctly, which is what makes the bug visible:
the deleted `transactions()` had the grouped form. (The `Api\Admin\Financial`
site named above is `payouts()`, not `index()` - `index()` never existed
on that controller.)

## Phase 2 log - part 3 (D14, D11, D10)

| Commit | Items | What changed |
| --- | --- | --- |
| `94c468d` | D14 | Added `User::scopeLike($query, string $search, bool $withEmail = true)` and replaced eleven hand-written copies across nine files (`AdminChatController`, `FeedbackController`, `PaymentController`, `ProviderController`, `UserController`, `Api\Admin\FinancialController`, `Api\DashboardSearchController` x4, `Models\Booking`). Two of those copies were the precedence bugs from the D13 write-up: `Admin\PaymentController::index` (a transaction-id match escaped the `status` filter) and `Api\Admin\FinancialController::payouts` (same, on `reference_number`). Both now wrap the `OR`, proven by tests that fail on the original controllers and pass with the fix. |
| `15d1565` | D11 | `Api\Admin\FinancialController::overview` summed `COALESCE(final_price, estimated_price)` over completed bookings while its own response key is `total_revenue` and the admin tile that consumes it is labelled "Total Platform Revenue". Now sums `payments.platform_fee`, matching `Admin\AnalyticsController::platform_revenue` and the label. Test `financial overview reports platform revenue rather than gross booking value` fails against the original code (verified via stash) and passes with the fix. |
| `52eabce` | D10 part 1 | `BookingPolicy::update` and `BookingService::updateBookingStatus` restated the same rule and had already drifted (the service matched on `customer_id` regardless of role, the policy required `role === Customer`), and the policy carried a second provider branch made unreachable by the provider branch above it. Both now call `BookingService::mayChangeStatus()`, which passes the status from the request (policy) or the status about to be written (service). |
| `fc8582f` | D10 part 2 | Five more view checks now ask `BookingPolicy::view`: `Api\InvoiceController::download`, `Client\BookingController::show`, `Client\BookingController::cancel` (via a new `cancel` ability, because the cancel endpoint sends no status), `Provider\BookingController::show` (plus deleting the unused `getProviderOrFail()` result and the now-orphaned `userOwnsBooking`/`assertOwnsBooking` from `HasProviderAuthorization`), and the `payments/receipt/{booking}` closure. |

### The one deliberate behaviour change in D10

The receipt closure was the only site where the answer moves: it allowed
customer-owns OR admin, and the policy also allows the owning provider.
Recorded rather than quietly made - the route has **zero frontend callers**
(the only receipt-adjacent callers are the three invoice downloaders), and
`Provider\BookingController::show` already hands the provider that same
booking plus `address`, so no new data is exposed. Pinned by
`the booking provider can view the receipt for their own booking`, which
fails against the original closure.

Everything else was verified case by case as equivalent, including the
admin-who-is-also-a-customer case (their role is Admin, so the customer
branch never fires - exactly as before). The one text change: the service's
`Customers can only cancel bookings.` 403 is folded into
`Unauthorized action.`; no test, backend route or frontend string asserts
either, and the policy already answered first for the only API path that
could have produced it.

### Register status after Phase 2 part 3

| # | IDs | Status |
| --- | --- | --- |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 6 | D1 | **closed** - `43b444c` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`, `0230530` |
| - | D6 | **closed** - `0603d04` |
| - | D7 | **closed** - `995af77`, `fb74fcd`, `0230530`; the `ApiResponse` fragment carries on as D22 |
| - | D13 | **closed** by `bebc21e`; the precedence bugs it surfaced are closed by `94c468d` |
| 13 | D10, D11, D14 | **closed** - `52eabce` + `fc8582f`, `15d1565`, `94c468d` |
| 13 | D12 | **disproven, 2 fields residual** - `application_status`, `availability_status`, `compliance_status`, `is_verified` already default correctly in the migration; only `service_radius` (10 vs 25 vs NULL) and `experience_years` (0 vs NULL) actually diverge, and both need a product decision |
| 12 | C5, C7, C8 | **open** - next (address edit UI, dual 2FA, dual auth) |
| 14 | A4-A12 | **open** (A4 skipped by decision, A5/A12 already done) |
| 15 | D22 | **open** |

Gates after every one of those commits: `php -l`, `php artisan test`,
`php artisan route:list --json`. See part 4 for why the "0 duplicate
method+URI" half of that gate was never doing anything.

## Phase 2 log - part 4 (C5, C8, and a correction to the route gate)

| Commit | Items | What changed |
| --- | --- | --- |
| `2f1603f` | C5 | Address edit UI. `PUT`/`GET /api/client/addresses/{address}` existed behind `Route::apiResource` and nothing ever called them: `AddressFormDialog` only POST'd, so a saved address could be added, defaulted or deleted but never corrected. The dialog now takes an optional address, seeds the form from it and PUTs; two payload details are deliberate - `is_default` is carried across (sending the form's default `false` would demote a default address on every edit, and `StoreAddressRequest` accepts it), and the Nairobi pin fallback stays create-only so an address without a pin cannot jump to it on edit. |
| `e053870` | C8 | Removed the five stateful POSTs from `routes/auth.php` (`login`, `register`, `forgot-password`, `reset-password`, `logout`) - all duplicates of `/api/auth/*`, zero frontend callers, zero test callers - and made `AuthenticatedSessionController`, `RegisteredUserController`, `PasswordResetLinkController` and `NewPasswordController` JSON-only. Also fixed the two surviving `route('dashboard')` calls. |

### Correction - the duplicate-route gate could never have fired

Every "0 duplicate method+URI" checkpoint in this document is true but
vacuous. `RouteCollection::addToCollections()` stores routes as
`$this->routes[$method][$domainAndUri] = $route` and `$this->allRoutes[
implode('|', $methods).$domainAndUri] = $route`, and
`RouteCollection::getRoutes()` returns `array_values($this->allRoutes)`.
A second route for the same method and URI does not appear twice in the
listing - it **replaces** the first. `route:list` therefore cannot report
one, and our `Group-Object method,uri | Where Count -gt 1` check was
measuring something the framework prevents.

This was not hypothetical. `routes/auth.php` and Fortify both registered
`POST /login|register|forgot-password|reset-password|logout`; the later
registration silently replaced the earlier, so the audit's "dual auth
entry points" were in practice a pair, with the winning half decided by
load order. Stashing `routes/auth.php` and re-running `route:list`
showed the action flip from `App\...\AuthenticatedSessionController` to
`Laravel\Fortify\...\AuthenticatedSessionController` on the same URI,
with the route count unchanged at 253.

What the gate should have been measuring, and what still needs doing:

- **Route names.** `Group-Object name` does surface collisions, because
  `nameList` keeps a route per name but `route:list` prints the name of
  every route. It now reports `api.admin. x56` and nothing else.
  That one is pre-existing and harmless: `routes/api.php:175` opens a
  group with `'as' => 'api.admin.'`, and every route inside it that
  does not declare its own name ends up answering to the bare prefix -
  56 of them, first-registered wins. Nothing resolves that name (the
  frontend uses literal URLs throughout, as noted above), so it is
  recorded rather than fixed. `password.update x2` was introduced by C8
  and is gone, by leaving `PUT /password` unnamed rather than claiming a
  name Fortify already holds.
- **Actions behind a URI.** Two implementations of one action behind one
  URI only show up by diffing the action, which is what the stash check
  above did.
- **Every HTTP verb when grepping for callers.** The first pass over
  `PUT /password` concluded "zero callers" by grepping POST patterns
  only; `tests/Feature/Auth/PasswordUpdateTest` exercises it and failed
  the suite. The route was restored in the same commit. Callers must be
  searched per verb, and the test suite is what catches the miss.

### What C8 did not close

Fortify registers its own `POST /login|register|logout|forgot-password|
reset-password` (plus `/two-factor-challenge`, `/user/two-factor-*`,
`/user/confirm-password`, `/user/password`, `/user/profile-information`
and the passkey endpoints). Before C8 those five POSTs were shadowed by
`routes/auth.php`; with ours gone they are now the routes that answer.
Both halves were, and remain, uncalled - zero axios calls in
`frontend/src` reach any non-`/api/auth` auth endpoint (every `/login`
and `/register` hit is a Next.js `router.push` or `<Link>`, landing on
the frontend's own page), and no test reaches them.

The switch is one line: `Fortify::$registersRoutes = false;` in
`AppServiceProvider::register()` (it has to run before the package
provider's `boot()` calls `configureRoutes()`). That is C7's decision
to make, not a follow-on from C8 - it is the same flag that would drop
Fortify's 2FA routes, which is the "which stack survives" question the
register puts under C7.

### Register status after Phase 2 part 4

| # | IDs | Status |
| --- | --- | --- |
| 12 | C5 | **closed** - `2f1603f` |
| 12 | C8 | **closed** for `routes/auth.php`; the Fortify half above is handed to C7 |
| 12 | C7 | **closed** - `9638e94` |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 6 | D1 | **closed** - `43b444c` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`, `0230530` |
| - | D6, D7, D13 | **closed** - `0603d04`; `995af77`/`fb74fcd`/`0230530`; `bebc21e` + `94c468d` |
| 13 | D10, D11, D14 | **closed** - `52eabce` + `fc8582f`, `15d1565`, `94c468d` |
| 13 | D12 | **disproven, 2 fields residual** - only `service_radius` and `experience_years` actually diverge, both need a product decision |
| 14 | A4-A12 | **open** (A4 skipped by decision, A5/A12 already done) |
| 15 | D22 | **open** |

Gates after every one of these commits: `php -l`, `php artisan test`
(427 passed, 1 pre-existing risky), `php artisan route:list --json` -
253 routes. The duplicate-name check is the one worth keeping:
`Group-Object name | Where Count -gt 1`, currently only `api.admin. x56`.

## Phase 2 log - part 5 (C7, and register item 12 is closed)

| Commit | Items | What changed |
| --- | --- | --- |
| `9638e94` | C7 | `Fortify::ignoreRoutes()` in `AppServiceProvider::register()` - Fortify's second two-factor stack and its fifteen other routes are gone. Route table 253 → 234, `Laravel\Fortify\*` actions 0. |

Fortify was registering nineteen routes of its own on top of the ones
`/api/auth` serves: `POST /login|register|logout|forgot-password|
reset-password`, `GET`+`POST /two-factor-challenge`, the five
`/user/two-factor-*` routes, `/user/confirmed-two-factor-authentication`,
`/user/confirm-password`, `/user/confirmed-password-status`,
`/user/password`, `/user/profile-information` and the `/passkeys/*`
pair. C7 was filed because the second 2FA stack was one of them.

Before switching it off, the caller search was redone per verb (the
`PasswordUpdateTest` miss in part 4 is the reason): zero axios/fetch
calls in `frontend/src` reach any of these URIs - the only absolute
paths the frontend ever posts to are `/api/auth/*`, and its `/login` and
`/register` strings are `router.push`/`<Link>` targets. Zero test
references. The six URIs both stacks shared had already been decided by
load order in our favour - `/login`, `/register`, `/forgot-password`,
`/reset-password/{token}` and `/verify-email` are closures in
`routes/auth.php`, and `POST /email/verification-notification` is our
controller - so nothing was shadowed *back*.

Two details that are easy to get wrong:

- It belongs in `register()`, not `boot()`. `Fortify::ignoreRoutes()`
  only sets `Fortify::$registersRoutes = false`, and
  `FortifyServiceProvider::boot()` is what reads it. All providers'
  `register()` calls complete before any `boot()`, so either provider's
  registration phase works - but `boot()` on `FortifyServiceProvider`
  would be too late, and `AppServiceProvider::boot()` would be a race.
- The provider itself stays. Its bindings and its `configurePasskeys()`
  block still configure `laravel/passkeys` (user model, config, and
  `LaravelPasskeys::ignoreRoutes()`, which is what keeps the package's
  *own* routes out). Turning the routes off does not turn the package off.

`tests/Feature/Auth/SingleAuthEntryPointTest` pins both directions: the
Fortify URIs 404, `POST /api/auth/two-factor/challenge` still answers,
and the `GET` redirects to the frontend still work. Note `POST /login`
is 405 rather than 404 - our `GET /login` owns the URI, so only the
method is missing, which is exactly the shape of "one entry point, one
contract". Stashing `AppServiceProvider` fails two of the four tests.

### Register status after Phase 2 part 5

| # | IDs | Status |
| --- | --- | --- |
| 12 | C5, C7, C8 | **closed** - `2f1603f`, `9638e94`, `e053870` |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 6 | D1 | **closed** - `43b444c` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`, `0230530` |
| - | D6, D7, D13 | **closed** - `0603d04`; `995af77`/`fb74fcd`/`0230530`; `bebc21e` + `94c468d` |
| 13 | D10, D11, D14 | **closed** - `52eabce` + `fc8582f`, `15d1565`, `94c468d` |
| 13 | D12 | **disproven, 2 fields residual** - `service_radius`, `experience_years`, both need a product decision |
| 14 | A4-A12 | **open** (A4 skipped by decision, A5/A12 already done) |
| 15 | D22 | **open** |

Gates after every one of these commits: `php -l`, `php artisan test`
(431 passed, 1 pre-existing risky), `php artisan route:list --json` -
234 routes, 0 `Laravel\Fortify\*` actions, duplicate-name check shows
only the pre-existing `api.admin. x56`.

## Phase 2 log - part 6 (A10)

| Commit | Items | What changed |
| --- | --- | --- |
| `6ddf2ae` | A10 | `components/marketing/VerticalSalesPage` now holds the thesis grid, value-prop cards, image panel, category band and CTA that `commercial` and `cooperatives` both duplicated. 237 lines of page → 108, plus one 138-line component. |

The two pages were structurally identical and differed only in content:
CMS key prefix, icons, which value-prop slot each page fills
(commercial `1`+`2`, cooperatives `1`+`3`), accent colour, image group
(`market_narratives` vs `sections`), and CTA copy. All of that moved
into props. The one abstraction introduced is `accent`, which replaces
three props that always had to agree - the value-prop icon colour, the
`FeatureCardGrid` `accentColor` and the `CTABanner` `bgColor` - because
they are the same accent and were drifting in lockstep across two files.

**How it was verified.** A throwaway Jest test rendered both pages with
`useCMS`/`usePageFeatures`/`useMarketingHero` mocked and
`MarketingPage` stubbed to a passthrough, serialised the markup, and ran
that *before* the refactor and again *after*. Both outputs are 8223
bytes and share the SHA-256 `F07078DC…`. This is stronger than it looks:
lucide renders real `<svg>` elements, so the markup proves commercial
still renders `lucide-chart-column` and cooperatives still renders
`lucide-zap`, and the mocked `CTABanner`/`FeatureCardGrid` dump their
props as JSON, so every CTA string and accent class is covered
byte-for-byte. The test was deleted afterwards.

The same technique - render/serialise before, refactor, diff - is the
cheap way to prove any JSX refactor is output-preserving, and it is worth
reaching for again on the remaining A-items.

### Register status after Phase 2 part 6

| # | IDs | Status |
| --- | --- | --- |
| 14 | A4-A12 | **closed** - A4, A9 skipped by decision; A5/A7/A8/A10/A11/A12 done. Last one closed by `27d160b` |
| 12 | C5, C7, C8 | **closed** - `2f1603f`, `9638e94`, `e053870` |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 6 | D1 | **closed** - `43b444c` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`, `0230530` |
| - | D6, D7, D13 | **closed** - `0603d04`; `995af77`/`fb74fcd`/`0230530`; `bebc21e` + `94c468d` |
| 13 | D10, D11, D14 | **closed** - `52eabce` + `fc8582f`, `15d1565`, `94c468d` |
| 13 | D12 | **disproven, 2 fields residual** - `service_radius`, `experience_years`, both need a product decision |
| 15 | D22 | **open** - 4 response-envelope shapes, `ApiResponse` used once |

## Phase 2 log - part 7 (A6) - register item 14 closed

| Commit | Items | What changed |
| --- | --- | --- |
| `27d160b` | A6 | `BookingModal` is behind `next/dynamic` in the two pages that mount it, so Uppy's runtime and its three stylesheets leave both routes' first load. |

`BookingModal` statically imports `@uppy/core`,
`@uppy/react/dashboard-modal`, `@uppy/image-editor` and three Uppy
stylesheets, and both public pages importing it imported it statically.
Neither page renders it on first paint - `ProviderProfileClient` mounts
it behind `isBookingOpen`, and `ServiceDetailClient`'s
`bookingService`/`selectedProvider` are unset until `useData` resolves -
so the module was absent from SSR output either way and `ssr: false`
changes nothing server-side.

Measured on the build rather than asserted:

| route | chunks | bytes | chunks containing `@uppy/core` |
| --- | --- | --- | --- |
| `/providers/[id]` | 35 → 34 | 1,602,617 → 1,257,573 | 1 → 0 |
| `/services/[slug]` | 34 → 33 | 1,588,057 → 1,243,008 | 1 → 0 |

345 KB (~21.6 %) and one chunk off each route. The uppy chunk and the
Uppy CSS now appear under `react-loadable-manifest.json` as
`app\providers\[id]\ProviderProfileClient.tsx -> @/components/booking/BookingModal`
and its services twin - entries that did not exist before, because
nothing about the module was loadable before. That manifest is the
cheap way to answer "is this import lazy yet", just as the route's
client-reference-manifest answers "is this on the critical path".

Lint was compared by stashing the three files and re-running `eslint`:
21 problems before, 21 after, same set - the `no-explicit-any` errors in
`BookingModal` and `ServiceDetailClient` are pre-existing.

### Register status after Phase 2 part 7

| # | IDs | Status |
| --- | --- | --- |
| 14 | A4-A12 | **closed** - A4/A9 skipped by decision; A5 `e1dd81d`, A7 `decf0a1`, A8 `4846903`, A11 `cb80fb8`, A12 `e10ff14` landed in Phase 1, A10 `6ddf2ae` and A6 `27d160b` in Phase 2 |
| 12 | C5, C7, C8 | **closed** - `2f1603f`, `9638e94`, `e053870` |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 6 | D1 | **closed** - `43b444c` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`, `0230530` |
| - | D6, D7, D13 | **closed** - `0603d04`; `995af77`/`fb74fcd`/`0230530`; `bebc21e` + `94c468d` |
| 13 | D10, D11, D14 | **closed** - `52eabce` + `fc8582f`, `15d1565`, `94c468d` |
| 13 | D12 | **disproven, 2 fields residual** - `service_radius`, `experience_years`, both need a product decision |
| 15 | D22 | **open** - the last mechanical item: 4 response-envelope shapes, `ApiResponse` used once |

## Phase 2 log - part 8 (D22, D12) - register items 13 and 15 closed

| Commit | Items | What changed |
| --- | --- | --- |
| `7dacabe` | D22 | `app/Support/ApiResponse.php` deleted; `PaginationMeta::for()` replaces the two hand-rolled `meta` arrays. |
| `139811b` | D12 residual | New migration giving `providers.experience_years` and `providers.service_radius` a database default. |

### D22 - one meta shape, one fewer envelope

The register's count was right; its `High` risk rested on `ApiResponse`
living in a tree of 75 controllers, which was the wrong axis - the class
had **one** caller in the entire backend. What the three sites actually
disagreed on was small and easy to settle:

- `Admin\FeedbackController` hand-rolled all four of `current_page`,
  `last_page`, `per_page`, `total`.
- `Api\BlogController` hand-rolled three - no `per_page` - so
  `app/blog/page.tsx:37`, which stores `data.meta` wholesale, was reading
  a different contract from every admin list.
- `Admin\BookingController::store` held the single
  `ApiResponse::success($resource, $message, 201)` call.

`PaginationMeta::for(Paginator)` is those four keys and nothing else.
Both list endpoints call it, so the blog gained `per_page` and nothing
lost a key. The booking envelope was inlined as the same three keys -
`success`, `message`, `data` - because the object of the change was to
delete the class, not to restyle its output.

`ApiResponse` now has **0** references under `backend/app`. Six files,
+58/-60: the diff deletes more than it adds, which is what a
one-consumer helper collapsing into its consumer looks like.

`tests/Feature/PaginationMetaTest.php` calls both endpoints and asserts
`array_keys($meta)` is exactly `['current_page', 'last_page',
'per_page', 'total']` - same keys *and* same order, since two arrays
that differ only in order are still two shapes to anything comparing
them.

### D12 - the last two column defaults

D12 was **disproven** for most of its fields and left two residuals,
`providers.experience_years` and `providers.service_radius`. The
migration had created both nullable with no default; `User::defaults()`
already declared `0` and `10`, and the Provider accessors coerce to
exactly those, so the values were already what everything else believed -
they just were not written anywhere the database could see.
`service_radius` was the worse pair: no seeder ever sets it, so every
seeded provider stores `NULL` and only the accessor makes it read `10`.

`2026_09_27_000001_add_providers_column_defaults` adds `DEFAULT 0` and
`DEFAULT 10` and keeps both columns nullable, so existing `NULL` rows are
untouched and keep reading exactly as before. Nothing rewrites a row,
which is also why `down()` has nothing to undo but the default.

`down()` is driver-aware because the engines differ in how stubborn they
are: MySQL keeps a default the `MODIFY` statement does not mention, so it
gets an explicit `alter table ... alter column ... drop default`, while
SQLite rebuilds the table from the definition it is handed and so only
needs a definition without a default.

`tests/Feature/ProvidersColumnDefaultsTest` checks the defaults are
present and are `0` and `10`, that both columns are still nullable, and
runs `down()` then `up()` against the live schema - the only honest way
to show a migration is reversible rather than nominally so. Getting the
assertion right needed care: SQLite hands back the SQL literal with its
quotes intact (`"'10'"`), so the value is trimmed before casting and
`null` is ruled out separately instead of letting a cast of `null` to
`0` pass for `0`.

### Gates

`php artisan test`: **435 passed, 1 pre-existing risky** (432 before
D12's three). `php artisan route:list --json`: **234 routes**, **0**
duplicate method+URI; duplicate names are the same two as every previous
checkpoint - 105 unnamed routes and 56 routes literally named
`api.admin.`, neither touched by this work. `php -l` clean on both new
files.

The migration **has** been run against MySQL, now that WAMP is up:

| check | result |
| --- | --- |
| `php artisan migrate` | ran, batch 5, `migrate:status` 0 pending |
| column defaults | `experience_years` default `0`, `service_radius` default `10`, both `int`, both still `nullable=YES` |
| raw `INSERT` omitting both columns (inside a rolled-back transaction) | came back `experience_years=0`, `service_radius=10`; rollback left 0 rows behind |
| `migrate:rollback --step=1` | both defaults went to `NULL` - the MySQL `drop default` branch of `down()`, which the SQLite suite cannot reach |
| `migrate` again | defaults restored; the 8 existing provider rows were never touched (`service_radius` is still `NULL` on all 8, as designed) |

The suite itself runs on `sqlite`/`:memory:` (`phpunit.xml`), so the 435
tests never saw this database.

### Register status after Phase 2 part 8 - 15 of 15 closed

| # | IDs | Status |
| --- | --- | --- |
| 1 | B1-B5 | **closed** - `5e2032f` ran the four pending migrations and deleted the fifth (B1-B4); `02d2406` + `86ae48f` fixed SQLite `strftime` (B5); `63da8ed` fixed `post.body` vs `content` |
| 2 | C1-C3 | **closed** - `9719acc` repaired the admin media delete route (C1/C2), `b548607` added the missing `financials/charts` route (C3) |
| 3 | C6/D9 | **closed** - `73d3fed` |
| 4 | C4 | **disproven** - `ChatController::getConversation` already persists `read_at` on every fetch |
| 5 | D5 | **closed** - `a98dd23` |
| 6 | D1 | **closed** - `43b444c` |
| 7 | A2 | **closed** - `b194418` |
| 8 | A3/A5 | **closed** - `76d097a`, `e1dd81d` |
| 9 | A1 | **closed** - `16bd0cf` |
| 10 | B7/B8 | **closed** - `1e52d63` |
| 11 | D2/D3/D4/D8 | **closed** - `0f967b6`, `813b57b`, `7f0b0f6`, `0230530` |
| 12 | C5, C7, C8 | **closed** - `2f1603f`, `9638e94`, `e053870` |
| 13 | D10-D14 | **closed** - `52eabce` + `fc8582f` (D10), `15d1565` (D11), `94c468d` (D14) + `bebc21e` (D13), `139811b` (D12 residual) |
| 14 | A4-A12 | **closed** - A4/A9 skipped by decision; A5 `e1dd81d`, A7 `decf0a1`, A8 `4846903`, A11 `cb80fb8`, A12 `e10ff14` in Phase 1, A10 `6ddf2ae` and A6 `27d160b` in Phase 2 |
| 15 | D22 | **closed** - `7dacabe` |

D6, D7 and the D8 seeder residual were never separate register rows and
are closed by `0603d04` and `995af77`/`fb74fcd`/`0230530`.

### What the consolidated register never covered

These are findings, not register rows - written down here so "15 of 15"
is not misread as "the audit is finished":

- **A13-A17** - `getSSRSettings()` (already downgraded: it is revalidated
  hourly), eager `framer-motion`/tiptap/Echo, `react-beautiful-dnd` on
  React 19, `globals.css` `!important`/magic radii, unused-dependency
  candidates. Still open.
- **B9-B14** - 3 redundant indexes: their drop (X3) was **approved but
  never executed** - no migration in the repo drops them, and MySQL is
  down so their current state could not be re-checked; column naming; missing `slug` columns on
  `service_categories`/`services`; `blog_posts.view_count`, which
  `BlogPostResource` always emits as `0`; Spatie permission tables, whose
  drop (X5) was explicitly **declined**.
- **C9-C12** - the second finance controller, the two handlers registered
  twice, `VerificationController` authz, three relation-only models.
- **D15-D21** - base-URL resolution x7, currency and date formatting,
  four status-filter tables, three overlapping fetch hooks, deprecated
  re-exports, five dead backend npm deps, and **D21: an OpenSSH private
  key still on disk** (`github-actions-kuba-home-service`, gitignored,
  untracked, last written 15 July). D21 is the one High-severity item
  outside the register and the one worth acting on next.
- **X6** - purging the 94 MB MP4 from git history. Approved and done;
  see the history note at the end of this document.

---

## Remaining work - the plan

Everything below sits **outside** the 15-row consolidated register. It is
ordered by risk: no-decision, no-data-change work first, then backend
route and controller dedup, then reversible schema changes, then the
frontend refactors that need before/after measurements.

### Tier 1 - mechanical, no decisions needed

| ID | Task | Verified by |
| --- | --- | --- |
| D21 | Delete `github-actions-kuba-home-service` and its `.pub` from the repo root | both files gone, `git status` still clean, all four workflows still reading `secrets.SSH_PRIVATE_KEY` |
| D20 | **already closed** - `backend/package.json` went with the Inertia toolchain in `0f967b6`, so the five dead backend deps went with it | `Test-Path backend/package.json` = false |
| D19 | Repoint `chat-utils.unwrapResourceList` and `lib/provider-services-api` at their canonical helpers, then delete the deprecated re-exports | `npx tsc --noEmit`, `npx eslint src`, `npm test`, `npm run build` |
| C12 | Confirm the three relation-only models are reached through relations and are not dead code; close as informational | read + grep, no code change |
| A13 | Already downgraded (`getSSRSettings()` revalidates hourly) - record and close | none |

D21 is the only **High** item in this tier. The workflows read
`secrets.SSH_PRIVATE_KEY`, not the file, so the file is a leftover - but
deleting the private key locally does not un-install its public half, so
the matching `authorized_keys` entry on the server needs the same
attention.

### Tier 2 - backend route and controller dedup

| ID | Task | Verified by |
| --- | --- | --- |
| C9 | Two finance controllers: `Admin\FinanceController` (`GET /admin/financials/charts`) and `Api\Admin\FinancialController` (`overview`, `payouts`, `process`), different shapes | response shapes byte-identical for `FinanceOverview.tsx:67` and `admin/payments/page.tsx`, backend suite, `route:list` |
| C10 | Handlers registered twice - `POST /media/upload` both bare and under `/admin`, `GET /settings` likewise | grep frontend for each URI, drop the unreferenced alias, `route:list` |
| C11 | `VerificationController` serves admin and provider routes and re-checks the role the route middleware already checked | suite + the admin/provider verification tests |
| - | **Not in the register:** 56 routes share the literal name `api.admin.` (group `as` prefix, no per-route `->name()`), so `route('api.admin.')` is ambiguous | `route:list --json`, assert no two routes share a name |

C9 has moved since the audit: `Admin\FinanceController` was called
"unused", then `b548607` wired `GET /admin/financials/charts` to it while
fixing C3. Both controllers are live now and still disagree on shape, so
the fix is to share the mapping while keeping each endpoint's current
JSON as the contract.

### Tier 3 - schema, one reversible migration each (MySQL is up)

| ID | Task | Reversible how |
| --- | --- | --- |
| X3 / B9 | Drop `bookings.customer_id+status`, `bookings.provider_id+status`, `provider_services.provider_id` - **approved, never executed** | recreate the exact definitions in `down()`; read `information_schema.STATISTICS` before and after |
| B11 | Naming: `page_features.order_index`, `faqs.order`, `testimonials.order` -> `sort_order`; 7 image-column names; `provider_availability`; `rating_avg` vs API `rating` | `renameColumn` back in `down()` - **scope needs a decision** |
| B12 | Add `slug` to `service_categories` and `services`, backfill, stop synthesising slugs in PHP (the current bug: two same-named categories resolve to the first) | `dropColumn` in `down()`; route/URL impact needs a decision |
| B13 | `blog_posts.view_count` does not exist but `BlogPostResource:26` emits `0` | either remove the field or add the column - **needs a decision** |
| B14 / X5 | Spatie permission tables | **won't do** - dropping them was declined |

### Tier 4 - frontend performance, measured like A6

| ID | Task | Verified by |
| --- | --- | --- |
| A14 | Echo+Pusher boot on all 85 routes; tiptap reached from 8 admin files; `framer-motion` in 41 files | build chunk counts and `react-loadable-manifest.json` before/after, per route |
| A17 | Unused-dep candidates: `@tanstack/react-table` (0 matches), `uppy` meta-pkg, `@capacitor/*` (0 in `src`) | grep + `npm ls`; check `capacitor.config` before touching the Capacitor set |
| A15 | `react-beautiful-dnd` on React 19 with an in-repo workaround | replace with `@dnd-kit` or keep - **needs a decision** |
| A16 | `globals.css`: 50 `!important`, 19 webkit selectors, `rounded-[2.5rem]` in 68 files | smallest batch last - visual regression risk, do it in slices |

### Tier 5 - frontend dedup

| ID | Task | Verified by |
| --- | --- | --- |
| D16 | Currency x3 definitions + 22 inline; 36 ad-hoc `toLocaleDateString` | one `formatCurrency`/`formatDate`, `tsc` + `eslint` + tests + build |
| D17 | Status filter tables x4; `admin/bookings` missing `in_progress`; `admin/contact` bypasses `lib/status-styles.ts` | each page renders the same set as before, tests |
| D15 | Base-URL resolution x7 -> all through `lib/api-base-url` | `tsc`, tests, and a check that SSR and browser resolve the same origin |
| D18 | 3 overlapping fetch hooks + 4 ad-hoc SWR fetchers + `/api/categories` fetched in 8 places | largest refactor, last; network calls per route unchanged |

### Decisions taken

| ID | Decision |
| --- | --- |
| D21 | **delete** - both key files removed. The workflows read `secrets.SSH_PRIVATE_KEY`, not the files; removing the matching `authorized_keys` entry from the server is a separate, manual step. |
| B11 | **full naming unification** |
| B12 | **add `slug` columns** - public URLs change |
| B13 | **drop `view_count`** from the resource |
| A15 | **swap `react-beautiful-dnd` for `@dnd-kit`** |
| X6 | **proceed with the purge** - done, see the history note below |

### Explicitly not doing

| ID | Why |
| --- | --- |
| X5 / B14 | dropping the Spatie tables was declined; installed-but-unused is harmless |
| A4, A9 | skipped by decision in Phase 1 |
| C4 | disproven |

### History note - the X6 purge rewrote every commit hash

`backend/documentation/GG1M7488.mp4` was 98,298,782 bytes (93.75 MiB).
It existed in exactly two commits - the initial one that added it, and
the `backend/documentation` removal that deleted it - so taking it out
of history changed those two and therefore every descendant. **Every
commit hash in this document has been remapped to its post-purge
equivalent.**

- Pack size **153.94 MiB -> 59.90 MiB**, a 94.04 MiB (61 %) reduction.
- Nothing else was removed. The next largest blobs are the
  `Design-Templates` images at 3.2 MB and below, and the other 114 files
  of `backend/documentation`; both are still in history, as intended.
- The old-to-new mapping was built from a full pre-purge bundle, keyed
  on subject plus author and committer timestamps - 40 distinct hashes,
  191 occurrences, every one resolved uniquely - then verified by
  applying it to the pre-purge file and getting an exact match.
- Backup: `Kuba-hs-before-purge.bundle` (160,042,171 bytes) holds the
  complete pre-purge history.
- `git filter-repo` removes the `origin` remote; it has been re-added.
  **GitHub still has the old history**, so a plain `git fetch` would put
  the blob back. Finishing this on GitHub needs a force push, which has
  not been made.


