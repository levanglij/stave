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

/// Buy `amount` fractional shares from a listing.
///
/// Two atomic transfers + one state update:
///   1. Buyer -> Creator: `amount * listing.price_per_share` of payment_mint.
///   2. Listing vault -> Buyer: `amount` shares (signed by Listing PDA).
///   3. listing.shares_available -= amount.
///
/// Either both transfers succeed and `shares_available` updates, or
/// the entire transaction reverts.
#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct BuyShares<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    /// The work's creator — payment recipient. Verified by IpWork's
    /// has_one constraint below.
    /// CHECK: only used to derive creator_payment_ata; address is
    /// validated by `has_one = creator` on ip_work.
    pub creator: SystemAccount<'info>,

    #[account(
        has_one = creator @ StaveError::NotWorkCreator,
        has_one = share_mint @ StaveError::ShareMintMismatch,
    )]
    pub ip_work: Box<Account<'info, IpWork>>,

    /// Listing PDA — verified via [b"listing", ip_work] seeds.
    /// has_one ensures the passed payment_mint and vault match.
    #[account(
        mut,
        seeds = [LISTING_SEED, ip_work.key().as_ref()],
        bump = listing.bump,
        has_one = payment_mint @ StaveError::PaymentMintMismatch,
        has_one = vault @ StaveError::VaultMismatch,
    )]
    pub listing: Box<Account<'info, Listing>>,

    pub share_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Listing vault holding shares for sale; authority = listing PDA.
    #[account(
        mut,
        associated_token::mint = share_mint,
        associated_token::authority = listing,
        associated_token::token_program = share_token_program,
    )]
    pub vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Buyer's share ATA. Created on first buy.
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = share_mint,
        associated_token::authority = buyer,
        associated_token::token_program = share_token_program,
    )]
    pub buyer_share_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub payment_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = payment_mint,
        associated_token::authority = buyer,
        associated_token::token_program = payment_token_program,
    )]
    pub buyer_payment_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Creator's payment ATA. Created on first buy if absent; buyer
    /// pays the rent (cost of business for taking the listing).
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = payment_mint,
        associated_token::authority = creator,
        associated_token::token_program = payment_token_program,
    )]
    pub creator_payment_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Share token program (Token-2022 for fractional shares).
    pub share_token_program: Interface<'info, TokenInterface>,
    /// Payment token program (classic SPL Token for devnet USDC).
    pub payment_token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BuyShares>, amount: u64) -> Result<()> {
    require!(amount > 0, StaveError::InvalidShareCount);
    require!(
        ctx.accounts.listing.shares_available >= amount,
        StaveError::InsufficientListing
    );

    let total_cost = amount
        .checked_mul(ctx.accounts.listing.price_per_share)
        .ok_or(StaveError::MathOverflow)?;

    // 1. Buyer pays creator.
    let pay_cpi = CpiContext::new(
        ctx.accounts.payment_token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.buyer_payment_ata.to_account_info(),
            mint: ctx.accounts.payment_mint.to_account_info(),
            to: ctx.accounts.creator_payment_ata.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        },
    );
    transfer_checked(
        pay_cpi,
        total_cost,
        ctx.accounts.payment_mint.decimals,
    )?;

    // 2. Vault -> buyer (signed by Listing PDA).
    let ip_work_key = ctx.accounts.ip_work.key();
    let listing_bump = ctx.accounts.listing.bump;
    let listing_seeds: &[&[u8]] = &[
        LISTING_SEED,
        ip_work_key.as_ref(),
        std::slice::from_ref(&listing_bump),
    ];
    let signer_seeds: &[&[&[u8]]] = &[listing_seeds];

    let share_cpi = CpiContext::new_with_signer(
        ctx.accounts.share_token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.vault.to_account_info(),
            mint: ctx.accounts.share_mint.to_account_info(),
            to: ctx.accounts.buyer_share_ata.to_account_info(),
            authority: ctx.accounts.listing.to_account_info(),
        },
        signer_seeds,
    );
    transfer_checked(share_cpi, amount, ctx.accounts.share_mint.decimals)?;

    // 3. Decrement available count.
    let listing = &mut ctx.accounts.listing;
    listing.shares_available = listing
        .shares_available
        .checked_sub(amount)
        .ok_or(StaveError::MathOverflow)?;

    Ok(())
}
