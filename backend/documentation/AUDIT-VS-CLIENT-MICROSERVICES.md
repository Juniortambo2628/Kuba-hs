# Audit: Current Platform vs. Client Microservices Vision

This document compares the **current implementation** (single Laravel app with Inertia/React) to the client’s described **9 independent microservices** and data flows. It lists what is in place and what remains to align with that vision.

**Reference:** Client context — “How Everything Comes Together” (Search, Booking, Notification, Payment, Review, Chat, Email via SendGrid). **Checklist:** [AUDIT-IMPLEMENTATION-CHECKLIST.md](./AUDIT-IMPLEMENTATION-CHECKLIST.md).

---

## Lint Fixes Applied

- **NotificationController.php** — Intelephense “Undefined method 'notifications'”: added `@var User` for `Auth::user()` so the IDE recognizes the `Notifiable::notifications()` relationship.
- **PaymentController.php** — “Undefined type 'Log'”: added `use Illuminate\Support\Facades\Log` and use `Log::warning()`.
- **PaymentController.php** — “createIntent utilizes too many types”: added explicit return type `JsonResponse` and `@return JsonResponse` docblock to simplify type inference.

---

## Current Architecture vs. Client’s 9 Microservices

The client described **9 independent microservices** communicating via APIs and shared DB. The current codebase is a **monolith**: one Laravel app with one database. The table below maps each **client flow** to **current behavior** and **gaps**.

| Client flow / service | Current implementation | Status | Gaps / remaining work |
|-----------------------|------------------------|--------|------------------------|
| **User searches for provider** | `MarketplaceController::search` → DB → matching providers. Frontend → Laravel → DB. | ✅ Done | None for flow. Optional: extract to a dedicated Search/Provider API if splitting to microservices. |
| **Customer books service** | `BookingController::store` creates booking; `BookingStatusUpdated` notification to provider (database channel). | ✅ Done | Notifications are **in-app only** (database). No email/SendGrid. |
| **Provider accepts booking** | `BookingController::updateStatus`; notifies customer (and provider) via `BookingStatusUpdated` (database). | ✅ Done | Same: no email. |
| **Customer pays** | `PaymentController`: Stripe API, record payment, update booking status, notify provider via `BookingStatusUpdated`. | ⚠️ Partial | **Missing:** Notify **customer** when payment succeeds (e.g. “Payment received”). Email for payment receipt not implemented. |
| **Customer leaves review** | `ReviewController::store` saves review; recalculates provider `rating_avg` / `review_count` (provider record updated in same app). | ⚠️ Partial | **Missing:** **Notify provider** when a new review is posted. No email. |
| **Users chat** | `ChatController` + polling in frontend; messages saved to DB. | ⚠️ Partial | **Missing:** Client specified “Chat Service (WebSocket) → Real-time message delivery”. Current implementation is **polling**, not WebSocket (e.g. Laravel Reverb / Pusher). |
| **System sends email** | Notifications use **database** channel only. `BookingStatusUpdated::via()` returns `['database']`; `toMail()` exists but is never used. | ❌ Not done | **Missing:** “Any Service → Notification Service → SendGrid → Email delivered.” Need to: (1) Add **mail** (or a dedicated email channel) to notifications, (2) Configure **SendGrid** as mail driver, (3) Trigger email at key events (booking created/accepted/completed, payment received, new review). |

---

## Data Flow Checklist (Client’s “Complete Transaction”)

| Step | Client expectation | Current state |
|------|--------------------|---------------|
| 1. Booking created | Booking Service creates record → `booking_id` | ✅ `BookingController::store` creates booking. |
| 2. Payment made | Payment Service creates payment → links to `booking_id` → calculates fees | ✅ `PaymentController::confirm` creates `Payment`, links to booking, platform fee calculated. |
| 3. Service completed | Booking Service updates status → triggers payment confirmation | ✅ Status update; payment already recorded when customer paid. Optional: explicit “payment confirmation” event/email. |
| 4. Review posted | Review Service creates review → links to `booking_id` → updates provider rating | ✅ Review created, provider `rating_avg` / `review_count` updated. ❌ Provider not notified (in-app or email). |
| 5. Throughout | Notification Service sends **emails** at each step; Chat Service **real-time** | ⚠️ In-app notifications only; no SendGrid email. Chat is polling, not WebSocket. |

---

## What Remains to Be Done (Prioritized)

### 1. Email via SendGrid (Notification Service → Email)

- Configure Laravel to use SendGrid (e.g. SMTP or SendGrid API).
- Add **mail** (or custom channel) to relevant notifications (e.g. `BookingStatusUpdated`, payment confirmation, new review).
- Call notifications from:
  - Booking created / accepted / completed
  - Payment received (customer + optionally provider)
  - New review (to provider)
- Ensure “Notification Service → SendGrid → Email delivered” is satisfied (either from this app or a future Notification microservice).

### 2. Notify customer on payment success

- In `PaymentController::confirm`, after updating booking/payment, notify the **customer** (e.g. “Your payment was successful”) via existing notification class (and later email when mail channel is added).

### 3. Notify provider when a review is posted

- In `ReviewController::store`, after saving the review and updating provider stats, notify the **provider** (in-app; later email when mail is added).

### 4. Real-time chat (WebSocket)

- Client: “Chat Service (WebSocket) → Real-time message delivery”.
- Current: HTTP + polling.
- Option A: Add Laravel Reverb (or Pusher), broadcast new messages, frontend subscribe with Echo.
- Option B: Keep polling and document as “polling-based chat”; plan WebSocket for a later phase.

### 5. (Optional) Microservice split

- If the goal is **9 independent microservices** (separate deployables, APIs, possibly separate DBs), the current monolith would need to be split into services (e.g. Search, Booking, Payment, Review, Notification, Chat, etc.) with clear APIs and ownership of data. That is a larger architectural change and not required to satisfy the *flows* described above.

---

## Summary

- **Lint:** NotificationController and PaymentController issues are fixed.
- **Flows:** Search, booking, accept, payment recording, and review + rating update are implemented. Gaps are:
  - **Email:** No SendGrid/email delivery; notifications are in-app only.
  - **Payment:** Customer not notified on payment success.
  - **Review:** Provider not notified when a review is posted.
  - **Chat:** Real-time WebSocket not implemented (polling only).
- **Next steps:** Add SendGrid and email channel to notifications, add missing notification triggers (payment to customer, review to provider), then consider WebSocket chat and (if required) microservice decomposition.
