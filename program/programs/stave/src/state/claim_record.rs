use anchor_lang::prelude::*;

/// Per-holder claim ledger for one work's royalties.
///
/// Records the holder, their cumulative claimed amount, and a
/// "checkpoint" of the vault's `total_deposited` at their last
/// claim. New claimable amount on the next claim is computed against
/// new deposits since the checkpoint.
///
/// MVP behavior (per docs/01-mvp-spec.md): if the holder transfers
/// shares between a deposit and a claim, the unclaimed portion on
/// the transferred shares is forfeited — the calculation reads
/// `holder_share_ata.amount` at claim time, not at deposit time.
///
/// PDA seeds: `[b"claim", ip_work, holder]`
#[account]
#[derive(InitSpace)]
pub struct ClaimRecord {
    /// The shareholder this record belongs to.
    pub holder: Pubkey,

    /// The work whose royalties this record tracks.
    pub work: Pubkey,

    /// Cumulative amount claimed by this holder (monotonic).
    pub claimed_amount: u64,

    /// Snapshot of `RoyaltyVault.total_deposited` at the holder's
    /// last successful claim. Initialized to zero on first claim;
    /// any deposits before that point are claimable on first claim.
    pub last_claim_total_deposited: u64,

    /// PDA bump.
    pub bump: u8,
}
