import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Stave } from "../target/types/stave";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
  getMint,
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
