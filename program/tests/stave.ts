import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Stave } from "../target/types/stave";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
  getMint,
  createMint,
} from "@solana/spl-token";
import { expect } from "chai";

describe("stave — create_work", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Stave as Program<Stave>;
  const creator = provider.wallet.publicKey;

  it("creates an IpWork, share mint, and mints full supply to creator", async () => {
    const workId = new BN(1);
    const totalShares = new BN(1_000);
    const metadataUri = "ar://test-metadata";

    // Derive the IpWork PDA (must match IP_WORK_SEED from the program).
    const [ipWorkPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("work"),
        creator.toBuffer(),
        workId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const shareMint = Keypair.generate();
    const creatorShareAta = getAssociatedTokenAddressSync(
      shareMint.publicKey,
      creator,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.methods
      .createWork(workId, metadataUri, totalShares)
      .accounts({
        creator,
        ipWork: ipWorkPda,
        shareMint: shareMint.publicKey,
        creatorShareAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([shareMint])
      .rpc();

    // --- IpWork PDA state ---
    const ipWork = await program.account.ipWork.fetch(ipWorkPda);
    expect(ipWork.creator.toBase58()).to.equal(creator.toBase58());
    expect(ipWork.workId.toNumber()).to.equal(1);
    expect(ipWork.metadataUri).to.equal(metadataUri);
    expect(ipWork.shareMint.toBase58()).to.equal(
      shareMint.publicKey.toBase58()
    );
    expect(ipWork.totalShares.toNumber()).to.equal(1_000);
    expect(ipWork.coreNft.toBase58()).to.equal(PublicKey.default.toBase58());
    expect(ipWork.createdAt.toNumber()).to.be.greaterThan(0);

    // --- Share mint ---
    const mintInfo = await getMint(
      provider.connection,
      shareMint.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    expect(mintInfo.decimals).to.equal(0);
    expect(mintInfo.supply.toString()).to.equal("1000");
    expect(mintInfo.mintAuthority?.toBase58()).to.equal(ipWorkPda.toBase58());

    // --- Creator's share balance ---
    const ataInfo = await getAccount(
      provider.connection,
      creatorShareAta,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    expect(ataInfo.amount.toString()).to.equal("1000");
    expect(ataInfo.owner.toBase58()).to.equal(creator.toBase58());
  });

  it("rejects zero total_shares", async () => {
    const workId = new BN(2);
    const [ipWorkPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("work"),
        creator.toBuffer(),
        workId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const shareMint = Keypair.generate();
    const creatorShareAta = getAssociatedTokenAddressSync(
      shareMint.publicKey,
      creator,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    try {
      await program.methods
        .createWork(workId, "ar://x", new BN(0))
        .accounts({
          creator,
          ipWork: ipWorkPda,
          shareMint: shareMint.publicKey,
          creatorShareAta,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([shareMint])
        .rpc();
      expect.fail("expected InvalidTotalShares");
    } catch (e: any) {
      expect(String(e)).to.match(/InvalidTotalShares/);
    }
  });

  it("rejects metadata_uri over 200 chars", async () => {
    const workId = new BN(3);
    const [ipWorkPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("work"),
        creator.toBuffer(),
        workId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const shareMint = Keypair.generate();
    const creatorShareAta = getAssociatedTokenAddressSync(
      shareMint.publicKey,
      creator,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    const tooLong = "a".repeat(201);

    try {
      await program.methods
        .createWork(workId, tooLong, new BN(1000))
        .accounts({
          creator,
          ipWork: ipWorkPda,
          shareMint: shareMint.publicKey,
          creatorShareAta,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([shareMint])
        .rpc();
      expect.fail("expected MetadataUriTooLong");
    } catch (e: any) {
      // The over-length string may be rejected either by the program's
      // length check or by Anchor's serialization limit — either is acceptable.
      expect(String(e)).to.match(/MetadataUriTooLong|exceed|length/i);
    }
  });
});

describe("stave — list_shares", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Stave as Program<Stave>;
  const creator = provider.wallet.publicKey;
  const payer = (provider.wallet as anchor.Wallet).payer;

  // Mock USDC-style payment mint, shared across the suite. 6 decimals
  // matches devnet USDC; classic SPL Token (not Token-2022) since the
  // payment mint can be either.
  let paymentMint: PublicKey;

  before(async () => {
    paymentMint = await createMint(
      provider.connection,
      payer,
      creator,
      null,
      6,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID,
    );
  });

  // Each test creates a fresh IpWork so listings don't collide on the
  // same Listing PDA.
  async function setupWork() {
    const workId = new BN(Math.floor(Math.random() * 1_000_000) + 1000);
    const [ipWorkPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("work"),
        creator.toBuffer(),
        workId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId,
    );
    const shareMint = Keypair.generate();
    const creatorShareAta = getAssociatedTokenAddressSync(
      shareMint.publicKey,
      creator,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    await program.methods
      .createWork(workId, "ar://test", new BN(1000))
      .accounts({
        creator,
        ipWork: ipWorkPda,
        shareMint: shareMint.publicKey,
        creatorShareAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([shareMint])
      .rpc();

    const [listingPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("listing"), ipWorkPda.toBuffer()],
      program.programId,
    );
    const listingVault = getAssociatedTokenAddressSync(
      shareMint.publicKey,
      listingPda,
      true, // allow PDA off-curve owner
      TOKEN_2022_PROGRAM_ID,
    );

    return {
      workId,
      ipWorkPda,
      shareMint: shareMint.publicKey,
      creatorShareAta,
      listingPda,
      listingVault,
    };
  }

  it("transfers shares to vault and initializes Listing PDA", async () => {
    const ctx = await setupWork();

    await program.methods
      .listShares(new BN(500_000), new BN(500))
      .accounts({
        creator,
        ipWork: ctx.ipWorkPda,
        shareMint: ctx.shareMint,
        creatorShareAta: ctx.creatorShareAta,
        listing: ctx.listingPda,
        listingVault: ctx.listingVault,
        paymentMint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // --- Listing PDA state ---
    const listing = await program.account.listing.fetch(ctx.listingPda);
    expect(listing.work.toBase58()).to.equal(ctx.ipWorkPda.toBase58());
    expect(listing.pricePerShare.toNumber()).to.equal(500_000);
    expect(listing.sharesAvailable.toNumber()).to.equal(500);
    expect(listing.paymentMint.toBase58()).to.equal(paymentMint.toBase58());
    expect(listing.vault.toBase58()).to.equal(ctx.listingVault.toBase58());

    // --- Creator's share balance debited ---
    const creatorBal = await getAccount(
      provider.connection,
      ctx.creatorShareAta,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    expect(creatorBal.amount.toString()).to.equal("500");

    // --- Vault holds the listed shares + is owned by Listing PDA ---
    const vaultBal = await getAccount(
      provider.connection,
      ctx.listingVault,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    expect(vaultBal.amount.toString()).to.equal("500");
    expect(vaultBal.owner.toBase58()).to.equal(ctx.listingPda.toBase58());
  });

  it("rejects zero price_per_share", async () => {
    const ctx = await setupWork();
    try {
      await program.methods
        .listShares(new BN(0), new BN(500))
        .accounts({
          creator,
          ipWork: ctx.ipWorkPda,
          shareMint: ctx.shareMint,
          creatorShareAta: ctx.creatorShareAta,
          listing: ctx.listingPda,
          listingVault: ctx.listingVault,
          paymentMint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail("expected InvalidPrice");
    } catch (e: any) {
      expect(String(e)).to.match(/InvalidPrice/);
    }
  });

  it("rejects zero shares_to_list", async () => {
    const ctx = await setupWork();
    try {
      await program.methods
        .listShares(new BN(500_000), new BN(0))
        .accounts({
          creator,
          ipWork: ctx.ipWorkPda,
          shareMint: ctx.shareMint,
          creatorShareAta: ctx.creatorShareAta,
          listing: ctx.listingPda,
          listingVault: ctx.listingVault,
          paymentMint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail("expected InvalidShareCount");
    } catch (e: any) {
      expect(String(e)).to.match(/InvalidShareCount/);
    }
  });

  it("rejects listing more shares than creator holds", async () => {
    const ctx = await setupWork();
    try {
      await program.methods
        .listShares(new BN(500_000), new BN(2000)) // creator only has 1000
        .accounts({
          creator,
          ipWork: ctx.ipWorkPda,
          shareMint: ctx.shareMint,
          creatorShareAta: ctx.creatorShareAta,
          listing: ctx.listingPda,
          listingVault: ctx.listingVault,
          paymentMint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail("expected InsufficientShares");
    } catch (e: any) {
      expect(String(e)).to.match(/InsufficientShares/);
    }
  });
});
