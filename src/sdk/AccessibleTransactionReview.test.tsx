import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it, vi } from 'vitest'
import { AccessibleTransactionReview } from './AccessibleTransactionReview'
import type { TransactionReviewModel } from './types'

const transaction: TransactionReviewModel = {
  id: 'TX-1042',
  title: 'Grant programme access',
  origin: 'Civic Passport',
  network: 'Devnet',
  wallet: '8wN3tDz9wbSyV1YFQ7Y8Rj1j3EFcPyCxjoxSp2Q9V4bp',
  fee: '0.000005 SOL',
  items: [
    { id: 'program', label: 'Program', value: 'CivicPass', detail: 'Known programme registry' },
    { id: 'permission', label: 'Permission', value: 'Read profile', tone: 'positive' },
  ],
}

describe('AccessibleTransactionReview', () => {
  it('has no detectable axe violations in the review state', async () => {
    const { container } = render(
      <AccessibleTransactionReview transaction={transaction} status="review" onConfirm={() => undefined} onReject={() => undefined} />,
    )
    const result = await axe.run(container, {
      rules: {
        // jsdom has no layout or canvas, so contrast is verified in the browser QA pass.
        'color-contrast': { enabled: false },
      },
    })
    expect(result.violations).toEqual([])
  })

  it('provides named confirmation and rejection actions', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onReject = vi.fn()
    render(<AccessibleTransactionReview transaction={transaction} status="review" onConfirm={onConfirm} onReject={onReject} />)

    await user.click(screen.getByRole('button', { name: 'Confirm transaction' }))
    await user.click(screen.getByRole('button', { name: 'Reject' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onReject).toHaveBeenCalledOnce()
  })

  it('moves focus to terminal status updates', () => {
    const { rerender } = render(
      <AccessibleTransactionReview transaction={transaction} status="submitted" onConfirm={() => undefined} onReject={() => undefined} />,
    )
    rerender(<AccessibleTransactionReview transaction={transaction} status="confirmed" onConfirm={() => undefined} onReject={() => undefined} />)
    expect(screen.getByLabelText('Transaction status: confirmed')).toHaveFocus()
  })

  it('surfaces warnings as an alert', () => {
    render(
      <AccessibleTransactionReview
        transaction={{ ...transaction, warnings: ['This action changes a persistent account permission.'] }}
        status="review"
        onConfirm={() => undefined}
        onReject={() => undefined}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('persistent account permission')
  })

  it('locks actions while a signed transaction is being submitted', () => {
    render(<AccessibleTransactionReview transaction={transaction} status="submitted" onConfirm={() => undefined} onReject={() => undefined} />)
    expect(screen.getByRole('button', { name: 'Processing' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeDisabled()
  })

  it('exposes an explorer link only after confirmation', () => {
    const { rerender } = render(
      <AccessibleTransactionReview transaction={transaction} status="review" explorerUrl="https://explorer.solana.com" onConfirm={() => undefined} onReject={() => undefined} />,
    )
    expect(screen.queryByRole('link', { name: /explorer/i })).not.toBeInTheDocument()
    rerender(<AccessibleTransactionReview transaction={transaction} status="confirmed" explorerUrl="https://explorer.solana.com" onConfirm={() => undefined} onReject={() => undefined} />)
    expect(screen.getByRole('link', { name: /explorer/i })).toHaveAttribute('href', 'https://explorer.solana.com')
  })
})
