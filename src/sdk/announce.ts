import type { TransactionAnnouncement, TransactionReviewModel, TransactionStatus } from './types'

export function announcementFor(
  status: TransactionStatus,
  transaction: TransactionReviewModel,
  error?: string,
): TransactionAnnouncement {
  const messages: Record<TransactionStatus, string> = {
    review: `${transaction.title} is ready for review. ${transaction.items.length} transaction details.`,
    'awaiting-signature': `Wallet signature requested for ${transaction.title}. Review the wallet prompt before signing.`,
    submitted: `${transaction.title} was submitted to ${transaction.network}. Waiting for confirmation.`,
    confirmed: `${transaction.title} confirmed on ${transaction.network}.`,
    failed: `${transaction.title} failed. ${error || 'No error detail was provided.'}`,
  }

  return {
    status,
    message: messages[status],
    assertive: status === 'failed',
  }
}

export function compactAddress(address: string, edge = 6) {
  if (address.length <= edge * 2 + 3) return address
  return `${address.slice(0, edge)}...${address.slice(-edge)}`
}
