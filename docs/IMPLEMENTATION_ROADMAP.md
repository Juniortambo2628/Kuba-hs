# Implementation Roadmap — Audit, MVC, DRY, Performance

**Date:** 2026-06-03  
**Stack:** Laravel 12 API + Next.js App Router (headless; no Blade views for app UI)

---

## 1. Completed in this pass

| Item | Change |
|------|--------|
| Home sections 100vh | `HomeSnapScroller`, `marketing-section.ts`, `LandingSection` + Hero/FAQ/CTA/Testimonials/Trust use `min-h-[100svh] h-[100svh] snap-start` |
| Storage CORS | `getMediaUrl()` rewrites absolute `http://127.0.0.1:8000/storage/*` → `/cms-assets/*`; Next rewrite targets Laravel `/cms-assets` (not raw `/storage`); route always registered with CORS headers |
| Trust logos | `TrustCarousel` uses `getMediaUrl()` for partner logos |

**Restart Next dev server** after `next.config.ts` change so rewrites apply.

---

## 2. Architecture (MVC mapping)

| Layer | Location | Notes |
|-------|----------|-------|
| **Models** | `backend/app/Models/*` | 28+ domain models; infra tables (cache, jobs, permissions) intentionally without models |
| **Controllers** | `Admin/*`, `Api/*`, `Client/*`, `Provider/*` | JSON API only; legacy Inertia in `backend/archive/` |
| **Views** | `frontend/src/app/**` | Next.js pages = “views”; no duplicate Blade UI |
| **Routes** | `backend/routes/api.php`, `web.php` (cms-assets, auth) | All app traffic via `/api/*` + Next rewrites |

There is **no missing MVC layer** for the main product — gaps are **wiring/UX/DRY**, not absent server views.

---

## 3. Module completeness audit

### Complete (API + admin or dashboard UI)

- Users, categories, catalog services, blog, FAQs, testimonials, trust partners, page features  
- Promo codes (`/admin/promotions`)  
- Bookings (client create; admin read/update/delete; activity log)  
- Payments / finance / payouts  
- Providers (admin list/detail, compliance, verification)  
- Contact, quotes, investors (public POST + admin status/delete)  
- Reviews (client POST; admin feedback CRUD)  
- Loyalty tiers + client redeem  
- Email templates (read/update/delete; seed-managed create)  
- Chat (client/provider + admin moderation)  
- CMS settings + FilePond media  
- Favorites, addresses, geocode proxy  

### Partial / informational (by design)

| Module | Gap | Priority |
|--------|-----|----------|
| Admin notifications | Docs-only page; no per-event toggle API | P3 |
| OAuth login | Google routes exist; UI “coming soon” | P2 |
| Admin booking create | `POST /api/admin/bookings` exists; no admin UI form | P3 |
| Email template create | API `POST` exists; admin UI create flow optional | P3 |

### Incomplete UX / copy (not missing API)

| Page | Issue |
|------|--------|
| `/admin/investors`, `/admin/quotes` | CRUD wired; marketing jargon titles (“Capital Architecture”) — refactor copy + workspace UI |
| `/admin/messages` | Hub wired; delete/resolve works via `useAdminInbox` |
| `/admin/notifications` | Static explainer only |

---

## 4. Route ↔ frontend matrix (gaps)

| API | Frontend | Status |
|-----|----------|--------|
| `GET/POST/PUT/DELETE /api/admin/promo-codes` | `/admin/promotions` | OK |
| `apiResource investors` (no store/update) | `/admin/investors` | OK (status + delete) |
| `apiResource quotes` (no store/update) | `/admin/quotes` | OK |
| `GET/DELETE /api/admin/chat/*` | `/admin/chat` | OK |
| `POST /api/admin/bookings` | — | API only |
| `GET /api/notifications` | Client/provider — check bell widget | Verify in layout |

---

## 5. Database ↔ API ↔ frontend alignment

| Area | Rule |
|------|------|
| IDs | UUID strings for `bookings`, `users`, `providers` |
| Review status | `published \| hidden \| resolved` |
| Contact | `new \| read \| replied` |
| Quotes | `pending \| reviewed \| contacted \| contracted \| rejected` |
| Media URLs | Always `getMediaUrl()` / `resolveMediaUrl()`; dev uses `/cms-assets/` |
| Provider docs | Table `verification_documents` only (JSON column removed) |

Run after schema changes: `php artisan migrate` + smoke booking → payment → admin detail.

---

## 6. DRY & consolidation plan

### Single source of truth (keep extending)

| Concern | SSOT file |
|---------|-----------|
| Admin nav | `config/admin-navigation.tsx` |
| Dashboard workspace UI | `components/dashboard/workspace/*`, `lib/dashboard-workspace-ui.ts` |
| Marketing sections | `lib/marketing-section.ts`, `LandingSection`, `MarketingShell` |
| API lists | `lib/api-response.ts` (`extractApiList`, `unwrapResource`) |
| Status chips | `lib/status-styles.ts`, `PaymentTransactionBadge`, `BookingStatusBadge` |
| Media URLs | `lib/utils.ts` (`getMediaUrl`, `resolveMediaUrl`) |
| Admin inbox | `hooks/useAdminInbox.ts` |

### Remove / avoid (phased)

| Path / pattern | Action |
|----------------|--------|
| `frontend/deprecated/*` | Delete after confirming zero imports |
| `backend/archive/legacy-inertia-controllers/` | Keep archive only; never remount |
| Duplicate `DashboardPageHeader` vs `DashboardGreetingBar` | Migrate remaining admin pages to workspace |
| `MetricCard` on dashboards | Prefer `DashboardFrostedStatCard` |
| `uiPrimitives.label.caps*` uppercase | Replace with sentence case on touched pages |
| `ChatUI.tsx` vs `ChatInterface` | Keep both: `ChatUI` = embedded booking; `ChatInterface` = inbox pages |
| `frontend_v2_deprecated` | Already removed |

### Performance (page load)

1. **Home:** lazy sections (done), `HomeSnapScroller` client boundary only on home  
2. **Images:** `getMediaUrl` → same-origin `/cms-assets`; Next `remotePatterns` for CDN  
3. **Data:** SWR on dashboards; SSR settings on home hero only  
4. **Bundle:** audit `framer-motion` on landing — consider `LazyMotion` or reduce motion on mobile  
5. **PWA:** disabled in dev (`next.config.ts`) — OK  

---

## 7. Implementation phases

### Phase A — Done (2026-06-03)

- [x] 100vh snap home sections  
- [x] Storage CORS proxy chain  
- [x] Client dashboard workspace migration  
- [x] Provider admin + slug routes (prior pass)  

### Phase B — Done (2026-06-03)

1. [x] Refactor `/admin/investors`, `/admin/quotes`, `/admin/messages` — workspace UI + plain copy  
2. [x] `config/dashboard-navigation.tsx` — client + provider labels (Bookings, Availability); wired in `KubaSidebar`  
3. [x] Google OAuth — `AuthSocialButtons` on login pages; role query; callback redirects by role; complete-profile pre-fills role  
4. [x] `CMSContext.getImg` → `getMediaUrl()` (favicon CORS)  
5. [x] Admin nav “Inbox”; sidebar “Sign out”  

### Phase C — CRUD polish (2–3 days)

1. Admin optional “Create booking” drawer → `POST /api/admin/bookings`  
2. Messaging hub: bulk archive (API batch or parallel PATCH)  
3. Notification preferences API (optional table `notification_preferences`)  

### Phase D — Cleanup (ongoing)

1. Script: grep unused exports in `components/shared`  
2. Consolidate `MarketingPage` + `HighImpactHero` height tokens with `marketing-section.ts`  
3. E2E smoke: home scroll → book → pay → messages  

---

## 8. CORS console note

Errors like `Access-Control-Allow-Origin` on `127.0.0.1:8000/storage/...` from `localhost:3000` were caused by:

1. Full absolute storage URLs bypassing `/cms-assets` rewrite  
2. Next rewrite pointing at `/storage` instead of `/cms-assets`  

Both are fixed. **Console Ninja / QR scanner extensions** may still probe image URLs — safe to ignore if app images load.

---

## 9. Quick verification checklist

- [ ] Restart `npm run dev` (frontend)  
- [ ] Home: each scroll snap fills viewport  
- [ ] CMS favicon/logo loads (no CORS on `/cms-assets/...`)  
- [ ] `php artisan route:list | findstr cms-assets`  
- [ ] Admin: promotions CRUD, investors delete, quotes status, chat delete message  
