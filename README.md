# BlogApp

Mobile blog application built with `React Native` and `Expo`.

This step includes the base app structure with real stack navigation via `React Navigation`, formatted article content, comments, native share support, and a comment creation form.

## Implemented in this step

- home screen with article previews;
- article details screen opened through `React Navigation`;
- formatted content rendering: headings, paragraphs, images;
- comments section on the article screen;
- comment creation form with instant UI update;
- project structure for further development.

## Project structure

```text
src/
  components/
  data/
  navigation/
  screens/
  theme/
```

## Install dependencies

```bash
npm install
```

## Run the app

```bash
npm start
```

Then choose Android in the Expo terminal with `a`, or iOS with `i` on macOS.

## Next steps

- improve navigation;
- move mock data into a dedicated service layer;
- add persistence for comments;
- polish the final UI.
