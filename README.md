# Sara × VIP — Demo Prototype

A single-page, no-backend simulation of **Sara**, Confido Health's voice-AI appointment agent, deployed for a 69-location ophthalmology group ("VIP"). Split-screen: the left panel plays a phone call with Sara (auto-play or click-through interactive mode, with optional browser text-to-speech); the right panel is a mock "VIP Operations View" that updates live as the call progresses — schedule rewritten, waitlist backfilled, an insurance-verification task created, a confirmation text sent, and a call log filled in. A second tab shows a clinical call correctly escalated to a human, and a third tab is a small interactive ROI calculator. No real PHI, no LLM calls, no telephony, no backend — everything runs client-side from a deterministic script.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Outputs static files to `dist/`. Preview the production build locally with `npm run preview`.

## Deploy

**Vercel (one command):**

```bash
npx vercel --prod
```

Follow the prompts (first run links/creates a project); Vercel auto-detects the Vite build (`npm run build`, output `dist/`).

**GitHub Pages (one command):**

```bash
npm run build && npx gh-pages -d dist
```

This pushes the contents of `dist/` to a `gh-pages` branch. Then enable Pages for that branch under your repo's Settings → Pages. The Vite config uses relative asset paths (`base: './'`), so the built site works from any subpath without further config.
