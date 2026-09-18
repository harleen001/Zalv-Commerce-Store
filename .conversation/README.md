# ZALV — Fearless Objects

A frontend-only storefront demo for ZALV. Product previews, category filters,
the mobile menu, and the mailing-list confirmation work locally with demo data.
There is no login, database, checkout, API key, or custom backend in this demo.

## Run locally

You need Node.js 18+ and npm, or Bun.

```sh
npm install
npm run dev
```

Open the local address shown in the terminal. To create a production preview:

```sh
npm run build
npm run preview
```

## Deploy

This project is configured as a single prerendered storefront page. Import the
folder into Vercel and use the detected Vite settings; no environment variables
or services are required for the demo.