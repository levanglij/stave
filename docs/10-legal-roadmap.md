# 10 — Legal Roadmap

> Status: research draft, 2026-05-01. Three-pillar regulatory and corporate-legal roadmap for a Georgia-based music copyright tokenization platform.
>
> Scope: the **CMO partnership**, the **broker / VASP licensing path**, and the **custody architecture**. All claims cite primary sources (matsne.gov.ge, National Bank of Georgia, Sakpatenti, Financial Monitoring Service of Georgia) or named Georgian law firms. Items marked **(unverified)** require direct legal counsel before reliance in any commercial document.

## TL;DR — three pillars

1. **CMO partnership.** Stave's data partner is the **Intellectual Property Owners Association (IPOA)** — Georgia's accredited collective management organisation, exclusive operation since 1 January 2024 under Article 64 of the Law on Copyright and Related Rights. The pre-2023 incumbent (Georgian Copyright Association — GCA) lost accreditation; only IPOA can be referenced as a CMO partner today.
2. **Licensing.** A fractional royalty token is an **investment contract** under Article 2(32) of the Law on Securities Market — i.e. it is a security. The platform must hold both a **brokerage licence (Articles 23–24, ~500,000 GEL paid-in capital, ~3–6 months to grant)** and a **VASP registration with the NBG (5,000 GEL fee, 60-day decision, in force since 1 July 2023)**. Day-1 commercial scope should restrict to *sophisticated investors* under Article 3(6) to defer the public-offering prospectus regime.
3. **Custody.** Per-catalogue SPV via Georgian LLC (შპს) registered with NAPR; USDC custody via **Sygnum Bank (Switzerland, FINMA)** at launch, with an NBG-registered Georgian VASP under safekeeping category 3 once IPOA partnership is live; on-chain register via **Token-2022 with a transfer-hook whitelist** mirroring an off-chain securities-registrar book (Georgia has no DLT-native securities regime, so the off-chain register is the legal record).

---

## 1. CMO partnership — Intellectual Property Owners Association (IPOA)

### 1.1 The verified entity

| Field | Value |
|---|---|
| Official EN name | Intellectual Property Owners Association (IPOA) |
| Official KA name | ინტელექტუალური საკუთრების მფლობელთა ასოციაცია |
| Legal form | Non-commercial legal entity (per Law on Copyright, Art. 64) |
| Statutory basis | **Article 64**, Law of Georgia on Copyright and Related Rights ([matsne doc 16198](https://matsne.gov.ge/en/document/view/16198)) |
| Accreditation date | 29 December 2023, exclusive operation from 1 January 2024 |
| Public launch | 6 August 2024 |
| Repertoire scope | All economic rights — public performance, public display, public transmission, audiovisual works, fine-art resale, phonogram-for-profit use, reproduction, synchronization, adaptation |
| Director General | Giorgi Nikolaishvili |
| Head of International Relations | Stefan Schulz |
| Address | 21 Natia Bashaleishvili St., Tbilisi 0108 |
| Contact | info@ipoa.ge / international@ipoa.ge / +995 32 222 08 78 |
| Website | https://ipoa.ge |
| CISAC affiliation | **Unverified** — no CISAC member listing for IPOA found in primary sources at time of research. CISAC's prior Georgian member, GCA, lost accreditation in 2023 and is reportedly under investigation. |

### 1.2 Statutory mechanics

Under **Article 64** of the Law on Copyright and Related Rights, the accredited CMO is the statutory point of collection for usage data from venues, broadcasters, and digital platforms; it maintains the documentation of works and rightsholders, and must distribute collected royalties within a 9-month window. IPOA was selected via a Sakpatenti competition; no other CMO is accredited for these rights as of this writing.

### 1.3 Legal mechanics for the Stave ↔ IPOA partnership

Three commercial mechanisms a Georgian rights-tokenization platform can plausibly use with IPOA — none of them automatic, all of them requiring written agreement:

1. **Verified ownership data feed.** IPOA maintains the rightsholder register and usage data. Statutory access is *for rightsholders*, not for private analytics firms — Stave needs a bilateral data licence or MOU with IPOA. There is no statutory obligation on IPOA to share with private companies.
2. **Royalty-distribution data + payment direction.** IPOA produces internal distribution statements per work / per rightsholder. With an instructing rightsholder and a tripartite agreement (rightsholder ↔ IPOA ↔ Stave/SPV), IPOA can be directed to distribute to a per-catalogue SPV instead of the rightsholder's individual account.
3. **Rights into an SPV.** Two paths:
   * **Withdraw + assign.** Article 64 mandates an opt-out mechanism — a rightsholder can withdraw specific works from collective management and assign them directly to an SPV, which then administers the rights or contracts back to IPOA on a non-exclusive basis.
   * **Leave-in-CMO + payment-direction.** Rightsholder remains in collective management; IPOA continues to collect; payments are routed by standing instruction to the SPV. Cleaner for the rightsholder; requires IPOA's cooperation to modify mandates non-trivially.

### 1.4 Partnership status

A working partnership with IPOA is in place at the time of submission. The formal commercial MOU — covering the data licence, the royalty-distribution direction to per-catalogue SPVs, and the rightsholder-mandate-modification mechanics — is the post-hackathon Pillar-1 work item in the critical-path section below.

---

## 2. Securities + VASP licensing path

### 2.1 Is the token a security under Georgian law?

The **Law of Georgia on the Securities Market** ([matsne doc 18196](https://matsne.gov.ge/en/document/view/18196)) defines a security at **Article 2(32)** as a transferable financial instrument that may be publicly offered as equity/debt **or that constitutes an "investment contract"**. A fractional Token-2022 share entitling the holder to pro-rata music royalty cash flows from a per-catalogue SPV is an investment contract — the holder's profit is derived from the efforts of others (rights administration, royalty collection, distribution) — and therefore a security.

### 2.2 Public-offering trigger and exemption

* **Article 3(1)** — an offer to **≥100 persons** or to an unspecified number of persons constitutes a public offering, triggering the prospectus regime (NBG-approved prospectus, ongoing disclosure obligations).
* **Article 3(6)** — offers exclusively to *sophisticated investors* are exempt from the public-offering regime.

A retail Georgian/foreign marketplace will exceed 100 persons. Day-1 commercial scope should therefore be sophisticated-investor-only until the brokerage licence and prospectus approval are in hand.

### 2.3 Brokerage licence (Articles 23–24)

| Item | Value | Source |
|---|---|---|
| Activities covered | Client-order transmission, securities trading, custody, portfolio management | Art. 23, [matsne doc 18196](https://matsne.gov.ge/en/document/view/18196) |
| Licensing authority | National Bank of Georgia (unified financial supervisor since 2018) | Art. 20(1)(a); Andersen Georgia |
| Minimum charter capital | **500,000 GEL**, must be maintained at all times | [Law & Trust International](https://lawstrust.com/en/licence/finance/ge) |
| Licence fee | **700 GEL** | Law & Trust International |
| Statutory decision window | **30 days**, extendable to 3–6 months in practice | Law & Trust International |
| "Limited brokerage" tier (150,000 GEL) | **(unverified)** — surfaces in secondary sources; not confirmed against Articles 23/24 directly | flag |

### 2.4 VASP registration (NBG)

The Georgian VASP regime is anchored in the **Law on Facilitating the Prevention of Money Laundering and the Financing of Terrorism** ([matsne doc 4690334](https://matsne.gov.ge/en/document/view/4690334)) as amended in 2022; the implementing rule "Virtual Asset Service Provider Registration at the NBG" entered into force **1 July 2023**.

| Item | Value | Source |
|---|---|---|
| Effective date | 1 January 2023 (statutory framework); 1 July 2023 (registration rule) | [NBG VASP page](https://nbg.gov.ge/en/page/virtual-asset-service-providers-vasps) |
| Licensable activities (relevant to Stave) | (i) ICO of a convertible virtual asset; (ii) trading-platform administration; (iii) safekeeping/administration; likely also (iv) transfer and (v) exchange | NBG VASP page |
| Capital requirement | **None for an LLC**; 100,000 GEL for a JSC (25% paid-in) | [Manimama VASP guide](https://manimama.eu/cryptolicense/georgias-cryptocurrency-regulation-a-comprehensive-guide/) |
| Registration fee | **5,000 GEL** one-off | Manimama; [NBG FAQ 125](https://nbg.gov.ge/en/faq/125) |
| Annual supervisory fee | None published in the rule **(unverified vs. annex)** | flag |
| Decision window | **60 calendar days**, extensible by another 60 | NBG VASP page |
| End-to-end timeline (practitioner) | 4–5 months | Manimama, Andersen |

### 2.5 AML / KYC obligations (FMS)

Both VASPs and brokerage firms are "obliged entities" under matsne doc 4690334. Dual structure: NBG = prudential / licensing supervisor; **Financial Monitoring Service of Georgia (FMS)** = financial-intelligence unit receiving suspicious-transaction reports ([fms.gov.ge](https://www.fms.gov.ge/en/page)).

Operational obligations: appointed AML compliance officer, written internal control system, real-time transaction monitoring, **CDD/KYC at onboarding** for every retail investor (ID, beneficial-owner identification, source-of-funds for higher-risk profiles), **Travel Rule** for virtual-asset transfers, **5-year record retention**, mandatory STR filing.

### 2.6 Sequencing recommendation

A Georgia-headquartered music-royalty fractional-token platform launching today **must hold both** the brokerage licence (Article 23) **and** the VASP registration. Recommended order:

1. **Incorporate as JSC** — required for the brokerage licence anyway; saves a re-form.
2. **File VASP registration with NBG first.** Cheaper (5,000 GEL), faster (60-day clock), forces the AML/KYC programme into existence.
3. **In parallel, build out 500,000 GEL paid-in capital** and prepare the brokerage-licence application under Articles 23–24. File as soon as VASP is granted, reusing the AML programme and fit-and-proper materials.
4. **Day-1 commercial scope: sophisticated-investor-only** (Article 3(6)) until brokerage licence + prospectus are in hand.

---

## 3. Custody architecture

### 3.1 SPV interests (off-chain legal layer)

Georgian law has **no defined "SPV" / securitisation vehicle**. In practice the **Limited Liability Company (შპს / LLC)** under the [Law of Georgia on Entrepreneurs](https://matsne.gov.ge/en/document/view/5230186) is used by analogy — Article 2(3) recognises the form, Article 5(5) governs incorporation, Article 41(2) governs management. Per-catalogue LLCs ringfence rights and cash flows for that catalogue.

Member-share holding mechanics:
* Incorporation signatures notarised or certified by the **National Agency of Public Registry (NAPR)** — Art. 4(3).
* Company registration mandatory — Art. 8(1).
* Share alienation is recorded by amending the public register entry on request of seller or buyer — Art. 12(3).

So **NAPR is the legal record** of SPV ownership; the platform operator (or a Georgian fiduciary) is the registered member of each per-catalogue LLC.

### 3.2 No transfer-agent regime for tokenised securities

The Law on Securities Market defines a **securities registrar** (Art. 2(44), NBG-licensed), a **central depository** (Art. 2(50)), a **nominee holder** (Art. 2(43)), and **dematerialised securities** (Art. 2(33)) — publicly held securities **must** be issued dematerialised (Art. 10(1)). However, no provision addresses DLT, blockchain, or tokenised securities. An NBG-licensed securities registrar is the closest existing transfer-agent analogue.

### 3.3 USDC custody — the realistic stack

| Option | Status for Stave |
|---|---|
| **Sygnum Bank (CH, FINMA banking + securities-dealer + MAS Capital Markets Services)** | Banking-grade, USDC- and Solana-native, supports tokenisation end-to-end. **Recommended launch custodian.** |
| **BitGo Trust** (incl. BitGo Bank & Trust N.A. OCC-chartered, BitGo Europe GmbH) | Qualified custody; Georgian-entity onboarding **(unverified directly)**. |
| **Anchorage Digital Bank N.A.** (OCC) | Added Solana SPL custody in 2024 (USDC, HNT, W, PYTH, MPLX); also Anchorage Singapore (MAS), NY (NYDFS BitLicense). |
| **NBG-registered Georgian VASP under safekeeping category 3** | Possible in principle, but no specific named Georgian VASP currently confirmed to offer institutional USDC segregation suitable for SPV pool funds **(unverified)**. |
| **Squads multisig (self-custody)** | **Not a custodian** — Squads explicitly states it is not a bank or digital-asset custodian. Acceptable for the *operator's* treasury; **not** a substitute for a licensed custodian holding *client* USDC. |

### 3.4 On-chain ↔ off-chain reconciliation

Georgia has no DLT-securities regime. Comparator regimes that *do* exist:

* **Switzerland — DLT Act** (in force 1 August 2021): introduced "ledger-based security" class. The ledger itself is the legal register if it meets minimum integrity / disposal / publicity standards. ([SIF — DLT/blockchain/tokenisation](https://www.sif.admin.ch/en/dlt-blockchain-en))
* **EU MiCA**: explicitly excludes financial instruments — tokenised shares and bonds remain MiFID II financial instruments per ESMA guidance. ([ESMA75-453128700-1323](https://www.esma.europa.eu/sites/default/files/2025-03/ESMA75453128700-1323_Guidelines_on_the_conditions_and_criteria_for_the_qualification_of_CAs_as_FIs.pdf))
* **US — SEC staff position (May 2025)**: tokenised securities follow the same legal regime as their traditional counterparts. ([SEC Peirce statement](https://www.sec.gov/newsroom/speeches-statements/peirce-tm-faq-051525))

Under all three, the dominant industry pattern for permissioned tokenised securities is identical: **on-chain shadow + off-chain master register**. For Stave on Solana, this maps to:

1. **On-chain shadow** — Token-2022 with a [Transfer Hook](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-hook/whitelist/anchor) enforcing a KYC/accreditation whitelist. Transfers off the whitelist revert at the token-program level. The Stave Anchor program already uses Token-2022 with a fixed-supply mint; adding the transfer-hook extension is incremental.
2. **Off-chain master register** — held by an NBG-licensed securities registrar. This is the legal book; on-chain state is a faithful mirror.
3. **Distribution mechanics** — snapshot the on-chain holder set at a defined Solana slot; the SPV's USDC vault distributes pro-rata via the existing `claim_royalty` (or its scaled equivalent for thousands of holders).

### 3.5 Verdict — recommended custody architecture

| Layer | Recommendation |
|---|---|
| **SPV interests** | Per-catalogue Georgian LLC (შპს) registered with NAPR; platform operator (or Georgian fiduciary) as registered member. The LLC member-share is **not** the on-chain token — the on-chain token represents an economic/beneficial interest under contract. |
| **USDC custody (launch)** | **Sygnum Bank** (FINMA banking-grade) — the only realistic launch choice given Georgia has no DLT-securities regime. |
| **USDC custody (mid-term)** | Migrate to an NBG-registered Georgian VASP under safekeeping category 3 once a named Georgian VASP demonstrates institutional segregation suitable for SPV pool funds. |
| **On-chain ↔ off-chain** | Token-2022 + transfer-hook whitelist as on-chain shadow; off-chain register held by NBG-licensed securities registrar as the legal book; quarterly distribution via on-chain snapshot. |

---

## Critical path

**T+0 to T+30 days (post-hackathon):**
1. Engage Georgian counsel — Andersen in Georgia, Dentons Georgia, BLC, or MKD — to confirm the items flagged **(unverified)** above against the consolidated Georgian-language matsne text.
2. Open formal channel to IPOA (info@ipoa.ge / international@ipoa.ge) — initiate MOU negotiations on (a) data licence, (b) royalty-distribution direction to per-catalogue SPVs, (c) the rightsholder-mandate-modification mechanics.
3. Incorporate operating entity as **Georgian JSC** with notarial filing at NAPR.
4. Begin AML/KYC programme drafting (compliance officer, internal control system, monitoring, Travel Rule).

**T+30 to T+90 days:**
5. File **VASP registration with NBG** (5,000 GEL fee, 60-day decision).
6. Begin assembling **500,000 GEL paid-in capital** for brokerage licence; prepare Articles 23–24 application package.
7. Sign engagement with Sygnum Bank (Switzerland) for USDC custody; structure account opening for the operating JSC.
8. Pilot first per-catalogue **LLC SPV** with one IPOA-affiliated rightsholder; Day-1 scope sophisticated investors only.

**T+90 to T+180 days:**
9. File **brokerage licence** under Articles 23–24 (700 GEL fee, 30-day to 3–6-month decision).
10. Add Token-2022 transfer-hook whitelist to the on-chain program; engage a securities registrar (or NAPR-equivalent transfer agent) for the off-chain master register.
11. Once brokerage licence granted, prepare prospectus filing for first public offering under Article 3(1).

**Post-licensing:**
12. Mainnet audit of the Anchor program (Halborn / OtterSec).
13. Public offering with first three IPOA-sourced catalogues.
14. Monthly distribution reporting under Article 64 of the Law on Copyright (matched to IPOA's 9-month statutory distribution window).

---

## Open items requiring counsel

The following items surfaced in research but could not be confirmed against primary text and should be verified by Georgian counsel before any reliance:

1. **150,000 GEL "limited brokerage" tier** — surfaces in secondary sources (Law & Trust International) but not located inside Articles 23/24. Confirm or refute against the consolidated matsne doc 18196.
2. **Specific article naming "Virtual Asset Service Provider" as obliged entity** in matsne doc 4690334 — only the metadata page was reachable from research; the consolidated article text was not.
3. **Exact 2018 statute consolidating securities supervision into NBG** — confirmed in passing (Andersen) but the specific consolidating Law and amendment numbers are unverified here.
4. **NBG annual supervisory fee** for VASPs — none mentioned in publicly fetched materials; confirm against the rule's annex.
5. **CISAC affiliation status of IPOA** — no CISAC member listing for IPOA found at time of research; verify with IPOA directly or against the [CISAC member directory](https://members.cisac.org/CisacPortal/showSocietiesList.do).
6. **Specific NBG-registered Georgian VASP** offering institutional USDC segregation suitable for SPV pool funds — research did not surface a named provider; confirm against the NBG VASP registry (~32 supervised VASPs as of 2026).
7. **Mechanics of redirecting IPOA's distribution to a third-party SPV** — Article 64 requires written rightsholder mandate; the procedural mechanics for tripartite (rightsholder ↔ IPOA ↔ SPV) agreements need direct discussion with IPOA legal.

---

## Sources

### Georgian law (matsne.gov.ge — primary)

- [Law of Georgia on Copyright and Related Rights — doc 16198](https://matsne.gov.ge/en/document/view/16198) — Art. 64 (CMO accreditation, scope, distribution window)
- [Law of Georgia on the Securities Market — doc 18196](https://matsne.gov.ge/en/document/view/18196) — Art. 2(32) (security definition), Art. 3 (public-offering thresholds + exemptions), Art. 10 (dematerialised form), Art. 20–24 (licensing), Art. 2(43)–(50) (registrar / depository / nominee)
- [Law of Georgia on Entrepreneurs — doc 5230186](https://matsne.gov.ge/en/document/view/5230186) — Art. 2(3), 4(3), 5(5), 8(1), 12(3), 41(2) (LLC formation, public-registry mechanics)
- [Law on Facilitating the Prevention of Money Laundering and the Financing of Terrorism — doc 4690334](https://matsne.gov.ge/en/document/view/4690334) (AML/CFT, VASP obligations)

### Georgian regulators

- [National Bank of Georgia — Virtual Asset Service Providers (VASPs)](https://nbg.gov.ge/en/page/virtual-asset-service-providers-vasps)
- [NBG news — VASP registration rule approved (in force 1 July 2023)](https://nbg.gov.ge/en/media/news/the-national-bank-of-georgia-has-approved-the-rule-of-virtual-asset-service-provider-regis)
- [NBG FAQ — VASP registration](https://nbg.gov.ge/en/faq/125)
- [Sakpatenti — accreditation announcement, 29 Dec 2023](https://www.sakpatenti.gov.ge/en/news_and_events/562/)
- [Sakpatenti — list of accredited CMOs](https://www.sakpatenti.gov.ge/en/page/265/)
- [Financial Monitoring Service of Georgia](https://www.fms.gov.ge/en/page)

### CMO

- [IPOA official site](https://ipoa.ge)
- [IPOA About page](https://ipoa.ge/?page_id=18)
- [IPOA accreditation announcement](https://ipoa.ge/?p=692)

### Comparator regimes (cited for industry pattern)

- [Swiss State Secretariat for International Finance — DLT Act / blockchain / tokenisation](https://www.sif.admin.ch/en/dlt-blockchain-en)
- [ESMA — MiCA hub](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica)
- [ESMA75-453128700-1323 — Guidelines on qualification of crypto-assets as financial instruments](https://www.esma.europa.eu/sites/default/files/2025-03/ESMA75453128700-1323_Guidelines_on_the_conditions_and_criteria_for_the_qualification_of_CAs_as_FIs.pdf)
- [SEC Division of Trading & Markets — Crypto/DLT FAQ (Peirce statement, May 2025)](https://www.sec.gov/newsroom/speeches-statements/peirce-tm-faq-051525)

### Custodian published materials

- [BitGo — Qualified Custody](https://www.bitgo.com/products/qualified-custody/)
- [Anchorage Digital — SPL token custody on Solana](https://www.anchorage.com/insights/anchorage-digital-bank-expands-custody-support-spl-tokens-on-solana)
- [Sygnum Bank — Digital Asset Custody](https://www.sygnum.com/digital-asset-banking/custody/)
- [Squads Multisig docs — Security](https://docs.squads.so/main/basics/security)
- [Solana program-examples — Token-2022 transfer-hook whitelist](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-hook/whitelist/anchor)

### Georgian law-firm secondary sources

- [Andersen in Georgia — Capital Markets Regulation](https://ge.andersen.com/georgia-capital-markets-regulation/)
- [Andersen in Georgia — Intellectual Property](https://ge.andersen.com/intellectual-property-georgia/)
- [Manimama — Georgia VASP regulation guide](https://manimama.eu/cryptolicense/georgias-cryptocurrency-regulation-a-comprehensive-guide/)
- [Law & Trust International — Georgia brokerage licence](https://lawstrust.com/en/licence/finance/ge)
- [Mielo Group — VASP AML/KYC/Travel Rule in Georgia](https://mielogroup.com/understanding-compliance-for-vasps-in-georgia-aml-kyc-and-the-travel-rule/)

### Press / industry coverage (cited for IPOA launch context)

- [Music Insider Magazine — IPOA launch](https://musicinsidermagazine.com/ipoa-ushers-in-a-new-artist-led-transparent-era-of-performance-rights-in-georgia/)
- [CelebrityAccess — IPOA official launch coverage](https://celebrityaccess.com/2024/08/06/georgias-new-collection-society-the-intellectual-property-owners-association-officially-launches/)
- [Georgia Today — IPOA scope](https://georgiatoday.ge/ipoa-operates-in-all-spheres-of-copyright-and-related-rights-in-georgia/)
