# 09 — Deployment Guide

Stave's hackathon submission requires a live URL judges can click. Two
paths, in order of effort.

## Path A — Vercel free subdomain (3 min, $0)

Default for hackathon submission. URL looks like `stave.vercel.app`
(if available) or `stave-levanglij.vercel.app`. Do this **first**,
even if you also plan to do Path B — it gets you a working URL while
the custom domain DNS propagates.

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

That URL is what goes in the Colosseum submission form's *Live demo
URL* field if you stop here.

## Path B — Custom domain `stave.app` (30 min, ~$14/yr)

Polishes the submission. Does not change the build — it just swaps
the URL in front of it.

### Step 1 — pick a domain

| Domain          | Cost/yr (~) | Notes                                                                |
|-----------------|-------------|----------------------------------------------------------------------|
| `stave.app`     | $14         | **Recommended.** Best fintech read. Forced HTTPS — Vercel handles it. |
| `stave.fi`      | $11         | "Finance" abbreviation; Finland ccTLD.                               |
| `stave.io`      | $32         | Tech-default but pricey.                                             |
| `stave.xyz`     | $8          | Cheapest; reads less institutional.                                  |
| `stave.fund`    | $60         | On-message, expensive.                                               |
| `getstave.com`  | $11         | Fallback if `.app` is taken.                                         |

If `stave.app` is taken, fall back to `stave.fi`. Avoid `.com`
aftermarket pricing.

### Step 2 — register at Cloudflare Registrar

Cloudflare sells domains at registry cost (no markup) and includes
DNS, DDoS, and analytics free. Skip GoDaddy/Namecheap — they upsell
and charge more.

1. Go to https://dash.cloudflare.com → sign up if needed.
2. Left nav → **Domain Registration → Register Domains**.
3. Search `stave.app`, add to cart, check out (~$14, charged once).
4. After purchase, Cloudflare creates the DNS zone for the domain
   with default records.

### Step 3 — point the domain at Vercel

1. In Vercel: **Project → Settings → Domains → Add Domain**.
2. Enter `stave.app`. Vercel shows the exact DNS records to add.
   Typically:
   - **A record** at apex: `@` → Vercel's IP (Vercel will show it)
   - **CNAME** at www: `www` → `cname.vercel-dns.com`
3. In Cloudflare: **DNS → Records → Add record** for each:
   - Type `A`, name `@`, IPv4 the value Vercel showed, proxy status
     **DNS only** (gray cloud — *not* the orange one).
   - Type `CNAME`, name `www`, target `cname.vercel-dns.com`, proxy
     status **DNS only**.
4. Save. Wait 1–10 min for propagation.
5. Refresh Vercel's Domains page. Status flips to green ✓. Vercel
   auto-issues an SSL cert via Let's Encrypt.

> **Why DNS-only on Cloudflare?** Vercel needs an unproxied DNS
> lookup to route traffic and provision certs. The orange-cloud proxy
> mode requires additional config we don't need for the hackathon.
> Skip it.

### Step 4 — pick the canonical URL

Vercel → **Domains** → click `stave.app` → set **Redirect** so
`www.stave.app` → `stave.app`. The apex is now the canonical URL
that shows in the address bar.

### Step 5 — confirm

In an incognito window: `https://stave.app`. Should load over HTTPS,
no cert warning, no redirect loop. Ship it.

## What goes in the Colosseum submission

Submission form's *Live demo URL* field:

- Path A: the `*.vercel.app` URL Vercel auto-generated
- Path B: `https://stave.app`

Both work. Path B reads more polished — judges see a real domain.

## CI/CD

Every push to `main` triggers a Vercel deploy. Latest deploy is live.
Branch pushes get preview URLs (`<branch>-<sha>.vercel.app`) for
sharing WIP without affecting production.

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

- [ ] `https://<your-url>` loads without auth
- [ ] No console errors on initial page load
- [ ] Demo flow runs end-to-end
- [ ] All Solana Explorer links resolve
- [ ] Pitch + tech demo videos play from their submission URLs
