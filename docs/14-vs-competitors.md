# 14 — Stave vs. nearest competitors

> Honest competitive landscape. Where Stave overlaps, where it differs,
> and what the structural moat looks like. Public-information based —
> nothing here is fabricated or extrapolated from private signals.

## The three closest reference points

### Bolero

Web2 platform for music investment. Lets fans buy royalty rights in
specific songs. Closed marketplace, off-chain settlement, custodial
model. Strong creator-marketing playbook — hosts artist drops as
events. As of public information: not Solana-native, not on-chain.
Pricing model is creator-set, no quantitative grading layer. Audience:
mainstream music fans + smaller-ticket retail.

### SongVest

US-based music royalty marketplace. Acquires partial royalty rights
from sellers and packages them into "SongShares" listed for accredited
investors. SEC-regulated under Reg A+. Off-chain, custodial. Selection
is hand-curated. Strong on-the-ground deal sourcing, weaker on
transparent pricing math. Audience: accredited US retail + family
offices.

### ANote Music

European music royalty marketplace. Catalogs auctioned to investors;
royalty income distributed quarterly. Off-chain, custodial. Operates
under Luxembourg / EU regulatory framework. Hand-curated catalog list,
no public quantitative grading methodology. Audience: European retail
+ accredited.

## Where each overlaps with Stave

Every one of these platforms solves the same surface-level problem:
**putting music royalty income within reach of investor capital.** All
three target the gap between "music is a $30B/yr cash-flow asset class"
and "investors can't easily price or own a slice."

The overlap stops there.

## Where Stave differs

| Dimension | Bolero | SongVest | ANote | **Stave** |
|---|---|---|---|---|
| **Settlement** | Off-chain, custodial | Off-chain, custodial | Off-chain, custodial | **Solana, non-custodial — funds wallet-to-wallet via the Anchor program** |
| **Per-tx settlement cost** | n/a *(off-chain banking rails)* | n/a | n/a | **≈ $0.00025 on Solana** *(1,000-holder distribution = ~$0.25 in fees)* |
| **Token primitive** | Database row | Database row | Database row | **Token-2022 SPL** *(transferable, holdable in any Solana wallet, composable with DEXs / lending / fund vehicles)* |
| **Quantitative grading** | None published | None published | None published | **Open-source 5-layer engine** with formulas in [`engine/FORMULAS.md`](../engine/FORMULAS.md), 31 passing tests |
| **Methodology transparency** | Closed | Closed | Closed | **Every grade is reproducible from raw data → JSON output. Public.** |
| **Source-of-truth data** | Self-reported / DSP feeds | Self-reported / aggregator | Self-reported / aggregator | **Verified by a national CMO (IPOA) at the source** |
| **Geographic origin** | UK / EU | US (Tennessee) | Luxembourg / EU | **Georgia (Caucasus, EU candidate state)** — emerging-market data moat |
| **Catalog selection** | Hand-curated drops | Hand-curated catalog acquisition | Hand-curated auctions | **Methodology-driven — every grade transparently derived. No editorial curation in the rating.** |
| **Open-source** | Closed | Closed | Closed | **MIT licensed across engine + program + frontend** |
| **Investor flow** | Browse drop → Bolero ledger entry | Bid in auction → SongShare position | Bid in auction → ANote position | **Buy on-chain → receive Token-2022 shares in your wallet → claim pro-rata royalties via on-chain instruction** |
| **Custody** | Bolero | SongVest custodian | ANote custodian | **None — buyer's wallet is the custodian** |

## The structural moat: data, not algorithms

A pure-tech competitor — including a fork of Stave — could clone the
engine, the Anchor program, and the marketplace UI in a few weeks. The
code is MIT-licensed; that's intentional.

What they cannot clone is **the data partnership.**

IPOA (Intellectual Property Owners Association) is Georgia's accredited
collective management organization, with **exclusive country-wide
operation since January 1, 2024 under Article 64 of the Law on
Copyright and Related Rights**. By Georgian statute, no other entity
can collect or distribute music royalties at national scale. Any
competitor wanting Georgian catalog data has to either:

1. Get the same data from IPOA — which means a competing partnership,
   or
2. Buy from third-party aggregators — who themselves got the data from
   IPOA, with a layer of error and lag added.

Stave goes to the source. Every grade is cross-validated against
IPOA's ledger. No competitor starting from a pure technology position
can replicate this.

The same regulatory pattern repeats in **every country with a CMO**:
SACEM in France, GEMA in Germany, ASCAP/BMI/SESAC in the US, JASRAC in
Japan, SADAIC in Argentina. Each is a national-scale data monopoly. The
Stave model — partner with the CMO, ground the grades in their data,
tokenize on Solana — is replicable to every country with one. **The
moat compounds with each CMO partnership added.**

## Where Stave is intentionally weaker *(and why it doesn't matter at the seed stage)*

| Where competitors are stronger | Why Stave is okay with that *(today)* |
|---|---|
| **Accredited-investor base.** SongVest has years of accredited US retail. ANote has a Luxembourg-licensed investor pool. | Stave's target user is a *digitally-native investor* who already has a Solana wallet — the audience is different. Building from a different starting point. |
| **Catalog volume.** Bolero has hundreds of artist drops. SongVest has thousands of historical catalogs. | Stave is volume-light by design at MVP. Quality of grades > quantity of listings. Volume scales as more CMOs sign on. |
| **Regulatory licensure.** SongVest is Reg A+. ANote is EU-MiFID-aligned. | Stave's regulatory roadmap *(VASP + Brokerage + AML/KYC)* is in [`docs/10-legal-roadmap.md`](./10-legal-roadmap.md), with primary-source citations. **It's a roadmap, not a fait accompli.** Honest about that. |
| **Brand recognition.** Bolero gets press from artist drops. ANote gets coverage in EU fintech press. | Stave is a hackathon submission. It will be Day 1 brand-wise after the deadline. The product has to do the talking. |

## The summary slide

If you had to compress Stave's positioning vs. these three into one
line:

> *"Bolero, SongVest, and ANote are music marketplaces with private
> data and off-chain settlement. Stave is a music marketplace with
> public methodology, on-chain settlement, and a national rights
> organization as the data source. The first three are products. Stave
> is rails."*
