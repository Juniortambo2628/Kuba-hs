# Phase C — Provider Admin CRUD

**Status: Implemented** (admin API + `/admin/providers` UI)

Phase C adds a **first-class admin surface for providers** (workforce), separate from the public marketplace profile and the provider self-service dashboard. Today, provider lifecycle is split across:

| Surface | What exists today |
|---------|-------------------|
| Public API | `GET /api/providers`, `GET /api/providers/{id}` (read-only marketplace) |
| Provider app | `/dashboard/provider/*` (self-service: services, availability, bookings) |
| Admin compliance | `/admin/compliance` + `/api/admin/compliance/*` (documents, quality score) |
| Admin verification | `/admin/workforce/verification` (application queue) |
| Admin users | `/admin/users` (can toggle user status; role `provider` on `users`) |

There is **no** dedicated admin CRUD for the `providers` table (business profile, radius, verification flags, financial fields).

---

## Goals

1. List and search all providers with compliance and booking KPIs.
2. View/edit provider business profile (not impersonating the user login).
3. Admin actions: verify, suspend, adjust `application_status`, view earnings balance.
4. Optional: link to compliance documents and bookings from one detail screen.

---

## Backend design

### New routes (`/api/admin/providers`, `middleware: admin`)

| Method | Path | Action |
|--------|------|--------|
| GET | `/api/admin/providers` | Paginated index with filters (`search`, `compliance_status`, `application_status`, `is_verified`) |
| GET | `/api/admin/providers/{provider}` | Show with `user`, `verificationDocuments`, counts (bookings, reviews) |
| PUT/PATCH | `/api/admin/providers/{provider}` | Update business fields (not password) |
| PATCH | `/api/admin/providers/{provider}/status` | `application_status`, `is_verified`, `availability_status` |
| DELETE | `/api/admin/providers/{provider}` | Soft-delete or deactivate (prefer `users.is_active` + provider flag) |

### Controller

`App\Http\Controllers\Admin\ProviderController`

- Reuse `ProviderResource` or extend `AdminProviderResource` with admin-only fields (`balance`, `total_earned`, `quality_score`, `compliance_status`).
- Validation mirrors `providers` migration columns (no JSON `verification_documents` — table only).
- On verify: sync `is_verified`, optionally notify user.
- On delete: set `users.is_active = false`, cancel pending bookings policy TBD.

### Authorization

- Already covered by `EnsureAdmin` on admin route group.
- Do **not** expose balance adjustment without audit log (future: `provider_admin_logs` table).

### Database

No new tables required for MVP. Optional later:

- `provider_admin_notes` (admin_id, provider_id, note, created_at)
- `provider_status_history` (audit trail)

---

## Frontend design

### New pages

| Route | Purpose |
|-------|---------|
| `/admin/providers` | Data table: name, email, compliance, rating, bookings, status |
| `/admin/providers/[id]` | Detail tabs: Profile, Documents (embed compliance API), Bookings, Earnings |

### Sidebar

Add **Workforce → Providers** under or beside Compliance (distinct from “Users” which is account-level).

### Components (reuse)

- `DashboardPageHeader`, `DataToolbar`, `DashboardStatusBadge` (compliance + application status)
- `ComplianceStatusBadge` (already shared)
- `useApiData` / `useData` for reads; axios PATCH for writes

### API mapping

```text
List:    GET  /api/admin/providers?search=&compliance_status=
Detail:  GET  /api/admin/providers/{id}
Update:  PATCH /api/admin/providers/{id}
Status:  PATCH /api/admin/providers/{id}/status
```

---

## CRUD matrix (Phase C)

| Operation | Backend | Frontend |
|-----------|---------|----------|
| **Create** | Optional: admin-invite provider (creates User + Provider) — can defer to existing `/api/auth/register-provider` | “Invite provider” form (stretch) |
| **Read** | Index + show | List + detail pages |
| **Update** | PATCH profile fields | Edit form on detail |
| **Delete** | Deactivate user + provider | Confirm dialog → deactivate |

---

## Implementation order (suggested)

1. **Backend** `ProviderController@index`, `@show` + routes (read-only ship).
2. **Frontend** `/admin/providers` list wired to index.
3. **Backend** `@update`, `@updateStatus`.
4. **Frontend** detail page with profile form.
5. **Sidebar** + command palette entry.
6. **QA** with compliance and workforce verification flows (no duplicate sources of truth).

---

## Out of scope (Phase C)

- Payout execution (stays under `/admin/payments` / financials).
- Replacing Spatie roles (still using `users.role`).
- Provider impersonation login.

---

## Effort estimate

| Layer | Estimate |
|-------|----------|
| Backend API | 1–2 days |
| Frontend list + detail | 1–2 days |
| QA + docs | 0.5 day |

**Total:** ~3–4 days for MVP admin provider management.
