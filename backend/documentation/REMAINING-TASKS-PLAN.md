# Home Service Platform — Remaining Tasks Plan & Checklist

This document defines the **execution order** and **checklist** for all remaining MVP tasks. Use it to track progress and work in the correct sequence.

**Source:** [PROGRESS-CURRENT.md](./PROGRESS-CURRENT.md)  
**Last updated:** 2025-02-20

---

## Execution order (why this sequence)

| Order | Rationale |
|-------|-----------|
| **1. Provider Setup** | Unblocks provider onboarding; without it, new providers hit errors and can't use the platform. |
| **2. Provider Schedule** | Sidebar "Schedule" needs a real page; building it now avoids dead links later. |
| **3. Reviews listing page** | Sidebar "Service Reviews" needs a target; quick win once Schedule exists. |
| **4. Fix sidebar links** | All targets (dashboard, schedule, reviews, notifications) exist; wire once. |
| **5. Stripe payments** | Completes book → pay flow; depends on booking system (done). |
| **6. Real-time chat** | Independent feature; better after core flows are solid. |
| **7. Admin dashboard** | Platform management; no dependency on chat or payments. |
| **8. Framer Motion polish** | UX enhancement; do after features are stable. |
| **9. Mobile app scaffold** | Optional Phase 5; lowest priority for web MVP. |

---

## Phase 1 — Provider onboarding & navigation (critical path)

### 1.1 Provider profile setup page 🔴 HIGH ✅

- [x] **1.1.1** Create `ProviderController.php` with:
  - [x] `create()` — show setup form (GET)
  - [x] `store()` — save new provider profile (POST)
  - [x] `edit()` — show edit form (GET)
  - [x] `update()` — update provider profile (PUT/PATCH)
- [x] **1.1.2** Add routes for provider setup/edit (e.g. `/provider/setup`, `/provider/edit`).
- [x] **1.1.3** Create `ProviderSetup.jsx` (and optional `ProviderEdit.jsx` or reuse):
  - [x] Business name, description, hourly rate (or per-service pricing).
  - [x] Service category/service multi-select (from `categories` / `services`).
  - [ ] Profile photo upload (store path in `providers` or use existing storage) — optional.
  - [x] Save to `providers` and `provider_services` (and related tables as per schema).
- [x] **1.1.4** Update `DashboardController.php`:
  - [x] Detect provider without profile (e.g. no row in `providers` for current user).
  - [x] Redirect to provider setup page when profile missing.
- [x] **1.1.5** Manual test: Register as provider → redirected to setup → fill form → save → dashboard loads; profile appears in marketplace search.

---

### 1.2 Provider schedule / availability 🟡 MEDIUM ✅

- [x] **1.2.1** Confirm or add DB structure for availability (e.g. `provider_availability` or slots table).
- [x] **1.2.2** Create schedule backend (e.g. `ScheduleController` or methods on `ProviderController`):
  - [x] List/update weekly hours or recurring slots.
  - [ ] Optional: block-out dates/times.
- [x] **1.2.3** Create `Schedule.jsx` (or `ProviderSchedule.jsx`):
  - [x] UI to set recurring availability (e.g. Mon–Sun, time ranges).
  - [ ] Optional: calendar view for overrides.
- [x] **1.2.4** Add route (e.g. `/provider/schedule` or `/dashboard/schedule`).
- [x] **1.2.5** Manual test: Provider can set availability and see it saved.

---

### 1.3 Reviews listing page 🟡 MEDIUM ✅

- [x] **1.3.1** Add backend route/controller method to list reviews for the current user (as provider or customer).
- [x] **1.3.2** Create `Reviews.jsx` (or `ServiceReviews.jsx`) to list reviews with filters/tabs if needed.
- [x] **1.3.3** Add route (e.g. `/dashboard/reviews` or `/reviews`).
- [x] **1.3.4** Manual test: Provider/customer can open "Service Reviews" and see their reviews.

---

### 1.4 Fix sidebar dead links 🔴 HIGH ✅

- [x] **1.4.1** In `Sidebar.jsx`:
  - [x] "My Bookings" → link to `/dashboard` (or existing bookings URL).
  - [x] "Notifications" → link to `/dashboard/notifications` (notifications index page added).
  - [x] "Schedule" → link to provider schedule page (from 1.2).
  - [x] "Service Reviews" → link to reviews listing page (from 1.3).
- [x] **1.4.2** Remove or replace any `#` hrefs; ensure no console/accessibility issues.
- [x] **1.4.3** Manual test: Every sidebar item navigates to a valid page.

---

## Phase 2 — Payments

### 2.1 Stripe payment integration 🟡 MEDIUM ✅

- [x] **2.1.1** Install backend: `composer require stripe/stripe-php`; add `STRIPE_KEY` and `STRIPE_WEBHOOK_SECRET` to `.env`.
- [x] **2.1.2** Install frontend: `npm install @stripe/stripe-js @stripe/react-stripe-js`.
- [x] **2.1.3** Create `PaymentController.php`:
  - [x] `createPaymentIntent()` (or similar) — create Stripe PaymentIntent for a booking; return client secret.
  - [x] `handleWebhook()` — handle `payment_intent.succeeded` (and failures if needed); update `payments` and booking status.
- [x] **2.1.4** Add routes: POST for creating intent; webhook at `/api/stripe/webhook`.
- [x] **2.1.5** Create `PaymentForm.jsx` (Checkout.jsx with Stripe Elements):
  - [x] Use Stripe Elements (CardElement) for card input.
  - [x] Call backend for PaymentIntent; confirm payment with Stripe.js.
  - [x] On success, redirect or update booking state.
- [x] **2.1.6** Integrate payment step into booking flow (e.g. after "Confirm booking" or on booking detail page).
- [x] **2.1.7** Test with Stripe test keys and test cards; verify webhook updates DB.

---

## Phase 3 — Real-time chat

### 3.1 Chat (Laravel Reverb or Pusher) 🟡 MEDIUM ✅

- [x] **3.1.1** Chat implemented with polling (Laravel Reverb/Pusher optional for true real-time).
- [x] **3.1.2** Migrations exist: `conversations`, `messages`.
- [x] **3.1.3** Backend: `ChatController` with index, show, sendMessage, poll, startConversation; authorization.
- [x] **3.1.4** Chat UI: `Chat/Index.jsx`, `Chat/Show.jsx`; conversation list and message thread with poll.
- [x] **3.1.5** Chat linked from sidebar ("Messages"); start from booking via `chat.start` route.
- [x] **3.1.6** Manual test: Customer and provider can send/receive messages (polling).

---

## Phase 4 — Admin

### 4.1 Admin dashboard 🟡 MEDIUM ✅

- [x] **4.1.1** `admin` role on users table; `EnsureAdmin` middleware; alias `admin` in `bootstrap/app.php`.
- [x] **4.1.2** Admin routes: `/admin` → `Admin\DashboardController@index` (middleware `admin`).
- [x] **4.1.3** Admin UI: `Admin/Dashboard.jsx` with stats (users, providers, bookings, completed, revenue) and recent bookings table.
- [ ] **4.1.4** Optional: list/manage users, providers, categories, bookings (CRUD or moderate).
- [x] **4.1.5** Sidebar: "Admin Dashboard" link visible only when `user.role === 'admin'`.
- [x] **4.1.6** Manual test: Admin can access admin area; non-admin gets 403.

---

## Phase 5 — Polish & mobile (lower priority)

### 5.1 Framer Motion polish 🟢 LOW ✅

- [x] **5.1.1** Page transition in `AuthenticatedLayout`: motion.div with opacity + y on content area.
- [x] **5.1.2** Dashboard booking cards: staggerChildren + per-card opacity/y animation.
- [x] **5.1.3** Ensure no layout shift or performance regressions.

---

### 5.2 Mobile app scaffold 🟢 LOW ✅

- [x] **5.2.1** Expo project in `mobile/`: `package.json`, `app.json`, `App.tsx`, `README.md`.
- [x] **5.2.2** Document API base URL and Sanctum auth in `documentation/MOBILE-APP-SCAFFOLD.md`.
- [x] **5.2.3** Minimal single-screen scaffold (extend with login, search, bookings as needed).
- [x] **5.2.4** Document run and deploy in `MOBILE-APP-SCAFFOLD.md` and `mobile/README.md`.

---

## Verification (after each phase or before release)

- [ ] Run `php artisan test` (add/update tests for new code where applicable).
- [ ] Run `npm run build`; fix any frontend errors.
- [ ] **E2E:** Register as provider → complete profile setup → appear in search.
- [ ] **E2E:** Register as customer → search → book → pay (after Stripe) → review.
- [ ] All sidebar links work; mobile responsiveness of sidebar checked.

---

## Progress summary (quick reference)

| Phase | Focus | Status |
|-------|--------|--------|
| 1.1 | Provider profile setup | ✅ Done |
| 1.2 | Provider schedule | ✅ Done |
| 1.3 | Reviews listing page | ✅ Done |
| 1.4 | Sidebar dead links | ✅ Done |
| 2.1 | Stripe payments | ✅ Done |
| 3.1 | Real-time chat | ✅ Done (polling) |
| 4.1 | Admin dashboard | ✅ Done |
| 5.1 | Framer Motion polish | ✅ Done |
| 5.2 | Mobile app scaffold | ✅ Done |

**Completed:** 2025-02-20. All remaining MVP tasks have been implemented. Optional follow-ups: provider profile photo upload, Stripe webhook URL in production (e.g. `https://yourdomain.com/api/stripe/webhook`), admin CRUD for users/providers, Laravel Reverb for true real-time chat.
