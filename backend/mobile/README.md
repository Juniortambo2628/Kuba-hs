# Home Service Mobile (Expo scaffold)

Minimal Expo app for the Home Service platform. Connect to your Laravel backend and add login, search, and bookings.

## Quick start

```bash
npm install
npx expo start
```

Then open in Expo Go (scan QR code) or press `i` / `a` for simulator.

## Configuration

- Set `EXPO_PUBLIC_API_URL` in `.env` or in `app.json` extra to point to your API (e.g. `http://192.168.1.x:8000` for device).
- Auth: use Laravel Sanctum (API tokens or cookie session with same-origin).

## Full docs

See [MOBILE-APP-SCAFFOLD.md](../documentation/MOBILE-APP-SCAFFOLD.md) in the documentation folder.
