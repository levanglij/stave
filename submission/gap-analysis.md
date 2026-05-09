# Submission gap analysis

_Audit cut at branch tip: `feature/landing-improvements-v1` (Bundle #1 baseline)._
_Audit date: 2026-05-06. Sprint completion: 2026-05-07._

---

## Sprint completion update *(2026-05-07)*

The full sprint executed Bundles **B → C → A → D** with `pnpm build`, `pytest`, and `anchor test` all green.

### Closed in this sprint

| Original gap | Closed by | Branch |
|---|---|---|
| 🔴 LICENSE file missing (top-5 #1) | B0 - `chore: add MIT LICENSE` | `sprint/phase-3-bundle-b` |
| 🟡 No QUICKSTART.md (top-5 #5a) | B1 - 5-min linear path | `sprint/phase-3-bundle-b` |
| 🟡 README has no Why-Solana table (E.4) | B2 - 4-row vs ETH L1 table | `sprint/phase-3-bundle-b` |
| 🟡 Code-quality claims unverifiable (C.5) | B3 - verifiable checklist (every `[x]` confirmed) | `sprint/phase-3-bundle-b` |
| 🟡 Pitch script predates current framing (A.2) | C1 - new `submission/pitch-script.md` | `sprint/phase-3-bundle-c` |
| 🟡 Tech demo script predates current framing (A.2) | C2 - new `submission/tech-demo-script.md` | `sprint/phase-3-bundle-c` |
| 🔴 No `submission/` asset index (top-5 #5b, F.2) | C3 - `submission/README.md` + README Quick links update | `sprint/phase-3-bundle-c` |
| 🟡 Hero CTA stack felt dense (H.1) | A4 - IPOA + methodology pills combined into one row | `sprint/phase-3-bundle-a` |
| 🟡 Stat strip felt spreadsheet-busy (H.2) | A1 - scannable grid (sparklines + footnotes dropped, numbers bumped) | `sprint/phase-3-bundle-a` |
| 🔴 No tier ladder visual on landing (H.3) | A2 - single-emerald + descending-opacity ladder under methodology | `sprint/phase-3-bundle-a` |
| 🔴 Real-vs-simulated callout missing on landing (H.4, D.2) | A3 - outlined card above featured listings | `sprint/phase-3-bundle-a` |
| 🟡 Indices "soon" chip misleading (I.4) | D4 - chip removed from nav (page is functional) | `sprint/phase-3-bundle-d` |
| 🟡 Partners mailto pointed at non-existent domain (I.3) | D3 - swapped to project email | `sprint/phase-3-bundle-d` |
| 🟡 How-it-works has no anchor TOC (I.2) | D2 - sticky desktop TOC + mobile horizontal-scroll + "Want the math?" callout + diagram TODOs | `sprint/phase-3-bundle-d` |
| 🟡 Marketplace filters were disabled placeholders (I.1) | D1 - functional tier multi-select + Genre + Sort + summary line + result count + empty-state | `sprint/phase-3-bundle-d` |

### Skipped intentionally

- **A5 (footer hackathon line)** - already covered by the long-form footer disclaimer paragraph from a prior task.
- **D5 (For Artists rebuild)** - page was already at-spec; verify-only, no commit.
- **CI / GitHub Actions (C.6)** - flagged "planned post-submission" in B3's checklist; deferred per audit.

### Still open - top remaining gaps (post-sprint)

Ranked by judge-impact-per-effort, highest first.

1. **Pitch deck PDF export** *(manual, ~5 minutes)*. README + SUBMISSION + `submission/README.md` all link to a `.pdf` that doesn't exist; only `.pptx` is in the repo. **Open `Stave-pitch-deck.pptx` in PowerPoint → File → Export → PDF → save as `submission/Stave-pitch-deck.pdf`.** This is not a code-agent task.
2. **Real-program-call swap-in on the frontend** *(deploy is done; now wire the UI)*. Anchor program is now live on Solana devnet at [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet). Remaining work: in `web/components/{tokenize-form.tsx, purchase-panel.tsx}` swap the `MEMO_PROGRAM_ID` instruction for `program.methods.{createWork, buyShares}().rpc()` against the IDL at `web/lib/idl/stave.ts`. Adds `@coral-xyz/anchor` as a dep + provider wiring + PDA derivation; estimated 1–2 hours and most useful after a bootstrap script seeds an on-chain listing.
3. **Team section in README + SUBMISSION** *(blocked on founder bios)*. Both files still say "To be filled before submission." Need names + roles + one-line credentials.
4. **Pitch + tech demo videos** *(recording day)*. Scripts shipped in Bundle C. Need: studio time, screen capture, edit, upload. Cross-link from README + `submission/README.md` once recorded.
5. ✅ ~~**Project email cleanup**~~ - closed. Footer Contact mailto + apply-API APPLY_INBOX default both swapped to `stave111115@gmail.com`.

### Verification status *(2026-05-07)*

| Suite | Result |
|---|---|
| `cd engine && pytest` | ✅ **31 / 31 passed** in 33.28s |
| `cd program && anchor test` | ✅ **15 / 15 passed** in 34s |
| `cd web && pnpm build` | ✅ **19 / 19 routes** prerendered, no errors |
| Mobile responsive review at 375 / 768 / 1280 | ✅ Code-review pass: how-it-works has separate desktop sticky + mobile horizontal-scroll TOC; marketplace filter bar uses `flex-wrap`; A3 callout collapses to single column at `sm:`; hero H1 scales `text-6xl sm:text-7xl md:text-7xl lg:text-8xl`. Live-browser QA still pending. |

---

## Original audit *(2026-05-06)*

> The section below is the audit baseline as of Phase 1.
> See "Sprint completion update" above for current status.

## Top 5 gaps to close before submission

Ranked by judge-impact-per-effort, highest first.

1. ✅ ~~**LICENSE file is missing**~~ - closed by B0.
2. **Pitch deck PDF doesn't exist.** README and SUBMISSION.md both link to a non-existent `submission/Stave-pitch-deck.pdf`. Only the `.pptx` is in the repo. Judges may not open `.pptx`; the PDF link 404s. **Manual export (PowerPoint → PDF). Out of code-agent scope - flag for human action.**
3. ✅ ~~**Anchor program not deployed to devnet.**~~ - closed. Program live at [`EcJDYr1y6...`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet) on devnet. Frontend swap from Memo TXs to real `program.methods` calls remains as a follow-up (see top remaining gap #2 above).
4. **Team section is an empty placeholder** in both README ("To be filled before submission") and SUBMISSION.md. Required for the deck and pitch video opener. **Needs founder names + bios from human; flagged for Phase 2 input.**
5. ✅ ~~**No `submission/` asset index + no `QUICKSTART.md`**~~ - closed by B + C.

---

## Full A–I checklist

### A. Pitch & narrative

| # | Item | Status | Note |
|---|------|--------|------|
| A.1 | One-line elevator pitch in README, ≤20 words, findable in 5s | ✅ | README L10: 33 words, but bolded and in the first viewport. Tight enough. |
| A.2 | 3-minute pitch video script | 🟡 | `docs/04-pitch-video-script.md` exists (57 lines). **Predates recent positioning shift** - still uses "RRE rating", "RRE-AAA through RRE-B" language we dropped, and lacks the marketplace-led framing. Needs adaptation per Bundle C1. |
| A.3 | Pitch deck PDF export | 🔴 | Only `Stave-pitch-deck.pptx` exists. Both README and SUBMISSION.md link to a `.pdf` that doesn't exist. Manual export needed - human action. |
| A.4 | Founder/team section with names + roles + credentials | 🔴 | README L130 + SUBMISSION L43 both say "To be filled before submission." Hard blocker for the deck. |
| A.5 | Problem framing with quantified market size | ✅ | "$30B/yr asset class, 9% CAGR, 10×–30× multiples with no standardization" - both README + SUBMISSION. Strong. |
| A.6 | Differentiation vs. nearest named competitor | 🟡 | "No Moody's, no Bloomberg, no MSCI" framing is good, but no direct comparison vs. ANote / Bolero / SongVest (the three closest live competitors). |

### B. Demo & live product

| # | Item | Status | Note |
|---|------|--------|------|
| B.1 | Working live URL | ✅ | https://stave.cc - Vercel auto-deploys on push to `main`. |
| B.2 | Wallet connection works fresh | ✅ | Phantom + Solflare via `@solana/wallet-adapter`, env-gated Privy fallback to mock. |
| B.3 | End-to-end flow without auth | ✅ | Marketplace browse + per-catalog detail + indices view all public. |
| B.4 | On-chain TX visible to judge (Solana Explorer link) | 🟡 | Tokenize + Buy fire **real devnet SPL Memo TXs** - visible on Explorer, but they're memos not program calls. Honestly disclosed in README. The real lift = devnet program deploy. |
| B.5 | No console errors in production build | ❓ | Not verifiable from here (no live browser). Flag for manual QA. |
| B.6 | Mobile renders 375 / 768 / 1280 | ❓ | Not verifiable from here. Recent Bundle #1 work used responsive Tailwind classes throughout but never live-tested. Flag for Phase 4. |

### C. Code quality & technical depth

| # | Item | Status | Note |
|---|------|--------|------|
| C.1 | README QUICKSTART works on fresh laptop ≤5 min | 🟡 | README has 3 separate run sections (engine / program / frontend), each ~5 lines of bash. No consolidated single-flow QUICKSTART.md. Adding it is Bundle B1. |
| C.2 | Tests pass with one command per layer | ✅ | `pytest` (engine, 31), `anchor test` (program, 15), `pnpm dev` for web (no test suite configured for web - flag). |
| C.3 | No secrets in repo | ✅ | `.env.example` at `web/`, `.env.local` gitignored, no committed secrets. |
| C.4 | LICENSE file present | 🔴 | **Missing.** "TBD before submission (likely MIT)" per README L152. **Top-5 gap.** |
| C.5 | Code-quality claims verifiable | 🟡 | TypeScript `strict: true` confirmed in `web/tsconfig.json`. No formal "no-`any`" lint rule, no Rust clippy gate, no Python ruff/mypy CI. Bundle B3 makes the verifiable subset visible. |
| C.6 | CI configured (basic lint + test on PR) | 🔴 | **No `.github/` directory at all.** No GitHub Actions, no PR checks. Outside this sprint's typical scope; flag for post-sprint. |

### D. Documentation

| # | Item | Status | Note |
|---|------|--------|------|
| D.1 | Architecture diagram | ✅ | Clean ASCII diagram in README L99–115. Full platform vision in `docs/02-architecture.md`. |
| D.2 | What's-real-vs-simulated section | 🟡 | Excellent 11-row table in README. **NOT exposed on landing page** - only in the repo. Bundle A3 puts a callout on the landing. |
| D.3 | Roadmap (post-hackathon) | ✅ | "What's next (90 days)" in SUBMISSION + "Regulatory roadmap" in README + `docs/08-engine-roadmap.md`. |
| D.4 | ADR / decision log | 🟡 | `program/README.md` has an "Architectural notes" section that functions as ADRs (Box wrappers for BPF stack, pull-based math, PDA seed pattern). Decent. No formal `docs/adr/` tree. |
| D.5 | Methodology document | ✅ | `engine/FORMULAS.md` exists (151 lines). Open-source, deterministic, public. |
| D.6 | Legal / compliance roadmap | ✅ | `docs/10-legal-roadmap.md` - VASP + brokerage license + AML/KYC, primary-source cited. Strong. |

### E. Solana-specific

| # | Item | Status | Note |
|---|------|--------|------|
| E.1 | Anchor deployed to devnet (program ID resolvable) | ✅ | Program live at `EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q` on devnet - verifiable on Solana Explorer. Closed during the post-audit follow-up. |
| E.2 | TX signature linkable on Solana Explorer | 🟡 | Tokenize + Buy emit real devnet SPL Memo TXs (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`). Real, on-chain, explorer-resolvable - but not the Stave program calls. Honestly disclosed. |
| E.3 | Token-2022 / SPL choice justified | ✅ | SUBMISSION L23: "Token-2022 gives us standard-fungible shares that compose with DEXs, lending, and fund vehicles on day one." |
| E.4 | "Why Solana" section in README | 🟡 | SUBMISSION.md has it (L21–24, prose form). README does not. Bundle B2 adds a comparison table. |
| E.5 | Wallet adapter (Phantom + ≥1 other) | ✅ | Phantom + Solflare via `@solana/wallet-adapter`. |

### F. Judge convenience

| # | Item | Status | Note |
|---|------|--------|------|
| F.1 | Single-page submission summary | 🟡 | `SUBMISSION.md` exists, ~55 lines. Decent depth. Currently a narrative; could lean more checklist. |
| F.2 | Index of submission assets | 🔴 | No `submission/README.md`. The `submission/` directory contains only `.pptx` + `.xlsx`. Bundle C3 fixes this. |
| F.3 | Time-to-first-success ≤2 min from README | 🟡 | `cat engine/outputs/evergreen-001.rating.json | python3 -m json.tool` is a 5-second success path, but README doesn't frame it that way. Bundle B1's QUICKSTART gives this prominence. |
| F.4 | Contact email findable in <10s | 🟡 | No "Contact" section in README. Email `lgvarishvili@gmail.com` exists in `web/components/footer.tsx` and the apply API fallback inbox, but isn't on the front page. Mailto on partners page goes to `partners@stave.cc` (a domain that doesn't exist yet). |

### G. Hackathon-honesty

| # | Item | Status | Note |
|---|------|--------|------|
| G.1 | Devnet status disclosed | ✅ | README "What's real" table + landing page disclaimer banner + "Devnet preview" footer line. |
| G.2 | Synthetic data disclosed | ✅ | Same table; landing-page footer; SUBMISSION mentions explicitly. |
| G.3 | Audit/mainnet status disclosed | ✅ | "Mainnet / audit - Not in scope. Devnet prototype; 'not production' stated explicitly." |
| G.4 | Disclaimer present and visible | ✅ | Top banner (Bundle #1) + long-form footer paragraph (committed in earlier sprint). |
| G.5 | Zero fabricated social proof | ✅ | Verified by grep - no fake testimonials, fake user counts, fake "trusted by" logos anywhere. |

### H. Landing-page polish (post-Bundle-#1)

| # | Item | Status | Note |
|---|------|--------|------|
| H.1 | Hero CTA stack feels tight (one dominant CTA) | 🟡 | Below H1: subhead → 2 CTAs row → IPOA card → Open-methodology badge → "Devnet preview" trust line. **5 stacked elements**. Reads dense at 375px. **Bundle A4 target.** |
| H.2 | Stat strip is scannable | 🟡 | 4-tile band with 6xl light numbers + per-tile sparklines + footnotes. Polished but visually busy - feels "spreadsheet header" rather than scan-and-go. **Bundle A1 target.** |
| H.3 | Tier ladder visual exists (or would help) | 🔴 | `/how-it-works` has the full tier ladder table (AAA → B with score ranges + max LTV), but the **landing-page methodology block does NOT**. Adding a compact ladder visual on landing closes a credibility gap for first-time visitors who never click through. **Bundle A2 target.** |
| H.4 | Real-vs-simulated callout on landing | 🔴 | Excellent table in README; **not surfaced on landing**. Bundle #1 didn't include this. **Bundle A3 target.** |
| H.5 | Footer hackathon framing | ✅ | Long-form disclaimer paragraph above © line, italic muted. Already shipped. **Bundle A5 may be redundant** - see "What I'd skip" below. |
| H.6 | Mobile renders cleanly | ❓ | Not live-verified. Bundle #1 used responsive classes throughout but no manual QA pass. Flag for Phase 4. |

### I. Other tabs (consistency with landing)

| # | Page | Status | Note |
|---|------|--------|------|
| I.1 | Marketplace | 🟡 | 8 catalogs, 3 filter chips at top - **all chips are `disabled` placeholders** (`title="Filtering ships in v2"`). Catalog cards render `Grade` chip but lack a hover-rating hint. No skeleton/loading state. **Bundle D1 target.** |
| I.2 | How It Works | 🟡 | 4 steps + 5 layers + tier ladder, all on one scroll. **No anchor TOC**, no inline diagrams. Reads as a wall of text on first load. **Bundle D2 target.** |
| I.3 | Partners | ✅ | Recently rewritten: IPOA hero card + Distribution thesis section. Clean, no fake partners, mailto CTA exists (`partners@stave.cc` - but domain not yet live). **Bundle D3 likely a NO-OP** - already structured. |
| I.4 | Indices | 🟡 | One example index (GHI) shown publicly, three drafts kept in data file but hidden from page. SoonChip in nav. Per the README claim "8 catalogs, 4 thematic indices" - **all 4 indices are implemented data-wise**, but only GHI is publicly rendered. **Bundle D4 should NOT remove the "soon" label** - the public surface only exposes one of four; "soon" label is honest. |
| I.5 | For Artists | ✅ | Hero + 3 benefit cards (Banknote / ShieldCheck / LineChart) + 3-step "How it works" + apply modal posting to `/api/tokenize-application`. Already structured per the D5 spec. **Bundle D5 likely a NO-OP** beyond minor verification. |

---

## Recommended Phase 2–5 order

Mapping the four candidate bundles to gaps found, ordered by "judge-impact-per-effort":

### Recommended sequence

**Bundle B → Bundle C → Bundle A → Bundle D**

Rationale: judges land on GitHub first (README), then on the live URL, then drill into other pages. Bundles B + C harden the README and the `submission/` directory - both are first-impression surfaces. Bundle A polishes the landing page (second-impression surface). Bundle D normalizes the rest of the routes (deep-dive surface).

### Bundle B - README & repo credibility *(execute first)*

Closes A.6, C.1, C.5, D.4 (partially), E.4.

| Item | Maps to gap | Notes |
|------|-------------|-------|
| **B0 (new)** Add `LICENSE` (MIT) at repo root | C.4 (top-5 gap #1) | 30-second add. Suggest including this even though it's not in the original 3-item B list. |
| B1 - `QUICKSTART.md` | C.1, F.3 | 5-min linear path + expected output snippets. Cross-link from README. |
| B2 - "Why Solana" comparison table | E.4 | 4-row vs Ethereum L1. Source numbers. README only - SUBMISSION already has prose. |
| B3 - "Code quality & safety" verifiable checklist | C.5, D.4 | Checkbox lists, on-chain / off-chain. Verify each claim before checking. |

### Bundle C - Pitch & demo assets *(execute second)*

Closes A.2, F.2.

| Item | Maps to gap | Notes |
|------|-------------|-------|
| C1 - `submission/pitch-script.md` (3:00) | A.2 | **Adapt** the existing `docs/04-pitch-video-script.md` (which uses outdated "RRE rating" / pre-marketplace framing) into a current-positioning script under `submission/`. Don't symlink - it needs rewriting. |
| C2 - `submission/tech-demo-script.md` (2:30) | A.2 | Same: `docs/05-tech-demo-script.md` predates current state (assumes deployed program). Adapt to "30s repo tour + 30s engine + 40s anchor + 30s frontend + 20s roadmap". |
| C3 - `submission/README.md` index + README "Quick links" update | F.2 | Index of pitch deck, both scripts, financial model, SUBMISSION.md, live demo URL. README quick-links: change "_to be recorded_" to point to script files, label "recording: pending". |

### Bundle A - Landing Bundle #2 *(execute third)*

Closes H.1, H.2, H.3, H.4. Recommended sub-order matches the spec (smallest blast radius first): A4 → A1 → A5 → A2 → A3.

| Item | Maps to gap | Notes |
|------|-------------|-------|
| A4 - Hero CTA tighten (one dominant CTA) | H.1 | The IPOA card + open-methodology badge already crowd the hero. Trim/restack. |
| A1 - Replace 4-stat strip with scannable stat grid | H.2 | Move from sparkline-busy to scan-and-go. |
| A5 - Hackathon acknowledgment line in footer | H.5 | **Likely redundant** - the long-form disclaimer paragraph already covers this. See "What I'd skip" below. |
| A2 - Tier ladder visual in methodology section | H.3 | Single accent color with varying opacity per spec, NOT traffic-light. Tier names verified bare letters: AAA / AA / A / BBB / BB / B (post-RRE-prefix-drop). |
| A3 - "What's real, what's simulated" callout near featured listings | H.4 | Use the established outlined-card pattern from Bundle #1. Exact copy provided in spec. |

### Bundle D - Non-landing page design pass *(execute last)*

Closes I.1, I.2. I.3, I.4, I.5 likely no-ops.

| Item | Maps to gap | Notes |
|------|-------------|-------|
| D5 - For Artists | I.5 | **Verify, may be no-op.** Hero + benefits + apply modal already present. |
| D4 - Indices | I.4 | **Keep "soon" label** - only 1 of 4 publicly rendered. Polish the coming-soon hero. Do NOT remove the label as the spec contemplates "if 4 indices already implemented." Per README, all 4 are coded but only 1 is exposed; the other 3 are drafts. |
| D3 - Partners | I.3 | **Likely no-op.** IPOA card structured, distribution thesis section exists, mailto CTA present. Consider replacing dead `partners@stave.cc` with `lgvarishvili@gmail.com` until domain stands up. |
| D2 - How It Works | I.2 | Anchor TOC + "Want the math?" callout to FORMULAS.md. Inline diagrams: spec allows TODO comments if SVG creation is out of scope - recommend that path. |
| D1 - Marketplace | I.1 | Sticky filter bar (real, not placeholder) + rating chip on cards (already on rows) + summary line + skeleton. **Largest D scope.** |

---

## What I would NOT do, and why

Items I recommend **dropping or deferring** for this submission sprint:

- **A5 (footer hackathon line).** A long-form disclaimer paragraph already lives in `web/components/footer.tsx` above the © line ("Stave is a hackathon prototype built for demonstration purposes. The platform, scores, and any displayed return profiles are illustrative only..."). Adding another acknowledgment line would be redundant. **Skip unless you specifically want a shorter inline framing.**
- **D5 (For Artists rebuild).** Already structured per the spec - hero + 3 benefit cards + 3-step list + apply modal. Re-implementing risks regression. **Verify in 5 minutes; skip the rebuild.**
- **D3 (Partners restructure).** Recently rewritten with IPOA + Distribution thesis + numbered partnership-covers list + mailto. **Verify; skip the rebuild.** Suggest one tiny patch instead: swap `mailto:partners@stave.cc` for `mailto:lgvarishvili@gmail.com` until the domain stands up.
- **CI configuration (gap C.6).** Adding GitHub Actions adds risk (workflow failures look bad, secrets management) for a hackathon prototype that has clean local test commands documented. **Defer to post-submission.**
- **`docs/04` and `docs/05` rewrite-in-place.** The existing scripts have value as historical artifacts. Bundle C1/C2 should write **new files in `submission/`** and leave the `docs/` originals alone.
- **Devnet program deploy (gap E.1).** Outside this sprint's code scope - needs wallet funding (~3 SOL) and a CLI run that this agent cannot do remotely. **Highest-impact gap _outside_ this sprint; flag for human action between Phase 4 and submission day.**
- **Pitch deck PDF export (gap A.3).** PowerPoint / Keynote action required. **Manual; flag for human action.**
- **Team section fill (gap A.4).** Requires founder bios. **Blocked on human input; flag for Phase 2 message.**
