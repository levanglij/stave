use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{mint_to, Mint, MintTo, TokenAccount, TokenInterface},
};

use crate::constants::{IP_WORK_SEED, MAX_METADATA_URI_LEN};
use crate::errors::StaveError;
use crate::state::IpWork;

/// Create a new IP work:
/// - Initializes the `IpWork` PDA
/// - Creates a Token-2022 share mint with the PDA as mint authority
/// - Mints the full `total_shares` supply to the creator's ATA
///
/// The Metaplex Core NFT mint is intentionally deferred to a follow-up
/// instruction; `core_nft` is left as `Pubkey::default()` on creation.
#[derive(Accounts)]
#[instruction(work_id: u64, metadata_uri: String, total_shares: u64)]
pub struct CreateWork<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + IpWork::INIT_SPACE,
        seeds = [IP_WORK_SEED, creator.key().as_ref(), &work_id.to_le_bytes()],
        bump,
    )]
    pub ip_work: Account<'info, IpWork>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 0,
        mint::authority = ip_work,
        mint::freeze_authority = ip_work,
        mint::token_program = token_program,
    )]
    pub share_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = share_mint,
        associated_token::authority = creator,
        associated_token::token_program = token_program,
    )]
    pub creator_share_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateWork>,
    work_id: u64,
    metadata_uri: String,
    total_shares: u64,
) -> Result<()> {
    require!(
        metadata_uri.len() <= MAX_METADATA_URI_LEN,
        StaveError::MetadataUriTooLong
    );
    require!(total_shares > 0, StaveError::InvalidTotalShares);

    let bump = ctx.bumps.ip_work;
    let creator_key = ctx.accounts.creator.key();
    let work_id_bytes = work_id.to_le_bytes();

    // Populate the IpWork PDA state.
    let ip_work = &mut ctx.accounts.ip_work;
    ip_work.creator = creator_key;
    ip_work.work_id = work_id;
    ip_work.metadata_uri = metadata_uri;
    ip_work.core_nft = Pubkey::default();
    ip_work.share_mint = ctx.accounts.share_mint.key();
    ip_work.total_shares = total_shares;
    ip_work.created_at = Clock::get()?.unix_timestamp;
    ip_work.bump = bump;

    // Mint the full supply to the creator's ATA, signed by the IpWork PDA.
    let seeds: &[&[u8]] = &[
        IP_WORK_SEED,
        creator_key.as_ref(),
        &work_id_bytes,
        std::slice::from_ref(&bump),
    ];
    let signer_seeds: &[&[&[u8]]] = &[seeds];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.share_mint.to_account_info(),
            to: ctx.accounts.creator_share_ata.to_account_info(),
            authority: ctx.accounts.ip_work.to_account_info(),
        },
        signer_seeds,
    );
    mint_to(cpi_ctx, total_shares)?;

    Ok(())
}
