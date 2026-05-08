/**
 * One-shot bootstrap script — calls `create_work` + `list_shares` against
 * the deployed Stave program on Solana devnet for one real on-chain
 * listing (Suliko / catalog evergreen-001).
 *
 * Why: the program is deployed at EcJDYr1y6... but no work has been
 * created on-chain yet. This script seeds one real work + one real
 * listing so:
 *   - Judges can click an Explorer link and see real program TX traces
 *   - The frontend's purchase-panel.tsx can be wired to call
 *     program.methods.buyShares() against a listing that actually exists
 *
 * Run: cd program && pnpm tsx scripts/bootstrap-suliko.ts
 *
 * Cost: ~0.005-0.01 SOL on devnet (account rent for IpWork + share mint
 * + Listing + listing vault). Funded from the deploy keypair at
 * ~/.config/solana/id.json. Idempotent: a second run will fail because
 * the IpWork PDA + share mint will already exist.
 *
 * Output: program/bootstrap-output.json — addresses + TX signatures
 * for embedding in README + frontend client.
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

const SULIKO = {
  workId: new BN(1),
  totalShares: new BN(1_000),
  sharesToList: new BN(500),
  // 0.5 USDC per share (USDC has 6 decimals) — illustrative price for
  // the demo listing. Synthetic catalog prices in the UI are unrelated.
  pricePerShare: new BN(500_000),
  metadataUri: "https://stave.cc/issuances/evergreen-001",
};

// USDC devnet mint — well-known address used across the Solana
// ecosystem for testing.
const USDC_DEVNET = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);

async function main() {
  // Load the deploy keypair from ~/.config/solana/id.json (same keypair
  // that holds the program's upgrade authority).
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

  // Anchor 0.30+ reads the program ID from idl.address — no separate
  // PublicKey arg needed.
  const program = new Program<Stave>(idl as Stave, provider);

  console.log(`Program ID: ${program.programId.toBase58()}`);
  console.log(`Creator (deploy keypair): ${wallet.publicKey.toBase58()}`);

  // --- Derive IpWork PDA ---
  const [ipWorkPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("work"),
      wallet.publicKey.toBuffer(),
      SULIKO.workId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId,
  );

  // Fresh keypair for the share mint — created inside the instruction.
  const shareMint = Keypair.generate();

  const creatorShareAta = getAssociatedTokenAddressSync(
    shareMint.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );

  // ----------------------------------------------------------------
  // 1/2 — create_work
  // ----------------------------------------------------------------
  console.log("\n[1/2] Calling create_work...");
  const createTx = await program.methods
    .createWork(SULIKO.workId, SULIKO.metadataUri, SULIKO.totalShares)
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

  // --- Derive Listing PDA ---
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), ipWorkPda.toBuffer()],
    program.programId,
  );

  const listingVault = getAssociatedTokenAddressSync(
    shareMint.publicKey,
    listingPda,
    true, // allowOwnerOffCurve — listing is a PDA
    TOKEN_2022_PROGRAM_ID,
  );

  // ----------------------------------------------------------------
  // 2/2 — list_shares
  // ----------------------------------------------------------------
  console.log("\n[2/2] Calling list_shares...");
  const listTx = await program.methods
    .listShares(SULIKO.pricePerShare, SULIKO.sharesToList)
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
  // Output — written to bootstrap-output.json for embedding in docs
  // ----------------------------------------------------------------
  const result = {
    catalog: "evergreen-001 (Suliko)",
    creator: wallet.publicKey.toBase58(),
    workId: SULIKO.workId.toString(),
    totalShares: SULIKO.totalShares.toString(),
    sharesListed: SULIKO.sharesToList.toString(),
    pricePerShare_USDC_micros: SULIKO.pricePerShare.toString(),
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

  const outputPath = path.join(__dirname, "..", "bootstrap-output.json");
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n✅ Bootstrap complete. Output saved to ${outputPath}\n`);
  console.log(JSON.stringify(result.explorer, null, 2));
}

main().catch((err) => {
  console.error("\n❌ Bootstrap failed:");
  console.error(err);
  process.exit(1);
});
