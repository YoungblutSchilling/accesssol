import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  Activity,
  Check,
  Contrast,
  Eye,
  Github,
  RotateCcw,
  ShieldAlert,
  Volume2,
} from 'lucide-react'
import { AccessibleTransactionReview, announcementFor } from './sdk'
import type { TransactionReviewModel, TransactionStatus } from './sdk'
import './styles.css'

type SampleKey = 'credential' | 'permission' | 'stipend'

const samples: Record<SampleKey, TransactionReviewModel> = {
  credential: {
    id: 'CRED-2048',
    title: 'Issue community credential',
    origin: 'Civic Passport',
    network: 'Devnet',
    wallet: '8wN3tDz9wbSyV1YFQ7Y8Rj1j3EFcPyCxjoxSp2Q9V4bp',
    fee: '0.000005 SOL',
    items: [
      { id: 'program', label: 'Program', value: 'CivicPass', detail: 'Verified programme registry' },
      { id: 'record', label: 'Record', value: 'Volunteer · Level 2', tone: 'positive' },
      { id: 'storage', label: 'Account space', value: '160 bytes', detail: 'Stored on Devnet' },
    ],
  },
  permission: {
    id: 'AUTH-7810',
    title: 'Update programme permission',
    origin: 'Access Registry',
    network: 'Devnet',
    wallet: '5iozfG3sFzpYx9NBSxni9vxTu1gSoCueL8phaSrQzxYX',
    fee: '0.000005 SOL',
    items: [
      { id: 'programme', label: 'Programme', value: 'Access Registry', detail: '3xLk...7psQ' },
      { id: 'change', label: 'Permission', value: 'Write profile', tone: 'danger' },
      { id: 'duration', label: 'Duration', value: 'Until revoked', tone: 'warning' },
    ],
    warnings: ['This action grants a persistent write permission.', 'Only continue if you recognise Access Registry.'],
  },
  stipend: {
    id: 'SEND-4092',
    title: 'Send contributor stipend',
    origin: 'Community Treasury',
    network: 'Devnet',
    wallet: 'HWJCpd8AS2nZDQzBprkiMPxd25RE25ePiVv7nhbX6doj',
    fee: '0.000005 SOL',
    items: [
      { id: 'recipient', label: 'Recipient', value: 'F3yw...p8dT', detail: 'Saved contributor address' },
      { id: 'amount', label: 'Amount', value: '0.25 SOL', tone: 'warning' },
      { id: 'balance', label: 'Balance after', value: '1.82 SOL' },
    ],
  },
}

export default function App() {
  const [sampleKey, setSampleKey] = useState<SampleKey>('credential')
  const [status, setStatus] = useState<TransactionStatus>('review')
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [error, setError] = useState<string>()
  const [log, setLog] = useState<string[]>([])
  const timers = useRef<number[]>([])
  const transaction = samples[sampleKey]
  const announcement = useMemo(() => announcementFor(status, transaction, error), [error, status, transaction])

  useEffect(() => {
    setLog((current) => [announcement.message, ...current.filter((item) => item !== announcement.message)].slice(0, 5))
  }, [announcement.message])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  function clearFlow() {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }

  function selectSample(key: SampleKey) {
    clearFlow()
    setSampleKey(key)
    setStatus('review')
    setError(undefined)
    setLog([])
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, current: SampleKey) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const order: SampleKey[] = ['credential', 'permission', 'stipend']
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const next = order[(order.indexOf(current) + direction + order.length) % order.length]
    selectSample(next)
    document.getElementById(`sample-tab-${next}`)?.focus()
  }

  function confirm() {
    clearFlow()
    setError(undefined)
    setStatus('awaiting-signature')
    timers.current.push(window.setTimeout(() => setStatus('submitted'), 900))
    timers.current.push(window.setTimeout(() => {
      if (simulateFailure) {
        setError('The recent blockhash expired. Request a fresh transaction and try again.')
        setStatus('failed')
      } else {
        setStatus('confirmed')
      }
    }, 2100))
  }

  function reject() {
    clearFlow()
    setStatus('review')
    setError(undefined)
    setLog((current) => ['Review cancelled. Nothing was signed or sent.', ...current].slice(0, 5))
  }

  function reset() {
    clearFlow()
    setStatus('review')
    setError(undefined)
    setLog([])
  }

  return (
    <div className={`demo-shell ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <header className="demo-topbar">
        <a className="demo-brand" href="#demo" aria-label="AccessSol home">
          <span className="demo-brand-mark" aria-hidden="true"><Accessibility size={20} /></span>
          <span>AccessSol</span>
          <small>ALPHA</small>
        </a>
        <div className="conformance"><span aria-hidden="true"><Check size={12} /></span> Automated WCAG checks passing</div>
        <a className="top-icon" href="https://github.com/YoungblutSchilling/accesssol" target="_blank" rel="noreferrer" aria-label="Open GitHub repository" title="Open GitHub repository"><Github size={19} /></a>
      </header>

      <main id="demo" className="demo-main">
        <section className="demo-heading">
          <div>
            <p className="demo-eyebrow">TRANSACTION ACCESSIBILITY LAB</p>
            <h1>Review states that everyone can follow.</h1>
          </div>
          <dl className="quality-metrics">
            <div><dt>Target size</dt><dd>44px+</dd></div>
            <div><dt>Live region</dt><dd>POLITE / ALERT</dd></div>
            <div><dt>Focus return</dt><dd>ENABLED</dd></div>
          </dl>
        </section>

        <div className="sample-tabs" role="tablist" aria-label="Transaction sample">
          <button id="sample-tab-credential" role="tab" aria-controls="sample-panel" aria-selected={sampleKey === 'credential'} tabIndex={sampleKey === 'credential' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 'credential')} onClick={() => selectSample('credential')}>Credential</button>
          <button id="sample-tab-permission" role="tab" aria-controls="sample-panel" aria-selected={sampleKey === 'permission'} tabIndex={sampleKey === 'permission' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 'permission')} onClick={() => selectSample('permission')}>Permission</button>
          <button id="sample-tab-stipend" role="tab" aria-controls="sample-panel" aria-selected={sampleKey === 'stipend'} tabIndex={sampleKey === 'stipend' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 'stipend')} onClick={() => selectSample('stipend')}>Stipend</button>
        </div>

        <div className="demo-grid">
          <section id="sample-panel" className="preview-pane" role="tabpanel" aria-labelledby={`sample-tab-${sampleKey}`}>
            <div className="pane-bar">
              <div><Eye size={15} /><span>Component preview</span></div>
              <button className="square-button" type="button" onClick={reset} aria-label="Reset transaction state" title="Reset transaction state"><RotateCcw size={16} /></button>
            </div>
            <div className="preview-canvas">
              <AccessibleTransactionReview
                transaction={transaction}
                status={status}
                error={error}
                explorerUrl="https://explorer.solana.com/?cluster=devnet"
                onConfirm={confirm}
                onReject={reject}
              />
            </div>
          </section>

          <aside className="inspector-pane" aria-label="Accessibility inspector">
            <div className="pane-bar"><div><Accessibility size={15} /><span>Accessibility inspector</span></div><span className="test-count">12 CHECKS</span></div>

            <section className="inspector-section">
              <h2>Rendering preferences</h2>
              <PreferenceRow icon={<Contrast size={17} />} label="High contrast" detail="Strengthens borders and status colour" checked={highContrast} onChange={setHighContrast} />
              <PreferenceRow icon={<Activity size={17} />} label="Reduce motion" detail="Stops progress rotation" checked={reduceMotion} onChange={setReduceMotion} />
              <PreferenceRow icon={<ShieldAlert size={17} />} label="Simulate failure" detail="Tests assertive error handling" checked={simulateFailure} onChange={setSimulateFailure} />
            </section>

            <section className="inspector-section announcement-section">
              <div className="section-title"><h2>Announcement trace</h2><Volume2 size={16} aria-hidden="true" /></div>
              <ol className="announcement-log">
                {log.map((entry, index) => <li key={`${entry}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{entry}</p></li>)}
              </ol>
            </section>

            <section className="check-grid" aria-label="Automated checks">
              <CheckItem label="Named controls" />
              <CheckItem label="Status semantics" />
              <CheckItem label="Keyboard focus" />
              <CheckItem label="Colour contrast" />
            </section>
          </aside>
        </div>

        <footer className="demo-footer">
          <span>React 18+</span><span>Wallet-adapter compatible model</span><span>MIT licensed</span>
        </footer>
      </main>
    </div>
  )
}

function PreferenceRow({ icon, label, detail, checked, onChange }: { icon: React.ReactNode; label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="preference-row">
      <span className="preference-icon" aria-hidden="true">{icon}</span>
      <span><strong>{label}</strong><small>{detail}</small></span>
      <input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  )
}

function CheckItem({ label }: { label: string }) {
  return <div><Check size={14} aria-hidden="true" /><span>{label}</span></div>
}
