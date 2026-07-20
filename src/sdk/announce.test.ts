import { describe, expect, it } from 'vitest'
import { announcementFor, compactAddress } from './announce'
import type { TransactionReviewModel } from './types'

const transaction: TransactionReviewModel = {
  id: 'TX-1042',
  title: 'Send 0.25 SOL',
  origin: 'Example dApp',
  network: 'Devnet',
  wallet: '8wN3tDz9wbSyV1YFQ7Y8Rj1j3EFcPyCxjoxSp2Q9V4bp',
  fee: '0.000005 SOL',
  items: [{ id: 'amount', label: 'Amount', value: '0.25 SOL' }],
}

describe('transaction announcements', () => {
  it('announces every state with transaction context', () => {
    expect(announcementFor('review', transaction).message).toContain('ready for review')
    expect(announcementFor('submitted', transaction).message).toContain('Devnet')
    expect(announcementFor('confirmed', transaction).message).toContain('confirmed')
  })

  it('uses assertive announcements only for failures', () => {
    expect(announcementFor('confirmed', transaction).assertive).toBe(false)
    expect(announcementFor('failed', transaction, 'Blockhash expired')).toEqual({
      status: 'failed',
      message: 'Send 0.25 SOL failed. Blockhash expired',
      assertive: true,
    })
  })

  it('compacts long addresses without changing short values', () => {
    expect(compactAddress(transaction.wallet)).toBe('8wN3tD...Q9V4bp')
    expect(compactAddress('Devnet')).toBe('Devnet')
  })
})
