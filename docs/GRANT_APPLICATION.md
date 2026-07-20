# Solana Foundation UK Grant Application

## Project

**Title:** AccessSol

**One-liner:** An open-source accessible transaction UI SDK for Solana dApps, covering review, wallet handoff, status announcements, warnings, and focus recovery.

**Requested amount:** 6,800 USDG

## Problem

Solana application teams can reuse wallet connection components, but the transaction experience after connection is usually bespoke. A screen-reader user may hear that a button says “Confirm” without hearing which permission changed. A keyboard user may lose focus when a signature modal closes. Confirmation changes may be communicated only by colour or a disappearing spinner. These failures are repeated across dApps because there is no focused, reusable transaction-accessibility layer.

The issue is not addressed by generating another wallet connector. AccessSol begins at the transaction-review boundary and remains active through wallet handoff, submission, confirmation, and failure.

## Current MVP

- Working React transaction-review component.
- Deterministic status announcement API.
- Polite progress and assertive failure live regions.
- Focus recovery on terminal transaction states.
- Structured warning alerts and explicit network/fee/wallet context.
- Keyboard-operable controls with 44px minimum targets.
- High-contrast, reduced-motion, failure, and multiple-transaction demos.
- Automated `axe-core`, action-name, focus, alert, and announcement tests.
- MIT licence and public implementation plan.

## Public-good value

AccessSol will remain framework-focused infrastructure, not a commercial wallet or token product. The component, adapters, research notes, test fixtures, conformance mapping, and integration examples will be public under MIT. A shared implementation reduces repeated accessibility work and makes inclusive defaults available to small teams that cannot commission a dedicated audit for every transaction flow.

## Competition and boundary

Wallet Adapter provides connection primitives and wallet selection UI. Transaction parsers and explorers explain executed transactions. General component systems provide accessible buttons and dialogs. AccessSol connects these layers with Solana-specific review semantics and lifecycle announcements. It will integrate with existing wallet libraries rather than fork or replace them.

## Milestones

### 1. Transaction review alpha

- Target: 4 weeks after approval.
- Deliverables: packaged React component, typed review model, four transaction patterns, wallet-adapter demo, CI accessibility checks, WCAG 2.2 mapping.
- KPI: 25 automated tests; four documented patterns; zero serious/critical automated violations in reference states.
- Budget: 1,900 USDG.

### 2. Assistive-technology validation beta

- Target: 9 weeks after approval.
- Deliverables: VoiceOver, NVDA, keyboard-only, zoom/reflow, reduced-motion, and high-contrast test matrix; moderated validation with five participants who use assistive technology; fixed beta release.
- KPI: five compensated sessions; all blocking findings triaged; at least 80% of critical task flows completed without facilitator intervention on the final round.
- Budget: 2,600 USDG.

### 3. Adoption release

- Target: 14 weeks after approval.
- Deliverables: two public dApp integration pilots, transaction adapter examples, independent accessibility review, contributor documentation, 1.0 release report.
- KPI: two independently verifiable integrations or merged pilot branches; public audit issues and resolutions; tagged 1.0 release.
- Budget: 2,300 USDG.

## Budget

| Use | Amount | Verification |
| --- | ---: | --- |
| SDK engineering and wallet-adapter integrations | 3,600 USDG | Public commits, releases, CI |
| Independent accessibility specialist review | 1,200 USDG | Review report and public issue log |
| Five assistive-technology participant stipends | 800 USDG | Consent-based session record and receipts |
| Documentation, examples, and conformance mapping | 700 USDG | Published docs and examples |
| Hosting, test devices, and assistive-technology setup | 200 USDG | Deployment and receipts |
| Delivery contingency | 300 USDG | Used only against documented milestone risk |

Total: **6,800 USDG**.

## Success measures

- A developer can integrate review and status UI without designing accessibility semantics from scratch.
- Reference flows meet automated checks and complete a documented manual assistive-technology matrix.
- Participants can identify origin, network, asset/permission change, fee, and final status.
- Two real Solana codebases validate the integration contract before 1.0.

## Risks and controls

| Risk | Control |
| --- | --- |
| Automated checks are mistaken for full conformance | Claims distinguish automated, manual, participant, and independent-review evidence. |
| Wallet extensions control part of the experience | Integration guidance defines the dApp/wallet boundary and restores focus after wallet handoff. |
| Transaction summaries omit dangerous detail | Adapters use allowlisted instruction patterns and fall back to explicit unknown-program warnings. |
| Recruitment delays | Partner outreach begins in milestone 1; remote and in-person sessions are both supported. |
| Adoption claims become unverifiable | Only public integrations, merged branches, or maintainer-confirmed pilots count toward the KPI. |
