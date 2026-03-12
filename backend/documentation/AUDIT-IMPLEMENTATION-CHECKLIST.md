# Audit Implementation Checklist

Track progress for remaining features from [AUDIT-VS-CLIENT-MICROSERVICES.md](./AUDIT-VS-CLIENT-MICROSERVICES.md). Implement in the order below.

**Reference:** Client vision — Notification Service → SendGrid → Email; notify all parties on payment; notify provider on review; Chat (WebSocket).

---

## Lint

- [x] **L.1** Fix PaymentController `createIntent` PHP6613 (reduce type inference) — extract Stripe call to private method with explicit return type.

---

## 1. Email via SendGrid (Notification Service → Email)

- [x] **1.1** Configure Laravel mail for SendGrid (`.env`: `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` or SendGrid API key; config if needed).
- [x] **1.2** Add **mail** channel to `BookingStatusUpdated` (`via()` return `['database', 'mail']`) and implement `toMail()` with booking-specific message (status, booking number, link).
- [x] **1.3** Create `PaymentReceived` notification (database + mail) for customer: “Your payment was successful”, booking #, amount.
- [x] **1.4** Create `NewReviewReceived` notification (database + mail) for provider: “You received a new review”, rating, booking #.
- [x] **1.5** Trigger email at key events: booking created, booking accepted/completed, payment received (customer + provider), new review (provider). Ensure notifications are sent (and queued if desired).

---

## 2. Notify customer on payment success

- [x] **2.1** In `PaymentController::confirm`, after creating payment and updating booking, notify the **customer** (e.g. `PaymentReceived` or `BookingStatusUpdated` with “Payment received” message).
- [x] **2.2** Ensure in-app notification appears for customer; when 1.x is done, email is sent automatically if notification has mail channel.

---

## 3. Notify provider when a review is posted

- [x] **3.1** In `ReviewController::store`, after saving review and updating provider stats, notify the **provider** (e.g. `NewReviewReceived` notification).
- [x] **3.2** Ensure in-app notification; when 1.x is done, email is sent if notification has mail channel.

---

## 4. Real-time chat (WebSocket)

- [x] **4.1** `config/broadcasting.php` added (log + reverb). Run `php artisan reverb:install` to add REVERB_* to `.env`.
- [x] **4.2** `MessageSent` event (ShouldBroadcast), private channel `conversation.{id}`.
- [x] **4.3** Authorize in `routes/channels.php`; channels loaded in `bootstrap/app.php`.
- [x] **4.4** In `ChatController::sendMessage`, dispatch `MessageSent` after saving message.
- [x] **4.5** Frontend: `laravel-echo` and `pusher-js` in package.json; `resources/js/echo.js` initializes Echo when `VITE_REVERB_APP_KEY` set; `Chat/Show.jsx` subscribes to `private('conversation.{id}').listen('.message.sent')` and appends messages; polling kept as fallback (5s or 15s when Echo active).

---

## 5. (Optional) Microservice split

- [ ] **5.1** Only if client requires 9 independent deployable services: define service boundaries, APIs, and data ownership; plan extraction from monolith.

---

## Progress summary

| # | Item | Status |
|---|------|--------|
| L.1 | PaymentController createIntent lint | ✅ Done |
| 1.1–1.5 | Email via SendGrid + mail on notifications | ✅ Done |
| 2.1–2.2 | Notify customer on payment success | ✅ Done |
| 3.1–3.2 | Notify provider on review | ✅ Done |
| 4.1–4.5 | Real-time chat (WebSocket) | ✅ Done |
| 5.1 | Microservice split (optional) | ⬜ Optional |

**Last updated:** Check off items as you complete them; update status above.
