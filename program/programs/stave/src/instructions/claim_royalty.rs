use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
    },
};

use crate::constants::{CLAIM_SEED, ROYALTY_SEED};
use crate::errors::StaveError;
use crate::state::{ClaimRecord, IpWork, RoyaltyVault};

/// Pull-based pro-rata claim of accumulated royalties.
///
/// Math (per docs/01-mvp-spec.md):
///
///   new_deposits = vault.total_deposited - claim_record.last_claim_total_deposited
///   claimable    = holder_share_balance × new_deposits ÷ total_shares
///
/// `holder_share_balance` is read at claim time, so a holder who
/// transferred shares between deposit and claim only earns on what
/// they currently hold (the rest is forfeited — accepted MVP
/// behavior; a snapshot/checkpoint per-deposit pattern lands later).
#[derive(Accounts)]
pub struct ClaimRoyalty<'info> {
    #[account(mut)]
    pub holder: Signer<'info>,

    pub ip_work: Box<Account<'info, IpWork>>,

    /// Used to validate `holder_share_ata`'s mint.
    pub share_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Holder's share ATA. Balance at claim time determines the share.
    #[account(
        associated_token::mint = share_mint,
        associated_token::authority = holder,
        associated_token::token_program = share_token_program,
    )]
    pub holder_share_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [ROYALTY_SEED, ip_work.key().as_ref()],
        bump = royalty_vault.bump,
        has_one = payment_mint @ StaveError::PaymentMintMismatch,
    )]
    pub royalty_vault: Box<Account<'info, RoyaltyVault>>,

    pub payment_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Token vault holding the deposited royalties. Authority = vault PDA.
    #[account(
        mut,
        associated_token::mint = payment_mint,
        associated_token::authority = royalty_vault,
        associated_token::token_program = payment_token_program,
    )]
    pub royalty_token_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Holder's payment ATA — credited. Created on first claim.
    #[account(
        init_if_needed,
        payer = holder,
        associated_token::mint = payment_mint,
        associated_token::authority = holder,
        associated_token::token_program = payment_token_program,
    )]
    pub holder_payment_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Per-holder claim ledger. Init on first claim.
    #[account(
        init_if_needed,
        payer = holder,
        space = 8 + ClaimRecord::INIT_SPACE,
        seeds = [CLAIM_SEED, ip_work.key().as_ref(), holder.key().as_ref()],
        bump,
    )]
    pub claim_record: Box<Account<'info, ClaimRecord>>,

    pub share_token_program: Interface<'info, TokenInterface>,
    pub payment_token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClaimRoyalty>) -> Result<()> {
    let holder_balance = ctx.accounts.holder_share_ata.amount;
    require!(holder_balance > 0, StaveError::NoSharesHeld);

    let total_shares = ctx.accounts.ip_work.total_shares;
    require!(total_shares > 0, StaveError::InvalidTotalShares);

    let total_deposited = ctx.accounts.royalty_vault.total_deposited;

    // Lazy-init the claim record on first call.
    let claim_record = &mut ctx.accounts.claim_record;
    if claim_record.holder == Pubkey::default() {
        claim_record.holder = ctx.accounts.holder.key();
        claim_record.work = ctx.accounts.ip_work.key();
        claim_record.bump = ctx.bumps.claim_record;
        // claimed_amount and last_claim_total_deposited start at 0,
        // so first claim picks up everything deposited so far.
    }

    let new_deposits = total_deposited
        .checked_sub(claim_record.last_claim_total_deposited)
        .ok_or(StaveError::MathOverflow)?;

    // claimable = holder_balance * new_deposits / total_shares
    // Done in u128 to avoid overflow on the intermediate product.
    let claimable_u128 = (holder_balance as u128)
        .checked_mul(new_deposits as u128)
        .ok_or(StaveError::MathOverflow)?
        .checked_div(total_shares as u128)
        .ok_or(StaveError::MathOverflow)?;
    let claimable: u64 = claimable_u128
        .try_into()
        .map_err(|_| StaveError::MathOverflow)?;

    require!(claimable > 0, StaveError::NothingToClaim);

    // Royalty vault PDA signs the transfer to the holder.
    let ip_work_key = ctx.accounts.ip_work.key();
    let vault_bump = ctx.accounts.royalty_vault.bump;
    let vault_seeds: &[&[u8]] = &[
        ROYALTY_SEED,
        ip_work_key.as_ref(),
        std::slice::from_ref(&vault_bump),
    ];
    let signer_seeds: &[&[&[u8]]] = &[vault_seeds];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.payment_token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.royalty_token_vault.to_account_info(),
            mint: ctx.accounts.payment_mint.to_account_info(),
            to: ctx.accounts.holder_payment_ata.to_account_info(),
            authority: ctx.accounts.royalty_vault.to_account_info(),
        },
        signer_seeds,
    );
    transfer_checked(cpi_ctx, claimable, ctx.accounts.payment_mint.decimals)?;

    // Update ledgers.
    claim_record.last_claim_total_deposited = total_deposited;
    claim_record.claimed_amount = claim_record
        .claimed_amount
        .checked_add(claimable)
        .ok_or(StaveError::MathOverflow)?;

    let vault = &mut ctx.accounts.royalty_vault;
    vault.total_claimed = vault
        .total_claimed
        .checked_add(claimable)
        .ok_or(StaveError::MathOverflow)?;

    Ok(())
}
