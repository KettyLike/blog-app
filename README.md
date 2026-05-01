# BlogApp

BlogApp is a mobile blog application built with React Native, Expo, and a local Express backend. The app lets users register, sign in, create posts with images, read articles, and leave comments.

## Features

- user registration and login;
- bottom tab navigation: Home, Write, Profile;
- article list loaded from the backend;
- article details screen with formatted content;
- creating new posts as the signed-in user;
- optional cover image upload from the device gallery;
- comments saved with the registered user's name automatically;
- profile screen with avatar upload and logout;
- native article sharing;
- local JSON databases for users, articles, and comments.

## Tech Stack

- React Native
- Expo
- React Navigation
- Express
- JSON files as a local database

## Install Dependencies

Install all project dependencies from the repository root:

```bash
npm install
```

## Run Backend

```bash
npm run server
```

Keep this terminal open while using the app. The backend runs on:

```text
http://localhost:4000
```

## Run Mobile App

Open a second terminal and start Expo:

```bash
npm start
```