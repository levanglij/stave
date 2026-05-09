/**
 * Second bootstrap script - calls `create_work` + `list_shares` against
 * the deployed Stave program for a *second* on-chain listing
 * (Nine Million Bicycles / catalog active-pop-001).
 *
 * Why two listings instead of one: showing two distinct works on-chain
 * proves the program isn't a one-trick demo. Different work_id, different
 * IpWork PDA, different share mint, different listing - judges can verify
 * the create_work flow generalizes.
 *
 * Run: cd program && pnpm tsx scripts/bootstrap-bicycles.ts
 *
 * Prereq: bootstrap-suliko.ts ran successfully (so the program is alive
 * and the deploy keypair is funded). This script burns ~0.005-0.01 SOL.
 *
 * Idempotent guard: a second run of this exact script will fail because
 * the IpWork PDA at work_id=2 will already exist. To re-run, bump
 * BICYCLES.workId to a fresh integer.
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  Connection,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Stave } from "../target/types/stave";
import idl from "../target/idl/stave.json";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const BICYCLES = {
  // workId=2 - the next sequential id after Suliko (workId=1). The
  // IpWork PDA is keyed by (creator, workId) so this gives us a
  // distinct PDA without collision.
  workId: new BN(2),
  totalShares: new BN(1_000),
  // Listing 700/1000 - slightly more aggressive than Suliko's 500/1000,
  // shows the program supports varied float ratios.
  sharesToList: new BN(700),
  // 0.75 USDC per share - a different price point than Suliko's 0.5 USDC,
  // proves price is per-listing not hardcoded.
  pricePerShare: new BN(750_000),
  metadataUri: "https://stave.cc/issuances/active-pop-001",
};

const USDC_DEVNET = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);

async function main() {
  const keypairPath = path.join(os.homedir(), ".config/solana/id.json");
  const keypairBytes = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
  const wallet = new anchor.Wallet(
    Keypair.fromSecretKey(Uint8Array.from(keypairBytes)),
  );

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const program = new Program<Stave>(idl as Stave, provider);

  console.log(`Program ID: ${program.programId.toBase58()}`);
  console.log(`Creator (deploy keypair): ${wallet.publicKey.toBase58()}`);
  console.log(`Catalog: active-pop-001 (Nine Million Bicycles)`);

  // --- Derive IpWork PDA at work_id=2 ---
  const [ipWorkPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("work"),
      wallet.publicKey.toBuffer(),
      BICYCLES.workId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId,
  );

  const shareMint = Keypair.generate();

  const creatorShareAta = getAssociatedTokenAddressSync(
    shareMint.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );

  // ----------------------------------------------------------------
  // 1/2 - create_work
  // ----------------------------------------------------------------
  console.log("\n[1/2] Calling create_work...");
  const createTx = await program.methods
    .createWork(BICYCLES.workId, BICYCLES.metadataUri, BICYCLES.totalShares)
    .accounts({
      creator: wallet.publicKey,
      ipWork: ipWorkPda,
      shareMint: shareMint.publicKey,
      creatorShareAta,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([shareMint])
    .rpc();

  console.log(`  ✓ TX: ${createTx}`);
  console.log(`  ✓ IpWork PDA: ${ipWorkPda.toBase58()}`);
  console.log(`  ✓ Share mint: ${shareMint.publicKey.toBase58()}`);
  console.log(`  ✓ Creator share ATA: ${creatorShareAta.toBase58()}`);

  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), ipWorkPda.toBuffer()],
    program.programId,
  );

  const listingVault = getAssociatedTokenAddressSync(
    shareMint.publicKey,
    listingPda,
    true,
    TOKEN_2022_PROGRAM_ID,
  );

  // ----------------------------------------------------------------
  // 2/2 - list_shares
  // ----------------------------------------------------------------
  console.log("\n[2/2] Calling list_shares...");
  const listTx = await program.methods
    .listShares(BICYCLES.pricePerShare, BICYCLES.sharesToList)
    .accounts({
      creator: wallet.publicKey,
      ipWork: ipWorkPda,
      shareMint: shareMint.publicKey,
      creatorShareAta,
      listing: listingPda,
      listingVault,
      paymentMint: USDC_DEVNET,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log(`  ✓ TX: ${listTx}`);
  console.log(`  ✓ Listing PDA: ${listingPda.toBase58()}`);
  console.log(`  ✓ Listing vault: ${listingVault.toBase58()}`);

  // ----------------------------------------------------------------
  // Output - written to bootstrap-bicycles.json (separate from Suliko's
  // file so we have a clean per-catalog manifest).
  // ----------------------------------------------------------------
  const result = {
    catalog: "active-pop-001 (Nine Million Bicycles)",
    creator: wallet.publicKey.toBase58(),
    workId: BICYCLES.workId.toString(),
    totalShares: BICYCLES.totalShares.toString(),
    sharesListed: BICYCLES.sharesToList.toString(),
    pricePerShare_USDC_micros: BICYCLES.pricePerShare.toString(),
    paymentMint: USDC_DEVNET.toBase58(),
    addresses: {
      ipWork: ipWorkPda.toBase58(),
      shareMint: shareMint.publicKey.toBase58(),
      creatorShareAta: creatorShareAta.toBase58(),
      listing: listingPda.toBase58(),
      listingVault: listingVault.toBase58(),
    },
    transactions: {
      createWork: createTx,
      listShares: listTx,
    },
    explorer: {
      ipWork: `https://explorer.solana.com/address/${ipWorkPda.toBase58()}?cluster=devnet`,
      shareMint: `https://explorer.solana.com/address/${shareMint.publicKey.toBase58()}?cluster=devnet`,
      listing: `https://explorer.solana.com/address/${listingPda.toBase58()}?cluster=devnet`,
      createWorkTx: `https://explorer.solana.com/tx/${createTx}?cluster=devnet`,
      listSharesTx: `https://explorer.solana.com/tx/${listTx}?cluster=devnet`,
    },
    bootstrappedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "..", "bootstrap-bicycles.json");
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n✅ Bootstrap complete. Output saved to ${outputPath}\n`);
  console.log(JSON.stringify(result.explorer, null, 2));
}

main().catch((err) => {
  console.error("\n❌ Bootstrap failed:");
  console.error(err);
  process.exit(1);
});
