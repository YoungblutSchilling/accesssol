import { useEffect, useMemo, useRef } from 'react'
import { announcementFor } from './announce'
import type { TransactionReviewModel, TransactionStatus } from './types'

export function useTransactionAnnouncer(
  status: TransactionStatus,
  transaction: TransactionReviewModel,
  error?: string,
) {
  const previousStatus = useRef<TransactionStatus>()
  const statusRef = useRef<HTMLDivElement>(null)
  const announcement = useMemo(
    () => announcementFor(status, transaction, error),
    [error, status, transaction],
  )

  useEffect(() => {
    const movedToTerminalState = previousStatus.current !== status && (status === 'confirmed' || status === 'failed')
    if (movedToTerminalState) statusRef.current?.focus()
    previousStatus.current = status
  }, [status])

  return { announcement, statusRef }
}
