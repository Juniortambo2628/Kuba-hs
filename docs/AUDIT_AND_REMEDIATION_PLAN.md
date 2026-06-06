# System Audit & Remediation Plan

**Date:** 2026-06-03  
**Stack:** Laravel 11 API (`backend/`) + Next.js 16 App Router (`frontend/`)  
**Architecture:** Headless — no Laravel Blade “views”; MVC maps to **Model → API Controller → Next.js page**.

---

## 1. Executive summary

| Area | Status |
|------|--------|
| **Admin CMS** | ~90% complete; all major entities have pages + `/api/admin/*` CRUD |
| **Public marketplace** | Read-heavy API wired; mutations via bookings/payments/auth |
| **Client / Provider dashboards** | Wired to role-scoped APIs |
| **Gaps fixed in remediation** | Phases A–D: promo show, booking fillable, loyalty award, FAQ DnD, reports audit log, admin booking create, chat moderation, notifications hub, provider media on admin detail |
| **By design (not bugs)** | No admin create for payments; intake-only quotes/investors |

---

## 2. Module completeness matrix

### Complete (model + admin UI + API)

| Module | Model | Admin UI | Public/role API |
|--------|-------|----------|-----------------|
| Users | `User` | `/admin/users` | Client profile; auth |
| Providers | `Provider` | `/admin/providers`, `[id]` | Marketplace; provider namespace |
| Service categories | `ServiceCategory` | `/admin/categories` | `/api/categories` |
| Catalog services | `Service` | (in categories page) | `/api/services/{service}` |
| Blog | `BlogPost` | `/admin/blog` | `/api/blog` |
| FAQs | `FAQ` | `/admin/faqs` | `/api/faqs` |
| Testimonials | `Testimonial` | `/admin/testimonials` | `/api/testimonials` |
| Trust partners | `TrustPartner` | `/admin/trust-partners` | `/api/trust-partners` |
| Page features | `PageFeature` | `/admin/page-features` | `/api/page-features` |
| Email templates | `EmailTemplate` | `/admin/email-templates` | — |
| Site settings | `SiteSetting` | `/admin/settings` | `GET /api/settings` |
| Promo codes | `PromoCode` | `/admin/promotions` | `POST /api/promo-codes/validate` |
| Contact | `ContactMessage` | `/admin/contact`, messages hub | `POST /api/contact` |
| Quotes | `CustomQuote` | `/admin/quotes` | `POST /api/quotes` |
| Investors | `InvestorInquiry` | `/admin/investors` | `POST /api/investors/inquire` |
| Loyalty tiers | `LoyaltyTier` | `/admin/loyalty` | Client loyalty |
| Addresses | `Address` | — | Client `apiResource` |
| Favorites | `UserFavorite` | — | Client favorites |
| Chat | `Conversation`, `Message` | `/admin/messages`, `/admin/chat` | `/api/chat/*` |
| Verification | `VerificationDocument` | workforce + compliance | Provider upload |

### Partial (workflow / read-only by design)

| Module | What's intentionally limited |
|--------|------------------------------|
| **Bookings** | Admin: list/show/status/delete + `POST /api/admin/bookings` (ops create). Shared `PATCH /api/bookings/{id}/status` |
| **Payments** | Gateway-driven; admin index/show + finance overview |
| **Reviews** | Admin via `/admin/feedback` (not `reviews` resource name) |
| **Provider listings** | `ProviderService` — provider dashboard only, not admin CRUD |
| **Payouts** | `FinancialController` process/list, not full CRUD |
| **Notifications** | Laravel `notifications` table; read/mark-read only |
| **Media** | Upload/delete; Spatie, no `Media` Eloquent model in app |

### Fixed in remediation pass

| Issue | Fix |
|-------|-----|
| `PromoCodeController` missing `show()` | Added for `apiResource` route |
| `Booking` mass-assignment | Added `location_name`, `rescheduled_at` to `$fillable` |
| `POST /api/admin/loyalty/reward` | Admin UI: award points sheet |
| `POST /api/admin/faqs/reorder` | Admin UI: up/down order controls |
| Provider card images | Prior pass: logo → banner → avatar; no fake ui-avatars |

---

## 3. MVC / pipeline map

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│   Model     │────▶│ API Controller   │────▶│ JSON Resource (opt.)    │
│ app/Models  │     │ Admin/* Api/*    │     │ *Resource.php           │
└─────────────┘     └──────────────────┘     └───────────┬─────────────┘
                                                         │
                                                         ▼
                                             ┌─────────────────────────┐
                                             │ Next.js page (view)     │
                                             │ src/app/**/page.tsx     │
                                             │ axios → /api/...        │
                                             └─────────────────────────┘
```

**Legacy (unused):** `backend/archive/legacy-inertia-controllers/`, `backend/resources/js/Pages/*` — not registered in routes.

---

## 4. Route gaps (backend)

| Route | Issue | Action |
|-------|-------|--------|
| `GET admin/promo-codes/{id}` | Was missing `show()` | **Fixed** |
| `PATCH admin/bookings/{id}/status` | Duplicate of shared booking route | Keep shared route; document |
| `GET admin/finance/transactions` | Unused alias | Optional deprecation |
| Auth `EmailVerificationPromptController` | Orphan import | Remove or wire |
| `web.php` Inertia views | Removed | Archive only |

---

## 5. Frontend pages without backend admin CRUD

| Page | Notes |
|------|-------|
| `/admin/messages` | Aggregates contact/feedback/quotes; chat threads on `/admin/chat` |

---

## 6. DB ↔ API ↔ frontend consistency

| Entity | DB / model | API field | Frontend expectation | Notes |
|--------|------------|-----------|-------------------|-------|
| FAQ | `avatar`, `order` | same | `avatar`, `order` | Use `getMediaUrl` for avatar paths |
| Service | Spatie `thumbnail` | `thumbnail_url` | cards + hero | No Unsplash fallback in API |
| Category | `image_url` | `image_url` | cards + hero | Admin `category_thumbnail` upload |
| Provider | Spatie `logos`, `banners` | `logo`, `banner` | ProviderCard | Not merged with ui-avatars |
| User | Spatie `avatars` | `avatar_url` nullable | profile chips | Placeholder URLs excluded |
| Booking | `location_name`, `rescheduled_at` | reschedule API | detail views | **Added to fillable** |
| Promo | `promo_codes` table | `PromoCode` model | promotions page | `show` added |

---

## 7. Redundancy & cleanup plan

### Safe to remove (after verification)

| Item | Location | Replacement |
|------|----------|---------------|
| ~~`frontend/deprecated/`~~ | **Removed** (2026-06-03) | Dedicated admin pages |
| Legacy Inertia controllers | `backend/archive/` | Keep archived; do not register |
| `/admin/services`, `/admin/finance` | redirects only | Keep redirects for bookmarks |

### Consolidate (optional phases)

| Redundancy | Proposal |
|------------|------------|
| `/admin` vs `/admin/analytics` | Use single dashboard endpoint (`/api/admin/dashboard`) on home |
| `/admin/contact` vs `/admin/messages` | Messages hub as canonical; contact as filter tab |
| `feedback` vs `reviews` API naming | Rename routes to `reviews` in v2 API |
| Duplicate finance transaction endpoints | Use `payments` + `financials/overview` only |
| `GET /api/settings` uses `Admin\SettingsController` | Split public read vs admin write controllers (clarity) |
| Windows path duplicates in git (`admin\categories`) | Normalize to forward slashes |

### Do not remove

- Shared `/api/bookings/{id}` routes (used by admin + client + provider)
- `MarketplaceController` monolith (works; split only if maintaining modules separately)
- Next.js `categories/*` redirect pages (SEO / old links)

---

## 8. Implementation phases

### Phase A — Done (this session)

- [x] Audit document
- [x] `PromoCodeController::show`
- [x] `Booking::$fillable` alignment
- [x] Admin loyalty manual award UI
- [x] Admin FAQ reorder controls

### Phase B — Done

- [x] FAQ avatar: `getMediaUrl` on list/grid
- [x] Admin reports: export audit log from `GET /api/admin/reports/history`
- [x] Google OAuth on login (backend web URL + `/auth/*` rewrite)
- [x] FAQ drag-and-drop reorder (parity with testimonials)
- [x] Admin provider logo/banner upload on `/admin/providers/[id]`

### Phase C — Done

- [x] Delete `frontend/deprecated/`
- [x] Remove orphan auth controller imports in `routes/auth.php`
- [x] Extract `MarketplaceController` into `Marketplace/*` controllers
- [x] `ApiResponse` helper (incremental adoption; admin booking store uses it)

### Phase D — Done

- [x] Admin booking create (`POST /api/admin/bookings` + UI)
- [x] Chat moderation admin (`/admin/chat`)
- [x] Notifications hub (`/admin/notifications` → email templates)

---

## 9. Verification checklist

```bash
# Backend routes
cd backend && php artisan route:list --path=admin

# Clear stale caches after media/settings changes
php artisan cache:forget api_providers_latest
php artisan cache:forget api_categories_all
php artisan cache:forget api_faqs_all

# Frontend
cd frontend && npm run build
```

Manual QA:

1. Admin → Loyalty → Award points → ledger updates
2. Admin → FAQs → reorder → public `/` FAQ order changes
3. Admin → Promotions → no 500 on resource routes
4. Provider profile → upload logo → `/providers` card shows image

---

## 10. Related docs

- [GAP_ANALYSIS.md](./GAP_ANALYSIS.md)
- [SYSTEM_AUDIT.md](./SYSTEM_AUDIT.md)
- [UI_ARCHITECTURE.md](./UI_ARCHITECTURE.md)
- [PHASE_C_PROVIDER_ADMIN.md](./PHASE_C_PROVIDER_ADMIN.md)
