//! IPOA — on-chain IP fractionalization and royalty distribution.
//!
//! Day 1-2 scope (this file): `create_work` — mint the Token-2022 share mint
//! and initialize the IpWork PDA. Remaining instructions (`list_shares`,
//! `buy_shares`, `deposit_royalty`, `claim_royalty`) are scheduled per
//! `docs/01-mvp-spec.md` ordered build plan.

use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

pub use instructions::*;

declare_id!("IPoA1111111111111111111111111111111111111111");

#[program]
pub mod ipoa {
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
}
