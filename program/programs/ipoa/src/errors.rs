use anchor_lang::prelude::*;

#[error_code]
pub enum IpoaError {
    #[msg("Metadata URI exceeds 200 characters")]
    MetadataUriTooLong,

    #[msg("Total shares must be greater than zero")]
    InvalidTotalShares,

    #[msg("Math overflow")]
    MathOverflow,
}
