# Frontend–Backend Gap Analysis

**Stack:** Laravel 12 API (`backend/`) + Next.js App Router (`frontend/`)  
**Date:** 2026-06-02 (updated 2026-06-02 — pipeline pass)

---

## 1. Connectivity Audit

### Wired correctly (representative)
| UI area | Frontend route / action | API |
|---------|-------------------------|-----|
| Admin bookings | `AdminBookingClient` | `GET/PATCH /api/bookings/{id}`, `GET /api/bookings/{id}/activity` |
| Client booking flow | `BookingModal` | `POST /api/client/bookings`, addresses, promo validate |
| Payments | `CheckoutDialog` | Paystack/M-Pesa endpoints |
| CMS settings | `admin/settings` | `GET/POST /api/admin/settings`, FilePond `/api/admin/media/upload` |
| Marketplace | Landing, search | `/api/categories`, `/api/search`, `/api/featured-services` |

### Fixed in this pass
| UI element | Was | Now |
|------------|-----|-----|
| Admin “Investigate User ID” button | No `href` / handler | Links to `/admin/users` with email search |
| Admin “Audit Ledger Details” | `disabled` stub | Links to `/admin/payments?tab=transactions&search={booking#}` when paid |
| Provider on booking detail | No link | Links to `/admin/providers/{id}` |
| Messaging hub “Mark Replied” | Wrong status for feedback/quotes | Type-specific: `replied` / `resolved` / `contacted` |
| Messaging hub Archive | No handler | `read` / `hidden` / `rejected` per type |
| `messages-summary` counts | `contact.status=pending`, `reviews.status IS NULL` | `new`, `hidden`, `pending` (aligned with DB enums) |
| Sidebar activity badges | Dashboard had no pending fields | `pending_*` on `/api/admin/dashboard` |
| `ImageSettingCard` media URL | `resolveMediaUrl` out of scope | Uses `getMediaUrl` prop |
| Billing privacy link | `/privacy-policy` (404) | `/legal/privacy` (prior fix) |

### Intentional non-routes
| Element | Reason |
|---------|--------|
| `href="#main-content"` in `layout.tsx` | Accessibility skip-link (valid) |
| Social login spans on login pages | Marked “Coming soon”; no backend OAuth UI route yet |
| Input `placeholder="..."` attributes | Form hints, not data placeholders |

### No widespread `javascript:void(0)` or `href="#"` navigation found in `frontend/src`.

---

## 2. Schema Alignment

### Type fixes applied
| Field | Frontend (was) | Backend (actual) |
|-------|----------------|------------------|
| `Booking.id` | `number` | `uuid` string → **updated to `string`** |
| `User.id` | `string` | `uuid` ✓ |

### Hardcoded copy → dynamic
| Location | Was | Should use |
|----------|-----|------------|
| `AdminBookingClient` tier line | `"Marketplace Tier: Gold"` | `customer.membership_tier?.name` or points fallback |

### Redundant DB columns (pruned)
| Column | Table | Action |
|--------|-------|--------|
| `verification_documents` (JSON) | `providers` | Dropped; use `verification_documents` table only |

### Image / CMS data
- Prefer `getMediaUrl()` + CMS `getS()` / `getImg()` over hardcoded stats (`500+`, etc.) on marketing pages when settings exist.
- `/placeholders/*.png` remain **fallback assets** when API media is empty (not schema errors).

---

## 3. CRUD Gap Analysis

### Complete CRUD (admin + API)
Users, categories, catalog services, blog, FAQs, testimonials, trust partners, page features, promo codes, loyalty tiers.

### Partial CRUD (by design)
| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| Bookings | Client POST only | ✓ | Status/reschedule | Admin DELETE | No admin create |
| Payments | Gateway | ✓ | — | — | Event-driven |
| Email templates | — | ✓ | ✓ | — | Seed-managed |
| Contact / quotes / investors | Public POST | Admin ✓ | Status only | Admin DELETE | |
| Reviews | Client POST | ✓ | Admin status | Admin DELETE | Added |
| Providers | Apply/register | Public read | Profile update | — | Compliance admin |

### Missing / optional future work
| Item | Backend | Frontend |
|------|---------|----------|
| Booking audit backfill | Artisan `bookings:backfill-activity` | — |
| Social login | Google web routes exist | Enable login buttons on `/login` |
| Admin booking detail | — | Reuse shared `BookingDetailView` + admin actions panel (DRY) |
| Messaging hub delete | Per-entity DELETE routes exist | Wire delete in hub UI |
| `messages` sidebar badge | Chat unread only | Optional: include hub `messages-summary` total |

---

## 4. Layout & DRY (implemented / planned)

### Single source of truth added
- `frontend/src/lib/api-response.ts` — API unwrap helper
- `frontend/src/lib/status-styles.ts` — booking/payment/review status classes
- `useApiData` — now SWR-based (aligned with `useData`)
- CSS `--surface-elevated` for repeated `#0B0F19` surfaces

### Removed / deprecated (unused)
- `frontend/deprecated/` — archived unused components
- `frontend_v2_deprecated/` — removed from repository

### Refactors completed (2026-06-02)
All items below are implemented — see `docs/SYSTEM_AUDIT.md` for full audit.

1. Admin booking — `useBookingDetail`, `OperationalLog`, `AdminBookingSidebar`
2. Finance APIs — `/api/admin/financials/charts` + `/financials/transactions`; payouts on `FinancialController`
3. `useAdminInbox()` — messaging hub + delete
4. `config/admin-navigation.tsx` — sidebar + command palette SSOT
5. `MarketingShell` — public/legal marketing pages
6. `resolveMediaUrl()` in `lib/utils.ts`

---

## 5. Database

All 28 domain tables have Eloquent models. Infrastructure tables (cache, jobs, permissions, media, notifications, sanctum tokens) are expected without app models.

Migrations added in cleanup pass:
- Fix `loyalty_points.user_id` foreign key
- Drop `providers.verification_documents` JSON column

---

## 6. Repository cleanup

| Path | Action |
|------|--------|
| `frontend_v2_deprecated/` | Removed from git + `.gitignore` |
| `frontend/deprecated/unused-components/` | Dead code archive |
| `backend/archive/legacy-inertia-controllers/` | Legacy PHP (prior pass) |
