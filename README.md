# BlogApp

Mobile blog application built with `React Native`, `Expo`, and a small local `Express` backend.

This step includes the base app structure with real stack navigation via `React Navigation`, articles and comments loaded from a backend API, article refresh on details open, native share support, and an inline comment composer.

## Implemented in this step

- home screen with article previews loaded from backend;
- article details screen opened through `React Navigation`;
- formatted content rendering: headings, paragraphs, images;
- comments section on the article screen;
- article details refreshed through `GET /articles/:id` on screen open;
- inline comment composer inside the comments section;
- articles and comments served by a local backend API;
- project structure for further development.

## Project structure

```text
src/
  components/
  config/
  navigation/
  screens/
  services/
  theme/

server/
  data/
```

## Install dependencies

```bash
npm install
```

## Run backend

```bash
npm run server
```

Keep this terminal open while the app is running.

## Run the app

```bash
npm start
```

Then choose Android in the Expo terminal with `a`, or iOS with `i` on macOS.

## Backend URL for devices

- Android emulator uses `http://10.0.2.2:4000` or auto-detects your Expo host when possible.
- iOS simulator uses `http://localhost:4000` automatically.
- Physical device: start Expo with `EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:4000 npm start`

If you see `Network request failed`, check these two things first:

- `npm run server` is running in a separate terminal;
- your phone and computer are on the same Wi‑Fi network.

## Next steps

- improve navigation;
- move mock data into a dedicated service layer;
- polish the final UI.
