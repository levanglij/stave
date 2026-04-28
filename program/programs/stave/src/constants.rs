//! Seed byte strings for all PDAs. Keep these in sync with `docs/01-mvp-spec.md`.

/// Seed for the IpWork PDA: `[b"work", creator, work_id_le]`
pub const IP_WORK_SEED: &[u8] = b"work";

/// Seed for the Listing PDA (reserved for Day 3-4): `[b"listing", work]`
pub const LISTING_SEED: &[u8] = b"listing";

/// Seed for the RoyaltyVault PDA (reserved for Day 5-6): `[b"royalty", work]`
pub const ROYALTY_SEED: &[u8] = b"royalty";

/// Seed for the ClaimRecord PDA (reserved for Day 5-6): `[b"claim", work, holder]`
pub const CLAIM_SEED: &[u8] = b"claim";

/// Maximum length of the metadata URI string stored on-chain.
pub const MAX_METADATA_URI_LEN: usize = 200;
