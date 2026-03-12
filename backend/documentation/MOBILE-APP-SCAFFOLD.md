# Mobile App Scaffold (React Native / Expo)

This document describes how to run and extend the Home Service mobile app scaffold.

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli` (or use `npx expo`)
- iOS Simulator (Mac) or Android Studio emulator / physical device

## Quick Start

From the project root:

```bash
cd mobile
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android/iOS) or press `i` for iOS simulator / `a` for Android emulator.

## Project Structure

```
mobile/
├── App.tsx              # Root component and navigation
├── app.json             # Expo config
├── package.json
├── src/
│   ├── screens/         # Login, Home/Search, Bookings (scaffold)
│   ├── api/             # API base URL and auth (Sanctum)
│   └── types/           # Shared types
```

## API Configuration

Set your backend URL in `src/api/client.ts` (or `.env`):

- `EXPO_PUBLIC_API_URL=http://localhost:8000` (development)
- For physical device, use your machine's LAN IP (e.g. `http://192.168.1.x:8000`)

## Auth (Sanctum)

- The scaffold uses token-based auth. After login, store the token and send it as `Authorization: Bearer <token>` (or use cookie-based session if same-origin).
- For Expo, typically you use Sanctum API tokens or SPA auth with a tunnel (e.g. `ngrok`) for same-origin cookies.

## Scaffold Screens

1. **Login** – Email/password form, calls backend login.
2. **Home / Search** – Placeholder for category list and search.
3. **Bookings** – Placeholder for booking list (requires auth).

## Deploy / Build

- **Development:** `npx expo start`
- **Production build (EAS):** Install EAS CLI and run `eas build --platform all` (see [Expo EAS](https://docs.expo.dev/build/introduction/)).

## Notes

- This is a **scaffold only**. Implement full screens and state management (e.g. React Query, Zustand) as needed.
- For real-time chat or notifications, consider Expo push notifications and/or WebSockets to your Laravel backend.
