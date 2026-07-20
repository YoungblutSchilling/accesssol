import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  Activity,
  BookOpen,
  Check,
  Clipboard,
  Code2,
  Contrast,
  ExternalLink,
  Eye,
  FileCheck2,
  FlaskConical,
  Github,
  Map,
  RotateCcw,
  ShieldAlert,
  Terminal,
  Volume2,
} from 'lucide-react'
import { AccessibleTransactionReview, announcementFor } from './sdk'
import type { TransactionReviewModel, TransactionStatus } from './sdk'
import './styles.css'

type SampleKey = 'credential' | 'permission' | 'stipend'
type CodeSampleKey = 'install' | 'component' | 'lifecycle'
type ViewKey = 'workbench' | 'quickstart' | 'evidence' | 'roadmap'

const repositoryUrl = 'https://github.com/YoungblutSchilling/accesssol'

const samples: Record<SampleKey, TransactionReviewModel> = {
  credential: {
    id: 'CRED-2048', title: 'Issue community credential', origin: 'Civic Passport', network: 'Devnet',
    wallet: '8wN3tDz9wbSyV1YFQ7Y8Rj1j3EFcPyCxjoxSp2Q9V4bp', fee: '0.000005 SOL',
    items: [
      { id: 'program', label: 'Program', value: 'CivicPass', detail: 'Verified programme registry' },
      { id: 'record', label: 'Record', value: 'Volunteer - Level 2', tone: 'positive' },
      { id: 'storage', label: 'Account space', value: '160 bytes', detail: 'Stored on Devnet' },
    ],
  },
  permission: {
    id: 'AUTH-7810', title: 'Update programme permission', origin: 'Access Registry', network: 'Devnet',
    wallet: '5iozfG3sFzpYx9NBSxni9vxTu1gSoCueL8phaSrQzxYX', fee: '0.000005 SOL',
    items: [
      { id: 'programme', label: 'Programme', value: 'Access Registry', detail: '3xLk...7psQ' },
      { id: 'change', label: 'Permission', value: 'Write profile', tone: 'danger' },
      { id: 'duration', label: 'Duration', value: 'Until revoked', tone: 'warning' },
    ],
    warnings: ['This action grants a persistent write permission.', 'Only continue if you recognise Access Registry.'],
  },
  stipend: {
    id: 'SEND-4092', title: 'Send contributor stipend', origin: 'Community Treasury', network: 'Devnet',
    wallet: 'HWJCpd8AS2nZDQzBprkiMPxd25RE25ePiVv7nhbX6doj', fee: '0.000005 SOL',
    items: [
      { id: 'recipient', label: 'Recipient', value: 'F3yw...p8dT', detail: 'Saved contributor address' },
      { id: 'amount', label: 'Amount', value: '0.25 SOL', tone: 'warning' },
      { id: 'balance', label: 'Balance after', value: '1.82 SOL' },
    ],
  },
}

const codeSamples: Record<CodeSampleKey, string> = {
  install: `npm install github:YoungblutSchilling/accesssol`,
  component: `import { AccessibleTransactionReview } from '@accesssol/react'
import '@accesssol/react/styles.css'

<AccessibleTransactionReview
  transaction={reviewModel}
  status={status}
  onConfirm={requestWalletSignature}
  onReject={closeReview}
/>`,
  lifecycle: `setStatus('awaiting-signature')
const signed = await wallet.signTransaction(transaction)

setStatus('submitted')
const signature = await connection.sendRawTransaction(signed.serialize())

await connection.confirmTransaction(signature)
setStatus('confirmed')`,
}

const evidence = [
  { criterion: '1.3.1', behaviour: 'Structured labels and relationships', proof: 'Semantic component tests', state: 'Verified' },
  { criterion: '2.1.1', behaviour: 'Keyboard-operable review and tabs', proof: 'Interaction tests', state: 'Verified' },
  { criterion: '2.4.3', behaviour: 'Focus recovery after terminal states', proof: 'Focus test', state: 'Verified' },
  { criterion: '2.5.8', behaviour: '44px minimum action targets', proof: 'Reference CSS', state: 'Implemented' },
  { criterion: '4.1.2', behaviour: 'Named controls and status semantics', proof: 'axe-core + role tests', state: 'Verified' },
  { criterion: '4.1.3', behaviour: 'Polite progress and assertive failure', proof: 'Announcement tests', state: 'Verified' },
]

const viewItems: { key: ViewKey; label: string; detail: string; icon: React.ReactNode }[] = [
  { key: 'workbench', label: 'Workbench', detail: 'Live component states', icon: <FlaskConical size={17} /> },
  { key: 'quickstart', label: 'Quickstart', detail: 'Install and integrate', icon: <Code2 size={17} /> },
  { key: 'evidence', label: 'Evidence', detail: 'Tests and WCAG map', icon: <FileCheck2 size={17} /> },
  { key: 'roadmap', label: 'Delivery', detail: 'Milestones and scope', icon: <Map size={17} /> },
]

export default function App() {
  const [view, setView] = useState<ViewKey>('workbench')
  const [sampleKey, setSampleKey] = useState<SampleKey>('credential')
  const [status, setStatus] = useState<TransactionStatus>('review')
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [error, setError] = useState<string>()
  const [log, setLog] = useState<string[]>([])
  const [codeSample, setCodeSample] = useState<CodeSampleKey>('install')
  const [copied, setCopied] = useState(false)
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
      } else setStatus('confirmed')
    }, 2100))
  }

  function reset() {
    clearFlow()
    setStatus('review')
    setError(undefined)
    setLog([])
  }

  async function copyCode() {
    await navigator.clipboard.writeText(codeSamples[codeSample])
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={`app-shell ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="app-header">
        <button className="brand" type="button" onClick={() => setView('workbench')} aria-label="Open AccessSol workbench">
          <span className="brand-mark" aria-hidden="true"><Accessibility size={20} /></span>
          <span>AccessSol</span><small>0.1.0</small>
        </button>
        <div className="build-status"><span><Check size={12} /></span><strong>12 / 12</strong><small>CI checks passing</small></div>
        <a className="header-source" href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={17} /><span>View source</span></a>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav aria-label="Product views">
            {viewItems.map((item) => (
              <button key={item.key} type="button" aria-label={item.label} title={item.label} aria-current={view === item.key ? 'page' : undefined} onClick={() => setView(item.key)}>
                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
              </button>
            ))}
          </nav>
          <div className="sidebar-release">
            <span>PUBLIC ALPHA</span>
            <strong>Source install available</strong>
            <p>MIT licensed. Registry packaging and Wallet Adapter examples are funded milestones.</p>
          </div>
        </aside>

        <main id="main" className="workspace">
          {view === 'workbench' && (
            <WorkbenchView
              sampleKey={sampleKey} status={status} error={error} transaction={transaction} log={log}
              highContrast={highContrast} reduceMotion={reduceMotion} simulateFailure={simulateFailure}
              onSample={selectSample} onTabKey={handleTabKey} onConfirm={confirm}
              onReject={reset} onReset={reset} onContrast={setHighContrast}
              onMotion={setReduceMotion} onFailure={setSimulateFailure}
            />
          )}
          {view === 'quickstart' && <QuickstartView codeSample={codeSample} copied={copied} onSample={setCodeSample} onCopy={copyCode} />}
          {view === 'evidence' && <EvidenceView />}
          {view === 'roadmap' && <RoadmapView />}
        </main>
      </div>

      <footer className="status-bar">
        <span><span className="status-dot" /> Reference app online</span>
        <span>React 18+</span><span>MIT</span><span>Devnet simulator / no funds moved</span>
      </footer>
    </div>
  )
}

interface WorkbenchProps {
  sampleKey: SampleKey
  status: TransactionStatus
  error?: string
  transaction: TransactionReviewModel
  log: string[]
  highContrast: boolean
  reduceMotion: boolean
  simulateFailure: boolean
  onSample: (key: SampleKey) => void
  onTabKey: (event: React.KeyboardEvent<HTMLButtonElement>, current: SampleKey) => void
  onConfirm: () => void
  onReject: () => void
  onReset: () => void
  onContrast: (value: boolean) => void
  onMotion: (value: boolean) => void
  onFailure: (value: boolean) => void
}

function WorkbenchView(props: WorkbenchProps) {
  return (
    <div className="view-stack">
      <ViewHeader eyebrow="TRANSACTION LAB / DEVNET" title="Transaction review workbench" detail="Exercise the component lifecycle and inspect its accessibility output in real time." />
      <div className="workbench-toolbar">
        <div className="sample-tabs" role="tablist" aria-label="Transaction sample">
          {(['credential', 'permission', 'stipend'] as SampleKey[]).map((key) => (
            <button id={`sample-tab-${key}`} key={key} role="tab" aria-controls="sample-panel" aria-selected={props.sampleKey === key} tabIndex={props.sampleKey === key ? 0 : -1} onKeyDown={(event) => props.onTabKey(event, key)} onClick={() => props.onSample(key)}>{key[0].toUpperCase() + key.slice(1)}</button>
          ))}
        </div>
        <div className="simulation-note"><Activity size={14} /><span><strong>Simulation only.</strong> It never opens a wallet, signs, or moves funds.</span></div>
        <button className="icon-button" type="button" onClick={props.onReset} aria-label="Reset transaction state" title="Reset transaction state"><RotateCcw size={16} /></button>
      </div>

      <div className="workbench-grid">
        <section id="sample-panel" className="preview-pane" role="tabpanel" aria-labelledby={`sample-tab-${props.sampleKey}`}>
          <div className="pane-bar"><div><Eye size={15} /><span>Rendered component</span></div><span>480 PX REFERENCE</span></div>
          <div className="preview-canvas">
            <AccessibleTransactionReview transaction={props.transaction} status={props.status} error={props.error} explorerUrl="https://explorer.solana.com/?cluster=devnet" onConfirm={props.onConfirm} onReject={props.onReject} />
          </div>
        </section>
        <aside className="inspector-pane" aria-label="Accessibility inspector">
          <div className="pane-bar"><div><Accessibility size={15} /><span>Accessibility inspector</span></div><span>LIVE</span></div>
          <section className="inspector-section control-section">
            <h2>Environment</h2>
            <PreferenceRow icon={<Contrast size={17} />} label="High contrast" detail="Strengthens state boundaries" checked={props.highContrast} onChange={props.onContrast} />
            <PreferenceRow icon={<Activity size={17} />} label="Reduce motion" detail="Stops progress rotation" checked={props.reduceMotion} onChange={props.onMotion} />
            <PreferenceRow icon={<ShieldAlert size={17} />} label="Force failure" detail="Exercises assertive recovery" checked={props.simulateFailure} onChange={props.onFailure} />
          </section>
          <section className="inspector-section trace-section">
            <div className="section-title"><h2>Announcement trace</h2><Volume2 size={16} aria-hidden="true" /></div>
            <ol className="announcement-log">{props.log.map((entry, index) => <li key={`${entry}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{entry}</p></li>)}</ol>
          </section>
          <section className="check-grid" aria-label="Implemented safeguards"><CheckItem label="Named controls" /><CheckItem label="Status semantics" /><CheckItem label="Focus recovery" /><CheckItem label="Motion preference" /></section>
        </aside>
      </div>
    </div>
  )
}

function QuickstartView({ codeSample, copied, onSample, onCopy }: { codeSample: CodeSampleKey; copied: boolean; onSample: (key: CodeSampleKey) => void; onCopy: () => void }) {
  return (
    <div className="view-stack">
      <ViewHeader eyebrow="DEVELOPER GUIDE / SOURCE ALPHA" title="Integrate without replacing wallet logic" detail="Your application keeps wallet selection, signing, submission, and confirmation. AccessSol renders the accessible review contract." />
      <div className="quickstart-layout">
        <div className="step-list">
          <button className={codeSample === 'install' ? 'active' : ''} onClick={() => onSample('install')}><span>01</span><div><strong>Install source alpha</strong><small>GitHub distribution</small></div></button>
          <button className={codeSample === 'component' ? 'active' : ''} onClick={() => onSample('component')}><span>02</span><div><strong>Render the review</strong><small>Typed transaction model</small></div></button>
          <button className={codeSample === 'lifecycle' ? 'active' : ''} onClick={() => onSample('lifecycle')}><span>03</span><div><strong>Connect lifecycle</strong><small>Wallet remains app-owned</small></div></button>
        </div>
        <div className="code-workbench">
          <div className="code-toolbar"><span><Terminal size={14} /> {codeSample === 'install' ? 'terminal' : 'App.tsx'}</span><button type="button" onClick={onCopy} aria-label={`Copy ${codeSample} code`}><Clipboard size={14} /> {copied ? 'Copied' : 'Copy'}</button></div>
          <pre tabIndex={0}><code>{codeSamples[codeSample]}</code></pre>
        </div>
      </div>
      <div className="implementation-notes">
        <section><h2>Host application owns</h2><ul><li>Wallet selection and connection</li><li>Transaction construction and signing</li><li>Network submission and confirmation</li></ul></section>
        <section><h2>AccessSol owns</h2><ul><li>Review structure and warnings</li><li>Lifecycle announcements</li><li>Terminal focus and recovery state</li></ul></section>
        <section className="doc-links"><h2>Public documentation</h2><a href={`${repositoryUrl}/blob/main/docs/INTEGRATION.md`} target="_blank" rel="noreferrer"><BookOpen size={15} /> Integration guide <ExternalLink size={13} /></a><a href={`${repositoryUrl}/tree/main/src/sdk`} target="_blank" rel="noreferrer"><Code2 size={15} /> SDK source <ExternalLink size={13} /></a></section>
      </div>
    </div>
  )
}

function EvidenceView() {
  return (
    <div className="view-stack">
      <ViewHeader eyebrow="VERIFICATION / CURRENT ALPHA" title="Implementation evidence" detail="Automated checks verify mechanics. They do not constitute WCAG conformance or replace validation with disabled users." />
      <div className="evidence-summary"><Metric value="12" label="Passing tests" /><Metric value="3" label="Test files" /><Metric value="0" label="Detected axe violations*" /><Metric value="2" label="Build targets" /></div>
      <div className="evidence-layout">
        <div className="evidence-table-wrap"><table><caption className="visually-hidden">Current accessibility implementation evidence</caption><thead><tr><th>WCAG</th><th>Behaviour</th><th>Public proof</th><th>Status</th></tr></thead><tbody>{evidence.map((item) => <tr key={item.criterion}><td>{item.criterion}</td><td>{item.behaviour}</td><td>{item.proof}</td><td><span className={item.state === 'Verified' ? 'status-verified' : 'status-implemented'}>{item.state}</span></td></tr>)}</tbody></table></div>
        <aside className="claim-boundary"><ShieldAlert size={20} /><span>CLAIM BOUNDARY</span><h2>Tested alpha, not a conformance badge.</h2><p>* axe-core runs in jsdom with layout-dependent colour contrast excluded. Manual browser QA and assistive-technology validation remain separate work.</p><a href={`${repositoryUrl}/blob/main/docs/CONFORMANCE.md`} target="_blank" rel="noreferrer">Conformance notes <ExternalLink size={13} /></a><a href={`${repositoryUrl}/blob/main/docs/TEST_MATRIX.md`} target="_blank" rel="noreferrer">Full test matrix <ExternalLink size={13} /></a></aside>
      </div>
    </div>
  )
}

function RoadmapView() {
  const milestones = [
    { id: 'NOW', timing: 'Public alpha', title: 'Reusable review core', status: 'Shipped', items: 'React component, typed model, announcement hook, CI and interactive lab' },
    { id: 'M1', timing: 'Week 4', title: 'Wallet-ready alpha', status: 'Funded scope', items: 'Wallet Adapter reference app, four adapters, 25 tests and WCAG map' },
    { id: 'M2', timing: 'Week 9', title: 'Validated beta', status: 'Funded scope', items: 'Five compensated sessions, assistive-technology matrix and beta report' },
    { id: 'M3', timing: 'Week 14', title: 'Adoption release', status: 'Funded scope', items: 'Two public pilots, independent review, issue log and tagged 1.0 release' },
  ]
  return (
    <div className="view-stack">
      <ViewHeader eyebrow="DELIVERY / 5,500 USDG" title="Milestones tied to public proof" detail="Each stage ends with inspectable code, validation records, or independently verifiable adoption evidence." />
      <div className="milestone-list">{milestones.map((milestone) => <article key={milestone.id}><span className="milestone-id">{milestone.id}</span><span className="milestone-time">{milestone.timing}</span><div><h2>{milestone.title}</h2><p>{milestone.items}</p></div><span className={milestone.status === 'Shipped' ? 'milestone-shipped' : 'milestone-planned'}>{milestone.status}</span></article>)}</div>
      <div className="delivery-bottom"><section><span>SUCCESS CONDITION</span><h2>Adoption, not output volume</h2><p>The final milestone only counts integrations that are public, merged, or confirmed by maintainers.</p></section><section><span>BUDGET SPLIT</span><dl><div><dt>Engineering</dt><dd>2,800</dd></div><div><dt>Independent review</dt><dd>1,000</dd></div><div><dt>Participant stipends</dt><dd>800</dd></div><div><dt>Docs, hosting, contingency</dt><dd>900</dd></div></dl></section><a href={`${repositoryUrl}/blob/main/docs/GRANT_APPLICATION.md`} target="_blank" rel="noreferrer">Open full delivery plan <ExternalLink size={14} /></a></div>
    </div>
  )
}

function ViewHeader({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return <header className="view-header"><div><p>{eyebrow}</p><h1>{title}</h1></div><p>{detail}</p></header>
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>
}

function PreferenceRow({ icon, label, detail, checked, onChange }: { icon: React.ReactNode; label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="preference-row"><span className="preference-icon" aria-hidden="true">{icon}</span><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>
}

function CheckItem({ label }: { label: string }) {
  return <div><Check size={14} aria-hidden="true" /><span>{label}</span></div>
}
