use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
    },
};

use crate::constants::ROYALTY_SEED;
use crate::errors::StaveError;
use crate::state::{IpWork, RoyaltyVault};

/// Deposit `amount` of `payment_mint` into a work's royalty vault.
///
/// Anyone can call: artist, label, distributor, fan. The vault is
/// initialized lazily on the first deposit and becomes the holding
/// account for that work's royalties forever after.
///
/// Once tokens are in the vault, holders draw against them pro-rata
/// via `claim_royalty`.
#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct DepositRoyalty<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    /// The work receiving the royalty. Read-only.
    pub ip_work: Box<Account<'info, IpWork>>,

    /// Royalty vault PDA. Initialized on first deposit.
    #[account(
        init_if_needed,
        payer = depositor,
        space = 8 + RoyaltyVault::INIT_SPACE,
        seeds = [ROYALTY_SEED, ip_work.key().as_ref()],
        bump,
    )]
    pub royalty_vault: Box<Account<'info, RoyaltyVault>>,

    pub payment_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Token account holding the deposited royalties. Authority is
    /// the royalty_vault PDA. Created on first deposit.
    #[account(
        init_if_needed,
        payer = depositor,
        associated_token::mint = payment_mint,
        associated_token::authority = royalty_vault,
        associated_token::token_program = token_program,
    )]
    pub royalty_token_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Depositor's payment ATA - debited.
    #[account(
        mut,
        associated_token::mint = payment_mint,
        associated_token::authority = depositor,
        associated_token::token_program = token_program,
    )]
    pub depositor_payment_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<DepositRoyalty>, amount: u64) -> Result<()> {
    require!(amount > 0, StaveError::InvalidAmount);

    let vault = &mut ctx.accounts.royalty_vault;

    // Lazy init on first deposit. After init, payment_mint is locked
    // (subsequent deposits must use the same mint, enforced by the
    // associated_token::mint = payment_mint constraint above).
    if vault.payment_mint == Pubkey::default() {
        vault.work = ctx.accounts.ip_work.key();
        vault.payment_mint = ctx.accounts.payment_mint.key();
        vault.bump = ctx.bumps.royalty_vault;
    } else {
        require_keys_eq!(
            vault.payment_mint,
            ctx.accounts.payment_mint.key(),
            StaveError::PaymentMintMismatch
        );
    }

    // Transfer payment_mint from depositor into the royalty token vault.
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.depositor_payment_ata.to_account_info(),
            mint: ctx.accounts.payment_mint.to_account_info(),
            to: ctx.accounts.royalty_token_vault.to_account_info(),
            authority: ctx.accounts.depositor.to_account_info(),
        },
    );
    transfer_checked(cpi_ctx, amount, ctx.accounts.payment_mint.decimals)?;

    vault.total_deposited = vault
        .total_deposited
        .checked_add(amount)
        .ok_or(StaveError::MathOverflow)?;

    Ok(())
}
