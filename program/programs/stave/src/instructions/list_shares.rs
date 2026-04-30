use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
    },
};

use crate::constants::LISTING_SEED;
use crate::errors::StaveError;
use crate::state::{IpWork, Listing};

/// List a portion of the creator's shares for sale at a fixed price.
///
/// Transfers `shares_to_list` from the creator's share ATA into a
/// Listing-PDA-authority vault. Initializes the Listing PDA with the
/// price-per-share and the running available count. The Listing PDA
/// is the new authority over the vault, so the creator cannot pull
/// the listed shares back without going through `buy_shares`.
#[derive(Accounts)]
#[instruction(price_per_share: u64, shares_to_list: u64)]
pub struct ListShares<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    /// The IpWork being listed. Verifies `creator` matches the recorded
    /// creator and `share_mint` matches the recorded share mint.
    #[account(
        has_one = creator @ StaveError::NotWorkCreator,
        has_one = share_mint @ StaveError::ShareMintMismatch,
    )]
    pub ip_work: Account<'info, IpWork>,

    pub share_mint: InterfaceAccount<'info, Mint>,

    /// Creator's existing share ATA — debited by `shares_to_list`.
    #[account(
        mut,
        associated_token::mint = share_mint,
        associated_token::authority = creator,
        associated_token::token_program = token_program,
    )]
    pub creator_share_ata: InterfaceAccount<'info, TokenAccount>,

    /// New Listing PDA. One listing per work.
    #[account(
        init,
        payer = creator,
        space = 8 + Listing::INIT_SPACE,
        seeds = [LISTING_SEED, ip_work.key().as_ref()],
        bump,
    )]
    pub listing: Account<'info, Listing>,

    /// Vault token account holding the listed shares. Authority = listing PDA.
    #[account(
        init,
        payer = creator,
        associated_token::mint = share_mint,
        associated_token::authority = listing,
        associated_token::token_program = token_program,
    )]
    pub listing_vault: InterfaceAccount<'info, TokenAccount>,

    /// Mint of the token buyers will pay with (USDC devnet at launch).
    pub payment_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<ListShares>,
    price_per_share: u64,
    shares_to_list: u64,
) -> Result<()> {
    require!(price_per_share > 0, StaveError::InvalidPrice);
    require!(shares_to_list > 0, StaveError::InvalidShareCount);
    require!(
        ctx.accounts.creator_share_ata.amount >= shares_to_list,
        StaveError::InsufficientShares
    );

    // Move shares from the creator's ATA into the Listing PDA's vault.
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.creator_share_ata.to_account_info(),
            mint: ctx.accounts.share_mint.to_account_info(),
            to: ctx.accounts.listing_vault.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        },
    );
    transfer_checked(cpi_ctx, shares_to_list, ctx.accounts.share_mint.decimals)?;

    // Populate the Listing PDA state.
    let listing = &mut ctx.accounts.listing;
    listing.work = ctx.accounts.ip_work.key();
    listing.price_per_share = price_per_share;
    listing.shares_available = shares_to_list;
    listing.payment_mint = ctx.accounts.payment_mint.key();
    listing.vault = ctx.accounts.listing_vault.key();
    listing.bump = ctx.bumps.listing;

    Ok(())
}
