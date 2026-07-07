# Sentry React Workshop

This demo is a small ecommerce-flavored React app for testing Sentry:

- console output
- product API network calls
- handled errors
- unhandled render crashes
- session replay

## Step 0: Env Setup

Rename `.env.example` to `.env`.

```bash
mv .env.example .env
```

Create your own Sentry account, create a new React project in Sentry, and copy your DSN client key into `.env`.

It should look something like this:

```env
VITE_SENTRY_DSN=https://69e2a73b3336689e4e301f8b56b0d138@o4511689881878529.ingest.de.sentry.io/4511689887907920
VITE_SENTRY_ENVIRONMENT=development
```

Then run:

```bash
npm install
npm run dev
```

## Step 1: Add Sentry To `main.jsx`

Import Sentry at the top of `src/main.jsx`.

```js
import * as Sentry from "@sentry/react";
```

Add this code before `createRoot(...)`.

```js
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "development",
  debug: true,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      networkDetailAllowUrls: [/.*/],
    }),
  ],

  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});
```

## Step 2: Add The Error Boundary

In `src/main.jsx`, wrap `<App />` with `Sentry.ErrorBoundary`.

Change this:

```jsx
<StrictMode>
  <App />
</StrictMode>
```

To this:

```jsx
<StrictMode>
  <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
    <App />
  </Sentry.ErrorBoundary>
</StrictMode>
```

## Step 3: Test The Buttons

Use the app buttons:

- `🖥️ Write console.log`: creates console output
- `🌐 Load product details`: creates a network request
- `🎟️ Load expired coupon`: sends a handled error
- `💥 Crash Product Details`: throws an unhandled render error

Then check the issue in Sentry for breadcrumbs, replay, tags, network activity, and environment.
