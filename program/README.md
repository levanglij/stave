# Stave Anchor program

Solana on-chain layer: IP fractionalization + royalty distribution.

## Status

**All 5 MVP instructions shipped + tested + deployed.** Build is clean, every test passes on a local validator, and the program is live on Solana devnet at [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet).

| Instruction | What it does | Tests |
|---|---|---|
| `create_work` | Mint Token-2022 share supply (0 decimals, fixed) + initialize the IpWork PDA | 3 |
| `list_shares` | Lock shares in a Listing-PDA-authority vault, set price + payment mint | 4 |
| `buy_shares` | Atomic payment + share transfer; signed by the Listing PDA | 3 |
| `deposit_royalty` | Anyone deposits payment-mint into the work's royalty vault (lazy-init on first call) | 2 |
| `claim_royalty` | Pull-based pro-rata claim with checkpoint math; rejects on no-shares-held / nothing-to-claim | 3 |
| **Total** | | **15/15 passing** |

PDAs: `IpWork`, `Listing`, `RoyaltyVault`, `ClaimRecord`.

## Verify on devnet *(real on-chain state, click any link)*

| What | Address / TX |
|---|---|
| **Stave program** | [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet) |
| **First IpWork PDA** *(Suliko, work_id=1)* | [`32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6`](https://explorer.solana.com/address/32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6?cluster=devnet) |
| **First Share mint** *(Token-2022, 1 000 supply, 0 decimals)* | [`DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at`](https://explorer.solana.com/address/DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at?cluster=devnet) |
| **First Listing PDA** *(500 shares at 0.5 USDC)* | [`EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa`](https://explorer.solana.com/address/EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa?cluster=devnet) |
| **`create_work` TX** | [`24aATvsP…G9Xbo`](https://explorer.solana.com/tx/24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo?cluster=devnet) |
| **`list_shares` TX** | [`5mGeuaHo…4sK8b`](https://explorer.solana.com/tx/5mGeuaHoUSi35ArqoeEiFb7xqZVQci6yKppUuL9X3yKyVsdrduEesFKYN3efuex38UnHM9PG6ohUaJVjHDf4sK8b?cluster=devnet) |

Bootstrap manifest: [`bootstrap-output.json`](./bootstrap-output.json). A second catalog (Nine Million Bicycles, work_id=2) lands via [`scripts/bootstrap-bicycles.ts`](./scripts/bootstrap-bicycles.ts) — output at `bootstrap-bicycles.json` after the script runs.

## Security & safety checklist

Every box below is verifiable in the source. Anything unchecked is a planned addition with a note.

- [x] **PDA-only authority on funds-holding accounts.** Listing PDA owns the share vault; RoyaltyVault PDA owns the royalty vault. Once locked, only `buy_shares` / `claim_royalty` can move funds out.
- [x] **No unbounded supply.** The IpWork PDA is the share mint's mint authority AND freeze authority. Total supply is set at `create_work` and cannot inflate.
- [x] **Pull-based royalty claims.** Holders initiate claims; program never pushes. Eliminates a class of forced-transfer / fail-on-receive bugs.
- [x] **Checkpoint accounting per ClaimRecord.** Holders can claim multiple times across multiple deposits; double-claims are rejected by checkpoint comparison.
- [x] **BPF stack-frame safety.** The `BuyShares`, `DepositRoyalty`, `ClaimRoyalty` Accounts structs have 12-15 entries with several `InterfaceAccount<TokenAccount>` fields. Heavy fields are wrapped in `Box<>` to stay under the 4 KB BPF stack limit.
- [x] **14 named error variants** in `programs/stave/src/errors.rs`, each with an explicit `#[msg(...)]` string for clean Explorer traces.
- [x] **`#[derive(Accounts)]` constraints** enforce mint, owner, and authority relationships at deserialization — invalid account combos fail before any logic runs.
- [x] **Token-2022 throughout share mints** with 0 decimals; classic SPL or Token-2022 supported on the payment side.
- [x] **15/15 tests passing on a local validator** including: zero-balance reverts, ownership reverts, double-claim reverts, multi-deposit claim sequences, partial purchases.
- [x] **Devnet deploy live + first work bootstrapped** — judges can click into any of the addresses above and see real on-chain state.
- [ ] **Mainnet audit (Halborn / OtterSec)** — planned post-hackathon.
- [ ] **Formal verification of claim math** — out of scope; deferred to post-audit.

## PDA hierarchy

```
                ┌─────────────────────────┐
                │   Stave program         │  EcJDYr1y…bKR3Q
                │   (BPF Loader v3)       │
                └────┬───────────┬────────┘
                     │           │
        seeds=[b"work", creator,│work_id_le]
                     │           │
                     ▼           │
        ┌──────────────────┐     │
        │  IpWork PDA      │     │
        │  ─ creator       │     │   mint authority +
        │  ─ work_id (u64) │─────┼───── freeze authority
        │  ─ share_mint    │     │
        │  ─ total_shares  │     │
        │  ─ metadata_uri  │     ▼
        └────────┬─────────┘  ┌──────────────────────┐
                 │            │  Token-2022 mint      │
   seeds=[b"listing", ipwork] │  ─ 0 decimals         │
                 │            │  ─ supply == fixed    │
                 ▼            └──────────────────────┘
        ┌──────────────────┐
        │  Listing PDA     │── authority ──▶ Listing vault
        │  ─ price         │                 (Token-2022 ATA holding shares for sale)
        │  ─ payment_mint  │
        │  ─ shares_left   │
        └──────────────────┘

         seeds=[b"royalty", ipwork]
                 ▼
        ┌──────────────────┐
        │ RoyaltyVault PDA │── authority ──▶ Royalty vault
        │  ─ total_dep'd   │                 (USDC ATA holding undistributed royalties)
        │  ─ total_claimed │
        └──────────────────┘

         seeds=[b"claim", royaltyvault, holder]
                 ▼
        ┌──────────────────┐
        │ ClaimRecord PDA  │   one per (vault × holder); records last checkpoint
        └──────────────────┘
```

## Pending

- **Frontend wiring:** swap the placeholder SPL Memo TXs in `web/components/{tokenize-form, purchase-panel}.tsx` for `program.methods.{createWork, buyShares}().rpc()` calls against the IDL at `web/lib/idl/stave.ts`. Tracked as the next post-deploy task — until then the buttons fire real devnet Memo TXs as a wallet-flow placeholder.
- **Post-MVP follow-ups:** Metaplex Core NFT CPI inside `create_work`; mainnet audit (Halborn / OtterSec); tranche structuring (senior / mezz / growth).

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
├── scripts/
│   ├── bootstrap-suliko.ts                    — devnet: create_work + list_shares for evergreen-001
│   └── bootstrap-bicycles.ts                  — devnet: same flow for active-pop-001
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

# Bootstrap a fresh on-chain catalog after deploy
pnpm tsx scripts/bootstrap-suliko.ts        # work_id=1, Suliko
pnpm tsx scripts/bootstrap-bicycles.ts      # work_id=2, Bicycles
```

## Conventions

- **Program name:** `stave`
- **Program ID:** `EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q` (devnet keypair stored at `target/deploy/stave-keypair.json`, gitignored)
- **PDA seeds:** `b"work"`, `b"listing"`, `b"royalty"`, `b"claim"` (see `src/constants.rs`)
- **Share mint:** SPL Token-2022, 0 decimals
- **Payment mint:** USDC devnet primary; classic SPL or Token-2022 supported
- **Commit messages:** conventional commits (`feat:`, `fix:`, `test:`, `docs:`)

## Architectural notes

### Stable PDAs without per-work keypairs

The `IP_WORK_SEED + creator + work_id_le` pattern lets a creator mint multiple works without juggling per-work keypairs. A monotonic `u64` id is enough — the PDA address falls out deterministically and the program can re-derive it from any caller.

### Mint authority lock-in

The IpWork PDA is the share mint's mint authority **and** freeze authority. Supply is set at creation; no future inflation, no later freeze toggles, no rug-on-mint vector. Token-2022's mint-close authority is also nailed to the IpWork PDA, so the mint cannot be silently closed and re-created.

### Listing escrow guarantees

Once the creator calls `list_shares`, the Listing PDA becomes the vault's authority. The creator can no longer pull listed shares back without going through `buy_shares` — buyers get the shares, creators get the payment mint, atomically inside the same instruction. Until shares are listed they remain in the creator's ATA and are theirs to do anything with.

### Pull-based claim math

`claimable = holder_balance × (total_deposited − claim_record.last_checkpoint) ÷ total_shares`

The `holder_balance` is read at claim time, so a holder who transferred shares between deposit and claim only earns on what they currently hold. The remainder is forfeited (explicit MVP behavior per `docs/01-mvp-spec.md`). Post-MVP roadmap includes a "snapshot at deposit" claim mode for catalogs with high turnover.

### BPF stack-frame discipline

The `BuyShares` Accounts struct has 14 entries, several of them `InterfaceAccount<TokenAccount>`. Without `Box<>` wrappers around the heavy ones, the program overflows the 4 KB BPF stack frame. All large account types in `BuyShares`, `DepositRoyalty`, `ClaimRoyalty` are boxed — verified by `cargo build-bpf`'s stack-size warning being silent.

### Reserved fields

`core_nft` on the IpWork account is `Pubkey::default()` until a follow-up Metaplex Core mint instruction lands. Reserved up front so the Anchor account size doesn't change later (no migration needed when the field is populated).
