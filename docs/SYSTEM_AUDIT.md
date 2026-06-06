# System Audit — Public Site, Admin Dashboard, Services & DB

**Date:** 2026-06-02  
**Stack:** Laravel 12 API (`backend/`) + Next.js App Router (`frontend/`)

---

## 1. Refactors completed (this pass)

| Recommendation | Implementation |
|----------------|----------------|
| Navigation SSOT | `frontend/src/config/admin-navigation.tsx` → `ADMIN_NAV_ITEMS` / `ADMIN_SIDEBAR_ITEMS` used by `KubaSidebar` + `AdminCommandPalette` |
| `resolveMediaUrl` | `frontend/src/lib/utils.ts`; CMS settings page imports it |
| `useAdminInbox()` | `frontend/src/hooks/useAdminInbox.ts` → messaging hub + delete/archive/resolve |
| Finance API namespace | `/api/admin/financials/charts` + `/financials/transactions` (aliases); `/finance*` kept; payouts stay on `FinancialController` |
| Admin booking DRY | `useBookingDetail`, `OperationalLog`, `AdminBookingSidebar`; `BookingDetailView` uses shared hook |
| `MarketingShell` | `frontend/src/components/layout/MarketingShell.tsx` on 14+ public/legal pages |

---

## 2. Services domain — conflicts & duplication

### Data model (correct separation)

| Entity | Table | Role |
|--------|-------|------|
| `ServiceCategory` | `service_categories` | Catalog grouping (admin CRUD) |
| `Service` | `services` | Base catalog service template per category |
| `ProviderService` | `provider_services` | Provider listing (price, availability, media) |
| `Booking` | `bookings` | Links customer + `provider_service` / service snapshot |

**No schema conflict:** catalog `Service` vs marketplace `ProviderService` are intentional layers, not duplicates.

### API routes (no collision)

| Consumer | Endpoint | Controller |
|----------|----------|------------|
| Public browse | `GET /api/categories`, `/api/featured-services`, `/api/services/{service}` | `MarketplaceController` |
| Admin catalog | `api/admin/categories`, `api/admin/services` | `CategoryController`, `ServiceController` |
| Provider dashboard | `GET/POST /api/provider/services` | `ProviderServiceController` |

### Frontend routing

| Route | Behavior |
|-------|----------|
| `/services` | Public marketplace browse |
| `/services/[id]` | General service detail (catalog) |
| `/admin/services` | Redirect → `/admin/categories` (catalog CRUD lives there) |
| `/admin/categories` | Categories + nested catalog services CRUD |

**Assessment:** One redirect avoids a duplicate admin UI; no breakage if redirect is kept.

### Residual duplication (low risk)

- Featured service cards vs provider service cards use similar UI patterns — acceptable; different API shapes.
- `frontend_v2_deprecated` removed from active use; do not reintroduce parallel routes.

---

## 3. MVC structure

### Backend (Laravel)

```
routes/api.php          → HTTP entry, middleware (auth, admin, provider, client)
app/Http/Controllers/
  Admin/*               → Admin dashboard JSON API
  Api/*                 → Shared + marketplace + chat
  Client/*, Provider/*  → Role dashboards
app/Models/*            → Eloquent (domain)
app/Http/Resources/*    → API serialization
app/Services/*          → LedgerService, BookingActivityService, etc.
```

**Strengths:** Clear `admin` prefix group; policies on bookings; resources for reviews/quotes.

**Gaps (documented, not blocking):**

| Gap | Note |
|-----|------|
| Two finance controllers | `Admin\FinanceController` (payment charts) vs `Api\Admin\FinancialController` (payout ledger) — now namespaced under `/financials/*` |
| Legacy Inertia controllers | Archived under `backend/archive/` — not mounted |
| No dedicated `MessageController` for hub | Hub aggregates Contact + Review + CustomQuote — by design |

### Frontend (Next.js)

```
app/                    → Routes (public, dashboard, admin)
components/             → UI + domain widgets
hooks/                  → useApiData, useBookingDetail, useAdminInbox
config/                 → admin-navigation SSOT
lib/                    → utils, api-response, status-styles, axios
contexts/               → Auth, CMS
```

**Strengths:** App Router role split (`/admin`, `/dashboard/client`, `/dashboard/provider`); shared booking detail for client/provider.

**Admin layout:** Dashboard routes use sidebar layout via dashboard layout group; admin pages use same shell.

---

## 4. Database alignment

| Area | DB | API | Frontend | Status |
|------|-----|-----|----------|--------|
| Booking ID | UUID | string in JSON | `Booking.id: string` | Aligned |
| Review status | `published\|hidden\|resolved` | FeedbackController | Admin feedback + hub | Aligned (migration backfill) |
| Contact status | `new\|read\|replied` | ContactController | Contact + hub | Aligned |
| Quote status | `pending\|reviewed\|contacted\|contracted\|rejected` | QuoteController | Quotes + hub | Aligned |
| Provider docs | `verification_documents` table | Compliance + verification APIs | Admin compliance/workforce | Aligned (JSON column dropped) |
| Loyalty | `loyalty_tiers`, `loyalty_points` | Admin + client loyalty | Dashboard loyalty pages | Aligned |
| Payments | `payments` + `payouts` | finance + financials routes | `/admin/payments` tabs | Aligned |

**Migrations:** All domain migrations applied through `2026_06_03_100000_schema_audit_review_status_default`.

---

## 5. Public site — views & functions

| Page | View | API / behavior | Status |
|------|------|----------------|--------|
| `/` | Hero, categories, featured, CMS | `/api/settings`, marketplace endpoints | OK |
| `/services`, `/categories` | MarketingShell + browse | `/api/categories`, search | OK |
| `/services/[id]` | Service detail | `/api/services/{id}` | OK |
| `/providers`, `/providers/[id]` | List + profile | `/api/providers` | OK |
| `/providers/apply` | Application form | `POST /api/auth/register-provider` | OK |
| `/contact` | Form | `POST /api/contact` | OK |
| `/quotes/apply`, `/commercial`, `/cooperatives` | RFP forms | `POST /api/quotes` | OK |
| `/investors` | Inquiry | `POST /api/investors/inquire` | OK |
| `/blog`, `/blog/[slug]` | CMS posts | `/api/blog` | OK |
| `/login`, `/register` | Auth | Sanctum + roles | OK (OAuth UI still “coming soon”) |
| `/payment/verify` | Paystack return | verify endpoints | OK |
| Legal pages | Static + CMS | — | OK |

**CMS:** `CMSContext` + `getS()` / `getImg()` drive copy; placeholders when settings empty.

---

## 6. Admin dashboard — views & functions

| Module | Route | API | Status |
|--------|-------|-----|--------|
| Dashboard | `/admin` | `/api/admin/dashboard`, analytics | OK |
| Bookings | `/admin/bookings`, `[id]` | admin + shared booking APIs, activity log | OK |
| Users | `/admin/users` | `api/admin/users` | OK |
| Providers | `/admin/providers`, `[id]` | `api/admin/providers` | OK |
| Finance | `/admin/payments` | financials/charts, payments, payouts | OK |
| CMS | `/admin/settings` | settings + media upload | OK |
| Content | blog, faqs, testimonials, trust, page-features | matching `apiResource` | OK |
| Messaging | `/admin/messages`, `/admin/contact` | inbox hook + contact CRUD | OK |
| Compliance | `/admin/compliance` | compliance/* | OK |
| Verification | `/admin/workforce/verification` | workforce verification | OK |
| Reports | `/admin/reports` | CSV generate | OK |
| Email templates | `/admin/email-templates` | CRUD | OK |

**Redirects (intentional):** `/admin/finance` → payments overview; `/admin/services` → categories.

---

## 7. Breakages & conflicts checked

| Check | Result |
|-------|--------|
| Duplicate `/financials/overview` route | Resolved — charts use `FinanceController@index` at `/financials/charts` only |
| `resolveMediaUrl` scope error | Fixed — utility in `lib/utils.ts` |
| Messaging status enums | Fixed — hub uses per-type statuses |
| Sidebar badge counts | Fixed — `pending_*` on dashboard API |
| `getStatusColor` scattered | Removed — `status-styles.ts` + badges |
| Admin nav drift (palette vs sidebar) | Fixed — SSOT config |

---

## 8. Recommended follow-ups (optional)

1. Enable Google OAuth buttons on `/login` (routes exist).
2. Reuse `useAdminInbox` on `/admin/contact` for shared status helpers only (page keeps table UX).
3. Export `providerItems` / `clientItems` to `config/dashboard-navigation.tsx` (same pattern as admin).
4. Artisan `bookings:backfill-activity` for historical audit rows.
5. E2E smoke: booking create → pay → admin booking detail → payout process.

---

## 9. File reference (new shared modules)

- `frontend/src/config/admin-navigation.tsx`
- `frontend/src/hooks/useAdminInbox.ts`
- `frontend/src/hooks/useBookingDetail.ts`
- `frontend/src/components/layout/MarketingShell.tsx`
- `frontend/src/components/booking/OperationalLog.tsx`
- `frontend/src/components/booking/AdminBookingSidebar.tsx`
