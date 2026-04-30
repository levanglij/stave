use anchor_lang::prelude::*;

/// On-chain ledger of a work's royalty inflows and outflows.
///
/// Anyone (artist, distributor, manager, fan) can call
/// `deposit_royalty` to fund this vault in `payment_mint`.
/// Shareholders draw against it pro-rata via `claim_royalty`.
///
/// PDA seeds: `[b"royalty", ip_work]`
#[account]
#[derive(InitSpace)]
pub struct RoyaltyVault {
    /// The IpWork PDA this vault belongs to.
    pub work: Pubkey,

    /// Total amount ever deposited (monotonically increasing).
    pub total_deposited: u64,

    /// Total amount ever claimed across all holders.
    pub total_claimed: u64,

    /// Mint of the deposited token. Set on first deposit; immutable.
    pub payment_mint: Pubkey,

    /// PDA bump.
    pub bump: u8,
}
