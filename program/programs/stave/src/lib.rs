//! Stave — on-chain IP fractionalization and royalty distribution.
//!
//! Implemented: `create_work`, `list_shares`. Remaining (`buy_shares`,
//! `deposit_royalty`, `claim_royalty`) are scheduled per
//! `docs/01-mvp-spec.md` ordered build plan.

use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

pub use instructions::*;

declare_id!("EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q");

#[program]
pub mod stave {
    use super::*;

    /// Create a new IP work: Token-2022 share mint + IpWork PDA + initial supply.
    pub fn create_work(
        ctx: Context<CreateWork>,
        work_id: u64,
        metadata_uri: String,
        total_shares: u64,
    ) -> Result<()> {
        instructions::create_work::handler(ctx, work_id, metadata_uri, total_shares)
    }

    /// List a portion of the creator's shares for sale at a fixed price.
    /// Locks the listed shares into a Listing-PDA-authority vault.
    pub fn list_shares(
        ctx: Context<ListShares>,
        price_per_share: u64,
        shares_to_list: u64,
    ) -> Result<()> {
        instructions::list_shares::handler(ctx, price_per_share, shares_to_list)
    }
}
