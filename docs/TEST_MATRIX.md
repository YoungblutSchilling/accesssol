# AccessSol test matrix

This matrix separates tests that run today from planned manual validation. A checked automated row is not a claim that an entire WCAG criterion is satisfied.

## Automated suite

| Area | Assertion | Status |
| --- | --- | --- |
| Render semantics | axe-core finds no detectable violations in the review reference state, excluding layout-dependent contrast | Passing |
| Application semantics | axe-core finds no detectable violations in the complete lab, excluding layout-dependent contrast | Passing |
| Named actions | Confirm and reject actions are discoverable by accessible name | Passing |
| Keyboard tabs | Arrow keys change the selected sample and move focus | Passing |
| Focus recovery | Terminal transaction status receives focus | Passing |
| Warning semantics | Persistent-permission warnings are exposed as an alert | Passing |
| Busy state | Actions lock while network submission is pending | Passing |
| Explorer boundary | Explorer link appears only after confirmation | Passing |
| Demo disclosure | The public lab identifies itself as a no-wallet, no-funds simulator | Passing |
| Lifecycle context | Review, submitted, and confirmed messages include useful context | Passing |
| Failure priority | Failure messages are assertive while other updates remain polite | Passing |
| Address display | Long addresses compact without changing short values | Passing |

Run the evidence locally:

```bash
npm run check
npm test
npm run build
```

## Manual browser QA

| Path | Reference expectation | Current stage |
| --- | --- | --- |
| Keyboard only | Every action is reachable; focus is visible; tab selection follows ARIA keyboard behaviour | Reference QA |
| 320px reflow | No two-dimensional page scrolling is needed outside intentionally scrollable code/table regions | Reference QA |
| 200% zoom | Transaction details and actions remain readable and operable | Reference QA |
| Reduced motion | Progress animation is suppressed by OS preference and the lab control | Implemented; broader matrix planned |
| High contrast | Lab control increases border and state separation | Implemented; forced-colours work planned |
| Simulated failure | Error is visible, announced assertively, and recoverable | Reference QA |

## Funded validation matrix

The beta milestone adds recorded results for VoiceOver with Safari, NVDA with Firefox and Chrome, JAWS with Chrome, keyboard-only navigation, zoom/reflow, reduced motion, and Windows high contrast. Five compensated participants who use assistive technology will validate comprehension and task completion. Results and blocking issues will be published without personal participant data.
