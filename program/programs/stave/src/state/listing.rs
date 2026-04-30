use anchor_lang::prelude::*;

/// On-chain record of a fractional-share listing.
///
/// Created by the work's creator after `create_work`. Locks
/// `shares_available` shares into a vault token account whose authority
/// is this Listing PDA, so the creator cannot pull them back without
/// going through `buy_shares`.
///
/// PDA seeds: `[b"listing", ip_work]`
#[account]
#[derive(InitSpace)]
pub struct Listing {
    /// The IpWork PDA this listing belongs to.
    pub work: Pubkey,

    /// Price per share, denominated in `payment_mint`'s smallest unit
    /// (e.g., 6 decimals for USDC: 1_000_000 == 1 USDC).
    pub price_per_share: u64,

    /// Number of shares currently for sale (decreases on each buy).
    pub shares_available: u64,

    /// Mint of the payment token accepted. USDC devnet at launch;
    /// wSOL is a stretch.
    pub payment_mint: Pubkey,

    /// Vault token account holding the listed shares. Authority is
    /// this Listing PDA.
    pub vault: Pubkey,

    /// PDA bump.
    pub bump: u8,
}
