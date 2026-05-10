# 00 - Positioning

> Single source of truth for how Stave and IPOA relate. If anything in
> the repo, the deck, the site, or the pitch contradicts this doc, this
> doc wins. Update here first, then propagate.

## What Stave is

**Stave is a Solana-based marketplace for tokenized music royalties.**
Catalogs are fractionalized into Token-2022 shares. Investors buy
shares with USDC. Royalty income paid to a tokenized catalog is then
distributed on-chain pro-rata to whoever holds the shares.

Solana is not decoration. Sub-cent fees make per-quarter pro-rata
distributions to thousands of fractional holders economically viable.
Token-2022 makes the shares standard fungibles - day-one composable
with DEXs, lending, and fund vehicles.

## What IPOA is

**IPOA - Intellectual Property Owners Association of Georgia.**

A traditional, government-recognised music rights organisation.
**Not a crypto entity.** No token, no chain, no smart contracts. They
operate in standard financial terms: collect royalty income from
real-world music industry sources (streaming, mechanical reproduction,
public performance, neighbouring rights, synchronization, TV broadcast)
and distribute that income to Georgian artists and rightsholders.

IPOA has held exclusive nationwide collection rights in Georgia under
Article 64 of the Law on Copyright and Related Rights since
1 January 2024.

## The partnership

IPOA owns the data and the off-chain settlement rails. Stave owns the
on-chain marketplace and rating engine. The partnership is the bridge.

```
Real world (off-chain)                              Solana (on-chain)
──────────────────────────                          ────────────────────────
  Music plays everywhere
  (Spotify · radio · TV · sync · etc.)
            │
            ▼
  IPOA collects royalties              ─── partnership ──▶   Stave receives:
  (traditional rights org,                                   1. verified ownership data
   government mandate since 2024)                            2. royalty cashflow records
            │                                                       │
            │                                                       ▼
            │                                                Stave RRE engine rates
            │                                                each catalog (AAA → B)
            │                                                       │
            │                                                       ▼
            │                                                Stave fractionalizes catalog
            │                                                into 1,000 Token-2022 shares
            │                                                       │
            │                                                       ▼
            │                                                Investors buy shares with USDC
            │                                                       │
            ▼                                                       │
  IPOA pays the per-catalog ────── settlement bridge ──────▶ Stave deposits the share
  royalty quarterly                                          into the on-chain royalty
                                                             vault → pro-rata claim
                                                             to every token holder
```

## What flows in each direction

**IPOA → Stave:**
- Verified ownership records (who owns what % of each catalog)
- Royalty cashflow history (used by the rating engine to compute decay,
  concentration, volatility)
- Quarterly royalty payments (settled as USDC into Stave's per-catalog
  on-chain royalty vault)

**Stave → IPOA:**
- A new distribution channel reaching investors who could not access
  Georgian music IP through traditional finance
- Transparent grading methodology that increases price discovery for
  IPOA-administered catalogs
- Capital flowing into Georgian rightsholders that would not otherwise
  have a path

**Investor → Stave:**
- USDC in exchange for fractional ownership of future royalty income
- One token = one share = one vote-equivalent claim against the
  on-chain royalty vault for that catalog

**Stave → Investor:**
- Pro-rata royalty distributions in USDC, paid every time IPOA settles
  a royalty cycle for a tokenized catalog

## What Stave is NOT

- Not a music streaming service. Stave does not host audio.
- Not a record label. Stave does not sign or release artists.
- Not a custodian. Funds flow wallet-to-wallet via the Anchor program -
  Stave never holds investor SOL or USDC.
- Not an exchange. Primary issuance + claim layer; secondary trading
  happens on DEXs.
- Not a DAO. Stave shares are per-catalog claims on royalty cashflow,
  not governance rights over a platform.

## What IPOA is NOT

- Not a Solana protocol.
- Not a token or coin.
- Not a smart contract.
- Not crypto-native.
- Not built by Stave. IPOA exists independently and would continue to
  exist if Stave didn't.

## How to talk about it

Use the canonical sentence in customer-facing copy:

> Stave is a Solana marketplace that fractionalizes music royalty
> ownership into tokens. Catalog data and royalty cashflow come from
> IPOA - Georgia's traditional (non-crypto) music rights organisation -
> which lets Stave rate every catalog with real numbers and route
> royalty distributions on-chain to token holders.

Shorter:

> Stave tokenizes music royalties on Solana. IPOA - Georgia's official
> music rights organisation - is the verified data partner.

When a reader could plausibly confuse IPOA for a crypto entity, add:

> IPOA operates in traditional financial terms. They are not on-chain.

## Surfaces this affects

| Surface | Treatment |
|---|---|
| Site hero | Stave tagline; IPOA appears as outlined "data partner" pill with one-line org description |
| `/how-it-works` | First step is explicit about IPOA's real-world role, then on-chain steps follow |
| `/partners` | IPOA gets its own section with full org context |
| README + SUBMISSION | Stave is the product; IPOA appears as the data + distribution partner |
| Pitch deck | Stave is the product name throughout; IPOA appears only on slides that explain the moat |
| Pitch script | Mentions IPOA with explicit "traditional rights org" framing in the moat beat |

## Decision log

- **2026-05-09** - Doc created. Canonical framing locked.
