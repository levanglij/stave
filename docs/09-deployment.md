# 09 — Deployment Guide

Stave's hackathon submission requires a live URL judges can click. We
ship the production URL on **`stave.cc`** (registered at GoDaddy,
served via Vercel). The legacy Vercel subdomain
`stave-five.vercel.app` continues to resolve as a fallback while the
custom domain is the canonical home.

## Path A — Vercel free subdomain (3 min, $0)

Set this up first regardless of the custom domain — it gives you a
working URL while DNS propagates.

**Prerequisite:** D1.3 has landed (Next.js scaffold lives in `web/`).

1. Push the latest `main` to GitHub. (Already set up.)
2. Go to https://vercel.com → sign in with GitHub.
3. Click **Add New → Project**.
4. Find `levanglij/stave` in the list → **Import**.
5. Configure:
   - **Framework preset:** Next.js (auto-detected)
   - **Root Directory:** `web/`
   - **Build command:** leave default (`next build`)
   - **Output directory:** leave default (`.next`)
   - **Install command:** `pnpm install`
6. **Environment variables** — click *Environment Variables*, add:

   | Name                         | Value                                                |
   |------------------------------|------------------------------------------------------|
   | `NEXT_PUBLIC_PRIVY_APP_ID`   | from privy.io dashboard (or leave empty for stub)    |
   | `NEXT_PUBLIC_SOLANA_RPC_URL` | `https://api.devnet.solana.com` (or your Helius URL) |
   | `NEXT_PUBLIC_PROGRAM_ID`     | the program ID after `anchor deploy --provider.cluster devnet` |

7. Click **Deploy**. Takes ~2 minutes.
8. Vercel returns a URL: `https://<auto>.vercel.app`. Copy it. Every
   subsequent push to `main` auto-deploys.

## Path B — Custom domain `stave.cc` (already purchased at GoDaddy)

Two-side configuration: set the DNS at GoDaddy so it points at Vercel,
then add the domain in the Vercel project so Vercel knows to serve it.

### Step 1 — add the domain in Vercel

1. Vercel → **Project (stave-five) → Settings → Domains → Add**.
2. Enter `stave.cc`. Vercel will tell you which DNS records to add.
   The expected pair is:
   - **A record** at apex `@` → `76.76.21.21`
   - **CNAME** at `www` → `cname.vercel-dns.com`
3. Repeat: also add `www.stave.cc` so that subdomain validates.
4. Vercel marks both as "Invalid Configuration" until DNS propagates.

### Step 2 — configure DNS at GoDaddy

GoDaddy domain dashboard → `stave.cc` → **DNS** → **Manage DNS**.
Replace any GoDaddy parking records with the two below.

| Type  | Name | Value                  | TTL    |
|-------|------|------------------------|--------|
| `A`   | `@`  | `76.76.21.21`          | 1 hour |
| `CNAME` | `www` | `cname.vercel-dns.com` | 1 hour |

Delete any existing records that conflict (especially GoDaddy's
default forwarding A records and the CNAME for `_domainconnect`). The
parking page must go.

> **Tip — propagation:** TTL is the cap, not the floor. In practice
> the first record visible to Vercel lands within 5–15 minutes. If
> Vercel still says "Invalid Configuration" after 30 minutes, hit
> *Refresh* on the Domains page and re-check the records at GoDaddy.

### Step 3 — pick the canonical URL

Vercel → **Domains** → click `www.stave.cc` → set **Redirect to
stave.cc**. The apex is now the canonical address shown in the
browser bar; `www` redirects to it 301.

### Step 4 — confirm

In an incognito window:

- `https://stave.cc` — loads, valid SSL, no redirect loop
- `https://www.stave.cc` — 301-redirects to `https://stave.cc`
- `http://stave.cc` — redirects to `https://stave.cc`

Vercel auto-issues an SSL cert via Let's Encrypt the first time the A
record resolves; nothing to do on our side.

## What goes in the Colosseum submission

Submission form's *Live demo URL* field: `https://stave.cc`. The
legacy `stave-five.vercel.app` continues to resolve in case any
already-shared link points at it.

## CI/CD

Every push to `main` triggers a Vercel deploy. Latest deploy is live
on both `stave.cc` and `stave-five.vercel.app`. Branch pushes get
preview URLs (`<branch>-<sha>.vercel.app`) for sharing WIP without
affecting production.

## Rollback

If a push breaks production: Vercel **Deployments** tab → find the
last green deploy → **⋯ → Promote to Production**. Takes 5 seconds.

## Environment variables — keep updated

Two sources of truth:

- `web/.env.example` (committed, no real values)
- Vercel project's *Environment Variables* page (real values)

When you add a new env var to the code, add it to both. Never commit
real values to `.env` — `.gitignore` excludes `.env*` for this
reason.

## Pre-submission domain check

In the 48 hours before the May 11 deadline, verify in incognito:

- [ ] `https://stave.cc` loads without auth
- [ ] No console errors on initial page load
- [ ] Demo flow runs end-to-end
- [ ] All Solana Explorer links resolve
- [ ] Pitch + tech demo videos play from their submission URLs
