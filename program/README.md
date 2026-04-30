# Stave Anchor program

Solana on-chain layer: IP fractionalization + royalty distribution.

## Status

**All 5 MVP instructions shipped + tested.** Build is clean, every test passes on a local validator, devnet deploy is queued and waits only on a funded keypair.

| Instruction | What it does | Tests |
|---|---|---|
| `create_work` | Mint Token-2022 share supply (0 decimals, fixed) + initialize the IpWork PDA | 3 |
| `list_shares` | Lock shares in a Listing-PDA-authority vault, set price + payment mint | 4 |
| `buy_shares` | Atomic payment + share transfer; signed by the Listing PDA | 3 |
| `deposit_royalty` | Anyone deposits payment-mint into the work's royalty vault (lazy-init on first call) | 2 |
| `claim_royalty` | Pull-based pro-rata claim with checkpoint math; rejects on no-shares-held / nothing-to-claim | 3 |
| **Total** | | **15/15 passing** |

PDAs: `IpWork`, `Listing`, `RoyaltyVault`, `ClaimRecord`.

## Pending

- `anchor deploy --provider.cluster devnet` — needs ~3 SOL on the deploy keypair (`5YRgcw4XS3ieM2x3TRqwv7D4omDT72wWW7F8g9zb7Loc`); fund via [faucet.solana.com](https://faucet.solana.com).
- After deploy: copy the IDL into `web/lib/idl/` (already mirrored from the local build), set `NEXT_PUBLIC_PROGRAM_ID` in Vercel env, swap the frontend's Tokenize / Buy memo TXs for `program.methods.{createWork, buyShares}().rpc()` calls.
- Post-MVP follow-ups: Metaplex Core NFT CPI inside `create_work`; mainnet audit (Halborn / OtterSec); tranche structuring (senior / mezz / growth).

## Layout

```
program/
├── Anchor.toml                                — declares program ID, scripts, provider
├── Cargo.toml                                 — workspace
├── package.json                               — TS test deps (pnpm)
├── tsconfig.json
├── programs/stave/
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs                             — #[program] entry: 5 public ix
│       ├── constants.rs                       — PDA seed strings + limits
│       ├── errors.rs                          — 14 error variants
│       ├── state/
│       │   ├── ip_work.rs                     — work metadata + share mint pubkey
│       │   ├── listing.rs                     — price, available count, vault
│       │   ├── royalty_vault.rs               — total deposited / claimed
│       │   └── claim_record.rs                — per-holder cumulative + checkpoint
│       └── instructions/
│           ├── create_work.rs
│           ├── list_shares.rs
│           ├── buy_shares.rs
│           ├── deposit_royalty.rs
│           └── claim_royalty.rs
├── tests/stave.ts                             — 15 tests across 4 describe blocks
└── migrations/deploy.ts
```

## Prerequisites

- Rust (stable) + `solana` CLI 3.x
- Anchor 0.31.1 (`avm install 0.31.1 && avm use 0.31.1`)
- Node 20+ + pnpm
- A funded devnet keypair at `~/.config/solana/id.json`

## Commands

```bash
# Install TS test deps
pnpm install

# Build (compiles to BPF; ~40 sec first time)
anchor build

# Run all 15 tests against a local validator
anchor test

# Deploy to devnet (needs ~3 SOL)
anchor deploy --provider.cluster devnet
```

## Conventions

- Program name: `stave`
- Program ID: `EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q` (devnet keypair stored at `target/deploy/stave-keypair.json`, gitignored)
- PDA seeds: `b"work"`, `b"listing"`, `b"royalty"`, `b"claim"` (see `src/constants.rs`)
- Share mint: SPL Token-2022, 0 decimals
- Payment mint: USDC devnet primary; classic SPL or Token-2022 supported
- Commit messages: conventional commits (`feat:`, `fix:`, `test:`, `docs:`)

## Architectural notes

- The `IP_WORK_SEED` + `work_id` pattern lets a creator mint multiple works without juggling Keypairs (no per-work keypair needed; just a monotonic id).
- The IpWork PDA is the share mint's mint authority AND freeze authority. Supply is set at creation; no inflation possible later.
- The Listing PDA is the vault's authority — once the creator lists, they cannot pull listed shares back without going through `buy_shares`.
- The RoyaltyVault PDA is the royalty token vault's authority — same pattern; once deposited, only `claim_royalty` can move funds out, and only to the holder's ATA on a successful pull-based claim.
- Pull-based claim math: `claimable = holder_balance × (total_deposited - claim_record.last_checkpoint) ÷ total_shares`. The `holder_balance` is read at claim time, so a holder who transferred shares between deposit and claim only earns on what they currently hold (the rest is forfeited; explicit MVP behavior per `docs/01-mvp-spec.md`).
- BPF stack constraint: the `BuyShares` Accounts struct has 14 entries, several of them `InterfaceAccount<TokenAccount>`. Without `Box<>` wrappers around the heavy ones, the program overflows the 4 KB BPF stack frame. All large account types in `BuyShares`, `DepositRoyalty`, `ClaimRoyalty` are boxed.
- `core_nft` is `Pubkey::default()` until a follow-up Metaplex Core mint instruction lands.
