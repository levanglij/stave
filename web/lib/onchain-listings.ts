/**
 * Registry of catalogs that have been bootstrapped on Solana devnet.
 *
 * Source of truth: program/bootstrap-output.json (Suliko) +
 * program/bootstrap-bicycles.json (after the bicycles script runs).
 * Re-typed by hand here so the frontend doesn't import JSON from
 * outside the `web/` package boundary.
 *
 * Catalogs listed here are eligible for read-only on-chain status
 * (live vault balance, live share supply, click-through to Explorer).
 * Catalogs NOT in this map render their detail pages without the
 * "Live on devnet" strip — the rest of the UI stays the same.
 */

export interface OnchainListing {
  /** Catalog id used by the engine + UI (e.g. "evergreen-001"). */
  catalogId: string;
  /** Human-friendly title — short, used in click-through copy. */
  title: string;
  /** Bootstrap creator (the program upgrade-authority keypair). */
  creator: string;
  /** Anchor IpWork PDA — keyed by (creator, work_id). */
  ipWork: string;
  /** Token-2022 share mint created inside `create_work`. */
  shareMint: string;
  /** Listing PDA — holds the listing config + acts as vault authority. */
  listing: string;
  /** Token-2022 ATA owned by the listing PDA — holds shares for sale. */
  listingVault: string;
  /** Total share supply (== Token-2022 mint supply). 0 decimals. */
  totalShares: number;
  /** Shares listed at bootstrap (initial vault balance). */
  sharesListed: number;
  /** Price in payment-mint micros — USDC has 6 decimals. */
  pricePerShareMicros: number;
  /** Devnet USDC mint — same across all listings. */
  paymentMint: string;
  /** TX signature for create_work (audit trail). */
  createWorkTx: string;
  /** TX signature for list_shares (audit trail). */
  listSharesTx: string;
  /** ISO timestamp of bootstrap. */
  bootstrappedAt: string;
}

const USDC_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const CREATOR = "5YRgcw4XS3ieM2x3TRqwv7D4omDT72wWW7F8g9zb7Loc";

/**
 * Live on-chain catalogs. Add a new entry here every time the
 * `bootstrap-<catalog>.ts` script lands a fresh listing on devnet.
 */
const BY_CATALOG: Record<string, OnchainListing> = {
  "evergreen-001": {
    catalogId: "evergreen-001",
    title: "Suliko",
    creator: CREATOR,
    ipWork: "32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6",
    shareMint: "DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at",
    listing: "EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa",
    listingVault: "S9krDv4VNJt6CiTtEXz6u5b5eTGd79p8YUW31LwdkP8",
    totalShares: 1_000,
    sharesListed: 500,
    pricePerShareMicros: 500_000, // 0.5 USDC
    paymentMint: USDC_DEVNET,
    createWorkTx:
      "24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo",
    listSharesTx:
      "5mGeuaHoUSi35ArqoeEiFb7xqZVQci6yKppUuL9X3yKyVsdrduEesFKYN3efuex38UnHM9PG6ohUaJVjHDf4sK8b",
    bootstrappedAt: "2026-05-07T08:23:39.032Z",
  },
  // active-pop-001 (Nine Million Bicycles) lands here once
  // bootstrap-bicycles.ts has run successfully on devnet.
  // Until then, the registry is intentionally incomplete and the
  // frontend renders the catalog detail page without the on-chain
  // strip — which is the right behavior, since there's nothing on
  // devnet to read yet.
};

/** Look up a catalog by id; returns undefined if not on-chain yet. */
export function getOnchainListing(
  catalogId: string,
): OnchainListing | undefined {
  return BY_CATALOG[catalogId];
}

/** All on-chain listings, e.g. for nav menus or registry pages. */
export function getAllOnchainListings(): OnchainListing[] {
  return Object.values(BY_CATALOG);
}

/** Build a Solana Explorer link for an address on devnet. */
export function explorerAddress(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}

/** Build a Solana Explorer link for a transaction signature. */
export function explorerTx(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

/** Format payment-mint micros into a human USDC string ("0.5 USDC"). */
export function formatUsdcMicros(micros: number): string {
  // USDC has 6 decimals.
  const usd = micros / 1_000_000;
  return `${usd.toFixed(usd >= 1 ? 2 : 2)} USDC`;
}
