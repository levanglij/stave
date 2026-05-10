# 10 - Legal Roadmap

> What Stave understands about the Georgian regulatory landscape today,
> and the honest order of work to take a hackathon prototype toward
> something licensed and operational. Treat this as a desk-research
> map, not legal advice. Direct counsel will refine every item below
> before any commercial filing.
>
> Status: research draft. Last updated 2026-05-11.

## The three pillars

A music royalty tokenisation platform built in Georgia and selling to
investors needs three things to work:

1. **A data partner.** Verified ownership and royalty data from a
   recognised collecting society. For Stave that is IPOA.
2. **Licensing.** Because a fractional royalty token is a security
   under Georgian law, the marketplace eventually needs the right
   regulatory permissions to offer it.
3. **Custody architecture.** A defensible answer to "where do
   investors' funds and tokens actually live" once we move beyond
   devnet and self-custody.

Each pillar is sketched below. The intention is to show the surface
area we understand, not to commit to a timeline or a budget.

---

## 1. CMO partnership · IPOA

The **Intellectual Property Owners Association (IPOA)** is Georgia's
accredited collective management organisation under Article 64 of the
Law on Copyright and Related Rights. Accreditation went into effect
1 January 2024. Public launch was August 2024. Repertoire scope covers
the full bundle of economic rights in music (public performance,
broadcast, mechanical reproduction, synchronization, neighbouring
rights, etc.).

Stave has a working partnership with IPOA at the time of submission.
The partnership covers the use of verified ownership and royalty data
in the rating engine.

### What still needs to be formalised

A bilateral commercial agreement with IPOA, post-hackathon, will need
to cover:

- Data licence for the ownership and royalty records the engine
  consumes
- Mechanism for directing IPOA's royalty distributions to
  per-catalogue settlement accounts (so on-chain holders can claim
  pro-rata)
- Mechanics for rightsholders who choose to participate, including the
  Article 64 opt-out / standing-instruction options that already exist
  in the law

None of these are off-the-shelf. They will be negotiated in writing
with IPOA and Georgian counsel.

---

## 2. Licensing path

### Is the token a security?

Almost certainly yes under Georgian law. The Law of Georgia on the
Securities Market defines a security broadly enough that an investment
contract entitling a holder to pro-rata royalty cash flow falls
inside the definition. Stave does not plan to argue otherwise.

That puts the marketplace in scope for two regulatory regimes:

1. **Securities supervision.** The National Bank of Georgia oversees
   securities licensing under the Law on the Securities Market. A
   brokerage-style permission is the most natural fit for the
   marketplace activity. There is also a public-offering exemption
   for sophisticated investors under Article 3(6) that we can use to
   stay sub-threshold while licensing is in progress.
2. **VASP registration.** The NBG also runs the VASP regime under
   the AML framework, in force since mid-2023. Marketplace operation
   that touches virtual assets will need this in addition to
   securities licensing.

### Day-1 commercial scope

We expect to launch in a sophisticated-investor-only mode under the
Article 3(6) exemption. Retail access waits until we have brokerage
licensing and a regulator-approved disclosure regime in hand.

### What we are NOT doing

- We are not seeking our own brokerage licence as the primary
  distribution path. Stave plans to integrate with existing licensed
  Georgian brokerages so investors access tokenised royalties through
  platforms they already use. This is a smaller regulatory surface
  and a faster route to real users.
- We are not promising specific timelines or capital commitments in
  this document. Capital, timelines, and licence sequencing depend on
  funding, regulator pace, and partnership scope. All of those are
  open variables.

---

## 3. Custody architecture

### The off-chain piece

Georgia has no purpose-built securitisation vehicle, so per-catalogue
ringfencing will use the Georgian Limited Liability Company (შპს /
LLC) under the Law on Entrepreneurs. The LLC member-share is the
legal claim; the on-chain token represents an economic interest under
contract. The National Agency of Public Registry is the legal book
for the LLC ownership, not the chain.

### The on-chain piece

The dominant industry pattern across Switzerland, the EU, and the US
for permissioned tokenised securities is the same: an on-chain shadow
register backed by an off-chain master register held by a licensed
securities registrar. For Stave on Solana the natural mapping is
Token-2022 with a transfer-hook whitelist enforcing the KYC /
accreditation gate at the token-program level.

### Where USDC lives

For investor funds, an institutional custodian is the realistic
launch answer. Several candidates exist (FINMA-banked Swiss
custodians, OCC-chartered US options, future NBG-registered Georgian
VASPs). The specific choice is a procurement question that depends on
whichever provider can most cleanly support a Solana-native
multi-jurisdiction setup. We are not committed to any specific
custodian today.

---

## What happens post-hackathon

In rough priority order, not on a fixed clock:

1. Engage Georgian counsel to refine every claim in this document
   against the consolidated Georgian-language statutory text.
2. Formalise the IPOA partnership in writing: data licence,
   royalty-direction mechanics, rightsholder onboarding flow.
3. Stand up a Georgian operating entity in a form compatible with
   future licensing.
4. Begin AML / KYC programme design alongside the VASP and
   securities-licensing work.
5. Open conversations with licensed Georgian brokerages about
   integration as the first distribution channel.
6. Pilot the first per-catalogue LLC structure with a single IPOA
   rightsholder, in a sophisticated-investor-only configuration.

Everything beyond this list is conditional on the prior steps going
well, on funding, and on regulatory pace we do not control.

---

## Honest framing

This document is a research map, written by the founder, with primary
sources cross-checked. Several of the more specific claims (capital
requirements, fee schedules, decision windows) come from published
secondary sources and have not yet been confirmed against the
consolidated statutory text by Georgian counsel. Anything material
will be verified before reliance in a commercial document.

We would rather show the regulatory surface honestly and admit what
is still unconfirmed than publish a polished "we have a plan" doc
that overcommits on a hackathon timescale.

---

## Sources (primary)

- [Law of Georgia on Copyright and Related Rights (matsne 16198)](https://matsne.gov.ge/en/document/view/16198): Art. 64 covers CMO accreditation, scope, and the 9-month distribution window
- [Law of Georgia on the Securities Market (matsne 18196)](https://matsne.gov.ge/en/document/view/18196): security definition, public-offering thresholds and exemptions, dematerialised form, licensing
- [Law of Georgia on Entrepreneurs (matsne 5230186)](https://matsne.gov.ge/en/document/view/5230186): LLC formation and public-registry mechanics
- [Law on Facilitating the Prevention of Money Laundering and the Financing of Terrorism (matsne 4690334)](https://matsne.gov.ge/en/document/view/4690334): AML/CFT obligations, including for VASPs
- [National Bank of Georgia · VASP page](https://nbg.gov.ge/en/page/virtual-asset-service-providers-vasps)
- [Sakpatenti · accredited CMOs list](https://www.sakpatenti.gov.ge/en/page/265/)
- [IPOA official site](https://ipoa.ge)
