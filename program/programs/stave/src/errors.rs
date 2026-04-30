use anchor_lang::prelude::*;

#[error_code]
pub enum StaveError {
    #[msg("Metadata URI exceeds 200 characters")]
    MetadataUriTooLong,

    #[msg("Total shares must be greater than zero")]
    InvalidTotalShares,

    #[msg("Math overflow")]
    MathOverflow,

    #[msg("Price per share must be greater than zero")]
    InvalidPrice,

    #[msg("Number of shares to list must be greater than zero")]
    InvalidShareCount,

    #[msg("Creator does not have enough shares to list")]
    InsufficientShares,

    #[msg("Caller is not the creator of this IpWork")]
    NotWorkCreator,

    #[msg("Provided share mint does not match the IpWork's share mint")]
    ShareMintMismatch,

    #[msg("Listing does not have enough shares available for this purchase")]
    InsufficientListing,

    #[msg("Provided payment mint does not match the listing's payment mint")]
    PaymentMintMismatch,

    #[msg("Provided vault does not match the listing's vault")]
    VaultMismatch,

    #[msg("Amount must be greater than zero")]
    InvalidAmount,

    #[msg("Holder does not own any shares of this work")]
    NoSharesHeld,

    #[msg("No royalties available to claim at this time")]
    NothingToClaim,
}
