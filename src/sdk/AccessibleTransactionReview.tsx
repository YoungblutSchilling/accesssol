import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CircleDashed,
  ExternalLink,
  ShieldCheck,
  WalletCards,
  X,
} from 'lucide-react'
import { compactAddress } from './announce'
import type { TransactionReviewModel, TransactionStatus } from './types'
import { useTransactionAnnouncer } from './useTransactionAnnouncer'
import './accesssol.css'

export interface AccessibleTransactionReviewProps {
  transaction: TransactionReviewModel
  status: TransactionStatus
  error?: string
  explorerUrl?: string
  onConfirm: () => void
  onReject: () => void
}

export function AccessibleTransactionReview({
  transaction,
  status,
  error,
  explorerUrl,
  onConfirm,
  onReject,
}: AccessibleTransactionReviewProps) {
  const { announcement, statusRef } = useTransactionAnnouncer(status, transaction, error)
  const busy = status === 'awaiting-signature' || status === 'submitted'
  const terminal = status === 'confirmed' || status === 'failed'

  return (
    <section className="as-review" aria-labelledby="transaction-title" aria-busy={busy}>
      <div className="as-live-region" role={announcement.assertive ? 'alert' : 'status'} aria-live={announcement.assertive ? 'assertive' : 'polite'} aria-atomic="true">
        {announcement.message}
      </div>

      <header className="as-review-head">
        <div className="as-origin-mark" aria-hidden="true"><WalletCards size={20} /></div>
        <div>
          <p>{transaction.origin}</p>
          <h2 id="transaction-title">{transaction.title}</h2>
        </div>
        <span className={`as-network ${transaction.network.toLowerCase()}`}>{transaction.network}</span>
      </header>

      <div
        ref={statusRef}
        className={`as-status ${status}`}
        tabIndex={terminal ? -1 : undefined}
        aria-label={`Transaction status: ${status.replace('-', ' ')}`}
      >
        <StatusIcon status={status} />
        <div>
          <strong>{statusLabel(status)}</strong>
          <span>{statusDetail(status, error)}</span>
        </div>
        {status === 'confirmed' && explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noreferrer">Explorer <ExternalLink size={13} /></a>
        )}
      </div>

      <dl className="as-meta">
        <div><dt>Wallet</dt><dd title={transaction.wallet}>{compactAddress(transaction.wallet)}</dd></div>
        <div><dt>Network fee</dt><dd>{transaction.fee}</dd></div>
        <div><dt>Reference</dt><dd>{transaction.id}</dd></div>
      </dl>

      <div className="as-items" aria-label="Transaction details">
        {transaction.items.map((item) => (
          <div key={item.id} className={`as-item ${item.tone || 'neutral'}`}>
            <span className="as-item-tone" aria-hidden="true" />
            <div>
              <span>{item.label}</span>
              {item.detail && <small>{item.detail}</small>}
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      {transaction.warnings?.length ? (
        <div className="as-warning" role="alert">
          <AlertTriangle size={17} aria-hidden="true" />
          <div><strong>Review required</strong>{transaction.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>
        </div>
      ) : (
        <div className="as-clear"><ShieldCheck size={17} aria-hidden="true" /> No elevated permission changes detected</div>
      )}

      <div className="as-actions">
        <button className="as-button secondary" type="button" onClick={onReject} disabled={busy}>
          <ArrowLeft size={17} /> Reject
        </button>
        <button className="as-button primary" type="button" onClick={onConfirm} disabled={busy || status === 'confirmed'}>
          {busy ? <CircleDashed className="as-spin" size={17} /> : status === 'confirmed' ? <Check size={17} /> : <ShieldCheck size={17} />}
          {status === 'confirmed' ? 'Confirmed' : busy ? 'Processing' : status === 'failed' ? 'Try again' : 'Confirm transaction'}
        </button>
      </div>
    </section>
  )
}

function StatusIcon({ status }: { status: TransactionStatus }) {
  if (status === 'confirmed') return <Check size={18} aria-hidden="true" />
  if (status === 'failed') return <X size={18} aria-hidden="true" />
  if (status === 'review') return <ShieldCheck size={18} aria-hidden="true" />
  return <CircleDashed className="as-spin" size={18} aria-hidden="true" />
}

function statusLabel(status: TransactionStatus) {
  const labels: Record<TransactionStatus, string> = {
    review: 'Ready for review',
    'awaiting-signature': 'Waiting for wallet',
    submitted: 'Submitted to network',
    confirmed: 'Transaction confirmed',
    failed: 'Transaction failed',
  }
  return labels[status]
}

function statusDetail(status: TransactionStatus, error?: string) {
  const details: Record<TransactionStatus, string> = {
    review: 'Nothing has been signed or sent.',
    'awaiting-signature': 'Check the details in your wallet prompt.',
    submitted: 'Confirmation normally takes a few seconds.',
    confirmed: 'Focus moved here when confirmation arrived.',
    failed: error || 'No funds were moved.',
  }
  return details[status]
}
