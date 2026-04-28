# Stave Anchor program

Solana on-chain layer: IP fractionalization + royalty distribution.

## Status

**Day 1-2 shipped:** `create_work` instruction initializes `IpWork` PDA, creates the Token-2022 share mint, and mints full supply to the creator's ATA. Three tests cover happy path + two validation errors.

**Upcoming per [`docs/01-mvp-spec.md`](../docs/01-mvp-spec.md):**

- Day 2 (follow-up): Metaplex Core NFT mint CPI inside `create_work`
- Day 3-4: `list_shares`, `buy_shares`
- Day 5-6: `deposit_royalty`, `claim_royalty`
- Day 7: devnet deploy + full-flow integration test

## Layout

```
program/
├── Anchor.toml
├── Cargo.toml
├── package.json
├── tsconfig.json
├── programs/stave/
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── constants.rs
│       ├── errors.rs
│       ├── state/ip_work.rs
│       └── instructions/create_work.rs
├── tests/stave.ts
└── migrations/deploy.ts
```

## Prerequisites

- Rust (stable) + `solana` CLI
- Anchor 0.31.1 (`avm install 0.31.1 && avm use 0.31.1`)
- Node 20+ + yarn/pnpm
- A funded devnet keypair at `~/.config/solana/id.json`

## Commands

```bash
# Install TS test deps
yarn install   # or pnpm install

# Build
anchor build

# Run tests against a local validator
anchor test

# After `anchor build`, note the newly-minted program ID from
#   target/deploy/stave-keypair.json
# and paste it into Anchor.toml [programs.localnet] and
# programs/stave/src/lib.rs's declare_id! — then rebuild.

# Deploy to devnet (Day 7)
anchor deploy --provider.cluster devnet
```

## Conventions

- Program name: `stave`
- PDA seeds: `b"work"`, `b"listing"`, `b"royalty"`, `b"claim"` (see `src/constants.rs`)
- Share mint: SPL Token-2022, 0 decimals
- Payment mint (planned): USDC devnet
- Commit messages: conventional commits (`feat:`, `fix:`, `test:`, `docs:`)

## Notes

- The `IP_WORK_SEED` + work_id pattern allows a creator to mint multiple works without juggling Keypairs.
- The IpWork PDA is the share mint's mint authority AND freeze authority. Supply is set at creation; no inflation possible later.
- `core_nft` is `Pubkey::default()` until the NFT-mint follow-up instruction lands.
- The program ID in `declare_id!` is a placeholder. Replace with the keypair-derived ID after first `anchor build`.
