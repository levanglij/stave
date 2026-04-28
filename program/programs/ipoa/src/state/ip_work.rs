use anchor_lang::prelude::*;

use crate::constants::MAX_METADATA_URI_LEN;

/// On-chain record of a fractionalized IP work.
///
/// PDA seeds: `[b"work", creator, work_id.to_le_bytes()]`
#[account]
#[derive(InitSpace)]
pub struct IpWork {
    /// The wallet that created this work. Also the initial share holder.
    pub creator: Pubkey,

    /// Monotonic per-creator id, supplied by the creator at creation time.
    /// Allows multiple works per creator without Keypair juggling.
    pub work_id: u64,

    /// Off-chain metadata URI (Irys / Arweave). Points to title, cover art,
    /// audio preview, artist info, ISRC, etc.
    #[max_len(MAX_METADATA_URI_LEN)]
    pub metadata_uri: String,

    /// Address of the Metaplex Core NFT representing this work.
    /// Zeroed on Day 1-2; populated by the NFT-mint instruction (follow-up).
    pub core_nft: Pubkey,

    /// Token-2022 fungible mint representing fractional royalty shares.
    pub share_mint: Pubkey,

    /// Total supply of shares minted at creation. Immutable.
    pub total_shares: u64,

    /// Unix timestamp (seconds) of creation, for display and audit.
    pub created_at: i64,

    /// PDA bump.
    pub bump: u8,
}
