# app/ — frontend

## `demo.html` — local platform demo

Self-contained, zero-install HTML walkthrough of the IPOA product experience. Useful for internal presentations, design reviews, and demo-day dry runs.

**How to open:**

```bash
open app/demo.html                   # macOS
xdg-open app/demo.html               # Linux
# or just double-click the file in Finder / Explorer
```

No server, no dependencies, no wallet. Open it in any modern browser.

**What it demonstrates:**

- Marketplace grid with all 5 rated catalogs — real RRE badges, scores, LTV caps
- Per-work detail page:
  - Cover art, title, artist, genre
  - Rating breakdown (composite + 5 factor bars with their architecture-doc weights)
  - Concentration (HHI platform + territory with diversification tags)
  - Monte Carlo VaR / CVaR at 95%
  - 60-month forecast chart (P10 / P50 / P90)
- Simulated lifecycle in browser memory:
  - Buy shares at the listed price (decrements your USDC, gives you share tokens)
  - Simulate a royalty deposit ($100 / $1K / $10K buttons)
  - Claim your pro-rata portion (correct math: holder share × new deposits since last checkpoint)
- Portfolio view — your holdings and claimable per work
- Activity log — every action timestamped

**What it does NOT demonstrate** (deliberately):

- Wallet connection (Phantom) — mocked
- On-chain transactions — no calls to the Solana program
- Real-time streaming revenue — royalty deposits are manual demo buttons
- Real cover art — replaced with initials on gradient backgrounds

The math, the rating engine outputs, and the economic logic are all real. The infrastructure plumbing is mocked because the point of this demo is to show the product experience, not to test the chain integration.

**Data source:**

The embedded `RATINGS` object in `demo.html` is a compacted copy of `engine/outputs/*.rating.json`. Forecast arrays are sampled every 6 months (instead of all 60 points) to keep the file small. To update: regenerate with `python3 engine/scripts/precompute_outputs.py` and re-embed.

## Next.js app (planned)

The real hackathon frontend will live in this folder as a Next.js project alongside `demo.html`. Build starts after the Anchor program's core instructions (`buy_shares`, `deposit_royalty`, `claim_royalty`) are working against devnet, per `docs/01-mvp-spec.md` Week 2.

For now, `demo.html` is the product's stand-in — enough to show what the live app will do.
