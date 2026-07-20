export type TransactionStatus = 'review' | 'awaiting-signature' | 'submitted' | 'confirmed' | 'failed'

export type ReviewItemTone = 'neutral' | 'positive' | 'warning' | 'danger'

export interface TransactionReviewItem {
  id: string
  label: string
  value: string
  detail?: string
  tone?: ReviewItemTone
}

export interface TransactionReviewModel {
  id: string
  title: string
  origin: string
  network: 'Mainnet' | 'Devnet' | 'Testnet' | 'Localnet'
  wallet: string
  fee: string
  items: TransactionReviewItem[]
  warnings?: string[]
}

export interface TransactionAnnouncement {
  status: TransactionStatus
  message: string
  assertive: boolean
}
