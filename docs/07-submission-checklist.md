# 07 - Submission Checklist

Final pass before submitting to **Solana Frontier Hackathon 2026** (deadline **May 11, 2026**). Every box checked = safe to ship.

## Format constraints (Colosseum / Frontier)

- **Single open category.** No track-specific requirements.
- **Pitch video ≤ 3 minutes.** Most important artifact - judges watch first.
- **Technical demo video 2–3 minutes.** Separate from pitch video.
- **GitHub repo must be judge-accessible.** Public, or with judge accounts invited.
- **Live deployed MVP** that a judge can click through in a browser.

## Code

- [x] `program/` builds cleanly with `anchor build`
- [x] `anchor test` passes all tests, no warnings - **15/15 across 4 suites**
- [ ] Program deployed to devnet, program ID recorded in:
  - [ ] `web/.env.example` (`NEXT_PUBLIC_PROGRAM_ID`)
  - [ ] `docs/02-architecture.md`
  - [ ] `README.md`
- [x] Frontend builds cleanly with `pnpm build`
- [x] Frontend deployed to Vercel, URL recorded in `README.md` - **https://stave.cc**
- [x] `engine/` tests pass (`pytest` green) - 31 tests
- [x] `engine/outputs/*.rating.json` regenerated against current data - 8 catalogs
- [x] Frontend reads at least one RRE rating from `engine/outputs/` and displays it on the work detail page - full RRE breakdown on every detail page
- [ ] No unused deps, no commented-out code blocks
- [ ] Secrets are out of the repo - verify with `git log -p | grep -i -E 'secret|keypair|private'`

## Demo content

- [x] 3+ demo works visible on the live frontend - **8 catalogs**; on-chain copies materialize on devnet deploy
- [x] Each has: cover art, audio preview, sensible title + artist name, RRE rating badge - gradient cover, waveform-styled music player, Georgian title + artist, tier-colored badge
- [ ] At least one work has a non-zero royalty deposit and at least one successful claim recorded - pending devnet deploy
- [x] Demo works span a range of RRE ratings (at least one AA or AAA, at least one BBB or below) - RRE-AA (Suliko, Khasanbegura), RRE-A (Iavnana), RRE-BBB (Tbiliso, Bedi, Nine Million Bicycles), RRE-BB (Chito Gvrito), RRE-B (Argasvene)

## Videos

- [ ] Pitch video ≤ 3:00 rendered as `submission/pitch-video.mp4`
- [ ] Tech demo video ≤ 3:00 (target 2:30) rendered as `submission/tech-demo.mp4`
- [ ] Both videos: H.264, 1080p 60fps, captions burned in
- [ ] Uploaded to YouTube (unlisted) as backup; links in `submission/README.md`
- [ ] Pitch video opens with team + problem within first 15 seconds
- [ ] Tech demo shows live Solana transactions AND the RRE engine producing a rating

## Deck

- [ ] Pitch deck finalized per `docs/03-pitch-deck-outline.md` (12 slides)
- [ ] Exported as `submission/pitch-deck.pdf`
- [ ] All external citations sourced (no "stats" without a link)
- [ ] Team slide with names, roles, credentials
- [ ] "What's built" slide shows concrete checkmarks + program ID + GitHub + live URL

## README and docs

- [x] `README.md` has: elevator pitch, demo link, setup instructions, architecture link - program ID added on deploy
- [x] `docs/02-architecture.md` accurate vs. shipped code - IPOA partnership documented; on-chain claim reads as forward-looking (matches reality)
- [x] `docs/08-engine-roadmap.md` reflects actual RRE build state
- [x] Known limitations documented (transfer-before-claim forfeiture, demo-grade engine) - see README "Known MVP behaviors" + program/README "Architectural notes"
- [ ] Team section in `README.md` filled in

## GitHub hygiene

- [x] Repo is public - github.com/levanglij/stave
- [x] `.gitignore` excludes `target/`, `node_modules/`, `.env.local`, keypairs, `.DS_Store`, `__pycache__/`, `.pytest_cache/`, `.claude/`, `CLAUDE.md` (kept local-only)
- [ ] License chosen and added
- [x] `CLAUDE.md` up to date - local-only by design (gitignored)
- [ ] Main branch reflects the submitted build; tag it: `v0.1.0-submission`
- [ ] `README.md` links are all live (no `[URL]` or `TODO` placeholders) - pitch / tech demo video URLs still pending recording

## Judge access dry-run (CRITICAL)

- [ ] Open GitHub repo in an **incognito window** - can you see the code without login?
- [ ] Open live app URL in an **incognito window** - does it load without error?
- [ ] Open Solana Explorer link for the program ID in an **incognito window** - does it resolve?
- [ ] Any Google Docs / Figma / Notion linked from the deck are set to "anyone with the link can view"

## Traction evidence

- [ ] Stave Twitter/X account with public build-in-public posts (Colosseum weights this heavily)
- [ ] Telegram or Discord channel with any initial user conversations screenshot-able
- [ ] Waitlist signups or artist DMs captured as proof of interest
- [ ] At least one tweet linked to the live app + pitch video after submission

## Submission form

- [ ] Title, one-line description, category filled in
- [ ] Live app URL (Vercel)
- [ ] Program ID (Solana devnet)
- [ ] GitHub URL
- [ ] Pitch video URL (direct file + YouTube fallback)
- [ ] Tech demo URL (direct file + YouTube fallback)
- [ ] Deck PDF attached or linked
- [ ] Team info, including LinkedIn / prior credentials

## Dry run (48h before deadline)

- [ ] Full flow executed on deployed devnet build from a **clean browser profile**
- [ ] Phantom connects cleanly, autopicks devnet
- [ ] Create → list → buy → deposit → claim works without any console errors
- [ ] RRE rating displays correctly on each work detail page
- [ ] Explorer links on each page resolve correctly
- [ ] Both videos play in a browser from the submitted URLs
