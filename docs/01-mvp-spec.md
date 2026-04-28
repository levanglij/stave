# 01 — Stave MVP Spec

## User Stories (MVP only)

### As an artist
1. I connect my wallet and create an "IP Work" by uploading a cover image, an audio preview, and metadata (title, description, artist name, ISRC if any).
2. I choose how many royalty shares to mint (e.g., 1,000), how many to keep (e.g., 500), and a sale price per share.
3. I publish the listing; my retained shares stay in my wallet, the sale shares go into a marketplace vault.

### As a buyer
4. I browse listed works, view details, and buy N shares at the listed price.
5. My wallet receives the share tokens; the artist receives the payment.

### As a revenue depositor (artist or anyone simulating streaming revenue in demo)
6. I deposit SOL or USDC into a work's royalty vault.
7. Any shareholder can claim their pro-rata portion at any time.

## Data Model (on-chain)

### `IpWork` PDA
- `seeds = [b"work", creator, work_id]`
- Fields: `creator: Pubkey`, `metadata_uri: String`, `core_nft: Pubkey`, `share_mint: Pubkey`, `total_shares: u64`, `created_at: i64`

### `Listing` PDA
- `seeds = [b"listing", work]`
- Fields: `work: Pubkey`, `price_per_share: u64`, `shares_available: u64`, `payment_mint: Pubkey` (SOL wrapped or USDC), `vault: Pubkey`

### `RoyaltyVault` PDA
- `seeds = [b"royalty", work]`
- Fields: `work: Pubkey`, `total_deposited: u64`, `total_claimed: u64`, `payment_mint: Pubkey`

### `ClaimRecord` PDA
- `seeds = [b"claim", work, holder]`
- Fields: `holder: Pubkey`, `claimed_amount: u64`, `last_claim_total_deposited: u64` (checkpoint for pro-rata math)

## Instructions

1. `create_work(work_id, metadata_uri, total_shares)` — mints Core NFT + Token-2022 share mint, initializes IpWork PDA.
2. `list_shares(price_per_share, shares_to_list, payment_mint)` — transfers shares to listing vault, creates Listing PDA.
3. `buy_shares(amount)` — pulls payment from buyer, sends to creator, transfers shares from vault to buyer.
4. `deposit_royalty(amount)` — adds to RoyaltyVault, updates total_deposited.
5. `claim_royalty()` — calculates `(holder_share_balance / total_shares) * (total_deposited - last_claim_checkpoint)`, transfers, updates ClaimRecord.

## Royalty Math (keep this simple for MVP)
On claim: `claimable = (holder_balance * (total_deposited - claim_record.last_checkpoint)) / total_shares - already_claimed_since_checkpoint`
After claim: update `claim_record.last_claim_total_deposited = current total_deposited`, `claimed_amount += claimable`.

Edge case to handle: if holder transfers shares after a deposit but before claiming, they forfeit the unclaimed portion on those transferred shares. Document this in the README as acceptable MVP behavior.

## Frontend Pages
1. `/` — landing page, Stave pitch, "Connect Wallet" CTA
2. `/create` — artist flow: upload assets, set shares/price, mint + list
3. `/marketplace` — grid of all listed works
4. `/work/[id]` — detail page: metadata, audio preview, buy shares, deposit royalty (for demo), claim button
5. `/portfolio` — holder view: my shares across works, claimable royalties per work

## Ordered Build Plan (3-week sprint)

### Week 1 — Program + core flows
- **Day 1-2**: Anchor scaffolding, IpWork + share mint instruction, tests
- **Day 3-4**: Listing + buy_shares instruction, tests
- **Day 5-6**: Royalty vault + deposit/claim, tests (this is the hardest part — budget extra time)
- **Day 7**: Deploy to devnet, write integration test that runs full flow

### Week 2 — Frontend
- **Day 8-9**: Next.js scaffold, wallet connection, layout, landing page
- **Day 10-11**: Create flow with Irys upload integration
- **Day 12-13**: Marketplace + work detail + buy flow
- **Day 14**: Portfolio + claim flow, polish

### Week 3 — Submission
- **Day 15-16**: End-to-end testing on devnet, bug bash, seed 3-5 demo listings
- **Day 17**: Pitch deck final version, pitch video recording
- **Day 18**: Technical demo video recording
- **Day 19**: README, GitHub cleanup, submission dry run
- **Day 20-21**: Submit, buffer for issues

## Definition of Done for MVP
- [ ] Anchor tests green
- [ ] Deployed to devnet with program ID pinned in app env
- [ ] Frontend deployed to Vercel
- [ ] 3+ demo works listed on the live devnet deployment
- [ ] Full flow works end-to-end with Phantom on devnet
- [ ] Pitch video, tech demo, deck all finalized
- [ ] README with setup instructions, architecture diagram, demo link
