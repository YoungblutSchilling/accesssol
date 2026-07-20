# Accessibility implementation notes

## Claim boundary

AccessSol is an accessibility-focused alpha with automated and code-level evidence. It does not currently claim WCAG 2.2 conformance. Automated tools cannot verify comprehension, announcement quality, speech order, zoom usability, or compatibility across assistive-technology combinations.

## Current implementation map

| WCAG 2.2 criterion | Current implementation | Evidence | Remaining validation |
| --- | --- | --- | --- |
| 1.3.1 Info and Relationships | Transaction metadata uses descriptions, warnings use alerts, and controls expose roles and names | Component source and axe-core render tests | Screen-reader reading order across supported combinations |
| 1.4.3 Contrast (Minimum) | Reference theme uses high-contrast text and status surfaces | Browser visual QA and reference CSS | Independent measurement and theme-consumer guidance |
| 1.4.11 Non-text Contrast | Controls, focus indicators, and state boundaries are visually distinct | Reference CSS | Windows forced-colours and consumer-theme validation |
| 2.1.1 Keyboard | All actions are native buttons/links; sample tabs support arrow keys | App interaction test | Full host-application journey |
| 2.4.3 Focus Order | Terminal states receive programmatic focus after confirmation or failure | Component focus test | Wallet-extension handoff combinations |
| 2.4.7 Focus Visible | Reference styles provide a 3px visible focus outline | Reference CSS | Consumer overrides and browser matrix |
| 2.5.8 Target Size (Minimum) | Primary review actions have a 44px minimum height | Reference CSS | Pointer QA at 200% and 400% zoom |
| 3.3.1 Error Identification | Failure state presents a text error and assertive announcement | Announcement and component tests | Moderated comprehension testing |
| 4.1.2 Name, Role, Value | Controls use native semantics and status containers expose labels | axe-core and role-based tests | Screen-reader/browser matrix |
| 4.1.3 Status Messages | Progress uses polite status announcements; failure is assertive | Deterministic announcement tests | VoiceOver, NVDA, and JAWS validation |

## Test layers

1. TypeScript catches public-contract and component integration errors.
2. Vitest and Testing Library verify roles, names, state behaviour, focus, and deterministic announcements.
3. axe-core scans rendered reference states, with colour contrast excluded in jsdom because that environment has no layout or canvas.
4. The GitHub Pages reference application supports browser checks for responsive layout, keyboard operation, reduced motion, high contrast, success, and failure.
5. Moderated assistive-technology testing and an independent review are funded milestones and have not yet been completed.

## Reporting issues

Open a public issue in the repository with the browser, operating system, assistive technology, transaction state, expected behaviour, and observed behaviour. Do not include wallet secrets, seed phrases, private keys, or sensitive transaction data.
