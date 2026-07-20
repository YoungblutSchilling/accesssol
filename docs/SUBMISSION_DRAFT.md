# Superteam Submission Draft

Target listing: `Solana Foundation UK Grants`

This document maps the current Superteam form fields to truthful, submission-ready answers. Values marked `VERIFY IN FORM` must be checked under the authenticated `feng` account.

## Basics

**Project Title**

AccessSol

**One-Liner Description**

An open-source accessible transaction UI SDK for Solana dApps, from review and wallet handoff through confirmation or failure.

**Grant amount**

5,500 USDG

**Your Telegram username**

QA52800

**Your Solana Wallet Address**

Use the embedded wallet owned by `feng` and verify the complete address in the form preview. Do not use a wallet already associated with another Superteam account.

## Details

**Project Details**

Solana teams can reuse wallet connection components, but the transaction experience after connection is usually bespoke. Screen-reader users may hear “Confirm” without hearing which permission or asset changes. Keyboard users can lose focus when a wallet prompt closes. Submission and confirmation can be represented only by colour or a spinner. These failures recur because there is no focused, reusable Solana transaction-accessibility layer.

AccessSol is an MIT-licensed React SDK for this boundary. The current MVP provides a typed transaction-review model, semantic review details, explicit network/fee/wallet context, risk alerts, 44px actions, polite progress announcements, assertive failure announcements, and focus recovery when a transaction confirms or fails. The demo includes credential, persistent-permission, and contributor-stipend patterns plus high-contrast, reduced-motion, and failure controls.

This grant will fund the work automation cannot replace: a wallet-adapter reference integration, allowlisted transaction summary adapters, WCAG 2.2 conformance notes, VoiceOver/NVDA/keyboard/zoom testing, five compensated assistive-technology participant sessions, an independent accessibility review, and two public Solana integration pilots. AccessSol complements Wallet Adapter rather than replacing connection or wallet security prompts.

**Deadline**

30 October 2026. Reconfirm this remains a realistic 14-week delivery date when the application is submitted.

**Proof of Work**

- Repository: https://github.com/YoungblutSchilling/accesssol
- Live workbench: https://youngblutschilling.github.io/accesssol/
- Installable package output: ESM, CommonJS, declarations, and standalone stylesheet verified with `npm pack --dry-run`.
- Current evidence: 9 automated tests covering axe baseline, named actions, warnings, announcements, terminal focus, and keyboard tab behaviour; successful TypeScript and production builds; zero known npm audit vulnerabilities.
- Local commit prepared before publication: `2ff0806`.

Only describe the GitHub and live links as public after both return HTTP 200 and GitHub Actions is green.

**Personal X Profile**

Waqas722297. Complete ownership verification if Superteam requests it.

**Personal Github Profile**

YoungblutSchilling

**Custom question: Your Telegram username**

QA52800

## Milestones

### Milestone 1 — Transaction review alpha (1,500 USDG, four weeks)

Publish the packaged component, four transaction patterns, wallet-adapter demo, at least 25 automated tests, and WCAG 2.2 mapping. Success means all reference states have zero serious or critical automated violations, with colour contrast verified in a real browser rather than claimed from jsdom.

### Milestone 2 — Assistive-technology beta (2,100 USDG, nine weeks)

Complete a VoiceOver, NVDA, keyboard, 200% zoom/reflow, reduced-motion, and high-contrast matrix. Run five compensated sessions with assistive-technology users, triage all blocking findings, and achieve at least 80% unassisted completion of critical flows in the final validation round.

### Milestone 3 — Adoption release (1,900 USDG, fourteen weeks)

Complete two public dApp pilot integrations or merged pilot branches, an independent accessibility review with public issue resolutions, transaction adapter examples, contributor documentation, and a tagged 1.0 release.

## Primary KPI

By the 1.0 milestone: two independently verifiable Solana integrations; five compensated assistive-technology validation sessions; at least 80% unassisted completion of critical transaction-review flows in the final participant round; and all blocking audit findings resolved or transparently documented.

## Final Checks

- Confirm `feng` is genuinely eligible as a UK resident and can complete KYC after approval.
- Verify the 5,500 USDG ask, full wallet address, Telegram, X, and GitHub profile.
- Verify repository, Pages deployment, Actions checks, and npm package contents.
- Ensure milestones and KPI remain future commitments, while current tests are labelled as current evidence.
- Read and confirm the funding acknowledgement only if still true: `To receive grant funding, you may need to send proofs of milestone completion and of outcomes that reflect your application and this grant listing.`
- Read and confirm the feedback acknowledgement only if still true: `I understand that sponsors will not be able to send individual feedback to applicants. I have factored this in before applying to avoid disappointment.`
- Stop before final submission and request account-holder confirmation.
