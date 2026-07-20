# AccessSol integration guide

AccessSol owns the accessible presentation of a proposed transaction and its lifecycle. The host application keeps wallet selection, signing, submission, and confirmation.

## Install the source alpha

The package is not yet published to a registry. Install the current public source directly from GitHub:

```bash
npm install github:YoungblutSchilling/accesssol
```

The Git dependency runs the library build during installation and exports the React component, hook, utility functions, types, and CSS.

## Render a review

```tsx
import { useState } from 'react'
import {
  AccessibleTransactionReview,
  type TransactionReviewModel,
  type TransactionStatus,
} from '@accesssol/react'
import '@accesssol/react/styles.css'

const review: TransactionReviewModel = {
  id: 'SEND-1042',
  title: 'Send contributor stipend',
  origin: 'Community Treasury',
  network: 'Devnet',
  wallet: '8wN3tDz9wbSyV1YFQ7Y8Rj1j3EFcPyCxjoxSp2Q9V4bp',
  fee: '0.000005 SOL',
  items: [
    { id: 'recipient', label: 'Recipient', value: 'F3yw...p8dT' },
    { id: 'amount', label: 'Amount', value: '0.25 SOL', tone: 'warning' },
  ],
}

export function ReviewStep() {
  const [status, setStatus] = useState<TransactionStatus>('review')

  async function confirm() {
    try {
      setStatus('awaiting-signature')
      const signed = await wallet.signTransaction(transaction)
      setStatus('submitted')
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature)
      setStatus('confirmed')
    } catch (error) {
      setStatus('failed')
    }
  }

  return (
    <AccessibleTransactionReview
      transaction={review}
      status={status}
      onConfirm={confirm}
      onReject={closeReview}
    />
  )
}
```

The wallet and connection variables above intentionally remain application-owned. AccessSol does not request private keys, sign transactions, or replace a wallet security prompt.

## Lifecycle contract

| State | Host application event | AccessSol behaviour |
| --- | --- | --- |
| `review` | A transaction proposal is ready | Presents origin, network, fee, effects, and warnings |
| `awaiting-signature` | The wallet prompt opens | Announces that wallet review is required and locks duplicate actions |
| `submitted` | A signature is sent to the network | Announces progress without stealing focus |
| `confirmed` | Confirmation resolves | Announces success and moves focus to the terminal status |
| `failed` | Signing, submission, or confirmation fails | Announces the error assertively and moves focus to recovery context |

## Integration responsibilities

- Build review items from allowlisted Solana instructions. Unknown instructions should remain explicit rather than being given a reassuring summary.
- Preserve the wallet's own prompt and security information.
- Supply useful, human-readable errors without exposing secrets or raw stack traces.
- Test keyboard, zoom/reflow, reduced motion, high contrast, and supported screen-reader/browser combinations before release.
- Do not describe automated axe results as proof of WCAG conformance.

The funded roadmap adds maintained Wallet Adapter reference applications and transaction-to-review adapters. They are planned work, not part of the current alpha claim.
