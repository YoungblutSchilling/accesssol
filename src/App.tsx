import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Clipboard,
  Code2,
  Contrast,
  ExternalLink,
  Eye,
  FileCheck2,
  Github,
  GitPullRequest,
  RotateCcw,
  ShieldAlert,
  Terminal,
  Users,
  Volume2,
} from 'lucide-react'
import { AccessibleTransactionReview, announcementFor } from './sdk'
import type { TransactionReviewModel, TransactionStatus } from './sdk'
import './styles.css'

type SampleKey = 'credential' | 'permission' | 'stipend'
type CodeSampleKey = 'install' | 'component' | 'lifecycle'

const repositoryUrl = 'https://github.com/YoungblutSchilling/accesssol'

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
      { id: 'record', label: 'Record', value: 'Volunteer - Level 2', tone: 'positive' },
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
  lifecycle: `// Keep wallet logic in your app. AccessSol renders its state.
setStatus('awaiting-signature')
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

export default function App() {
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

  async function copyCode() {
    await navigator.clipboard.writeText(codeSamples[codeSample])
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={`site-shell ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AccessSol home">
          <span className="brand-mark" aria-hidden="true"><Accessibility size={20} /></span>
          <span>AccessSol</span>
          <small>ALPHA</small>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#lab">Live lab</a>
          <a href="#integrate">Integrate</a>
          <a href="#evidence">Evidence</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <a className="header-source" href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={17} /> <span>Source</span></a>
      </header>

      <main id="main">
        <section id="top" className="hero section-frame" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> OPEN-SOURCE SOLANA ACCESSIBILITY INFRASTRUCTURE</p>
            <h1 id="hero-title">Make the transaction understandable <em>before</em> it becomes irreversible.</h1>
            <p className="hero-lede">AccessSol gives React teams a tested review and status layer for wallet handoff, network progress, warnings, failures, and focus recovery.</p>
            <div className="hero-actions">
              <a className="button primary" href="#lab">Try the live states <ArrowRight size={17} /></a>
              <a className="button secondary" href={`${repositoryUrl}#readme`} target="_blank" rel="noreferrer">Read the source <Github size={17} /></a>
            </div>
          </div>
          <aside className="release-ledger" aria-label="Current release evidence">
            <div className="ledger-head"><span>RELEASE LEDGER</span><strong>v0.1.0</strong></div>
            <dl>
              <div><dt>Shipped today</dt><dd>React component + hooks</dd></div>
              <div><dt>Automated suite</dt><dd>12 passing tests</dd></div>
              <div><dt>Distribution</dt><dd>GitHub source alpha</dd></div>
              <div><dt>License</dt><dd>MIT / public good</dd></div>
            </dl>
            <p><Check size={14} /> CI builds both the reusable library and this reference application.</p>
          </aside>
        </section>

        <section id="lab" className="lab-section section-frame" aria-labelledby="lab-title">
          <div className="section-heading">
            <div><p className="section-index">01 / LIVE LAB</p><h2 id="lab-title">Inspect every state, not just the happy path.</h2></div>
            <p>Use the controls to expose the exact screen-reader announcement and focus behaviour generated by the SDK.</p>
          </div>
          <div className="simulation-note"><Activity size={15} /><strong>Safe simulator:</strong> this lab models Devnet lifecycle states. It never opens a wallet, signs, or moves funds.</div>

          <div className="sample-tabs" role="tablist" aria-label="Transaction sample">
            <button id="sample-tab-credential" role="tab" aria-controls="sample-panel" aria-selected={sampleKey === 'credential'} tabIndex={sampleKey === 'credential' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 'credential')} onClick={() => selectSample('credential')}>Credential</button>
            <button id="sample-tab-permission" role="tab" aria-controls="sample-panel" aria-selected={sampleKey === 'permission'} tabIndex={sampleKey === 'permission' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 'permission')} onClick={() => selectSample('permission')}>Permission</button>
            <button id="sample-tab-stipend" role="tab" aria-controls="sample-panel" aria-selected={sampleKey === 'stipend'} tabIndex={sampleKey === 'stipend' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 'stipend')} onClick={() => selectSample('stipend')}>Stipend</button>
          </div>

          <div className="lab-grid">
            <section id="sample-panel" className="preview-pane" role="tabpanel" aria-labelledby={`sample-tab-${sampleKey}`}>
              <div className="pane-bar">
                <div><Eye size={15} /><span>Component preview</span></div>
                <button className="square-button" type="button" onClick={reset} aria-label="Reset transaction state" title="Reset transaction state"><RotateCcw size={16} /></button>
              </div>
              <div className="preview-canvas">
                <AccessibleTransactionReview transaction={transaction} status={status} error={error} explorerUrl="https://explorer.solana.com/?cluster=devnet" onConfirm={confirm} onReject={reject} />
              </div>
            </section>

            <aside className="inspector-pane" aria-label="Accessibility inspector">
              <div className="pane-bar"><div><Accessibility size={15} /><span>Accessibility inspector</span></div><span className="test-count">LIVE TRACE</span></div>
              <section className="inspector-section">
                <h3>Rendering preferences</h3>
                <PreferenceRow icon={<Contrast size={17} />} label="High contrast" detail="Strengthens borders and status colour" checked={highContrast} onChange={setHighContrast} />
                <PreferenceRow icon={<Activity size={17} />} label="Reduce motion" detail="Stops progress rotation" checked={reduceMotion} onChange={setReduceMotion} />
                <PreferenceRow icon={<ShieldAlert size={17} />} label="Simulate failure" detail="Tests assertive error handling" checked={simulateFailure} onChange={setSimulateFailure} />
              </section>
              <section className="inspector-section announcement-section">
                <div className="section-title"><h3>Announcement trace</h3><Volume2 size={16} aria-hidden="true" /></div>
                <ol className="announcement-log">
                  {log.map((entry, index) => <li key={`${entry}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{entry}</p></li>)}
                </ol>
              </section>
              <section className="check-grid" aria-label="Implemented safeguards">
                <CheckItem label="Named controls" /><CheckItem label="Status semantics" /><CheckItem label="Keyboard focus" /><CheckItem label="Motion preference" />
              </section>
            </aside>
          </div>
        </section>

        <section id="integrate" className="developer-section section-frame" aria-labelledby="integrate-title">
          <div className="section-heading">
            <div><p className="section-index">02 / INTEGRATE</p><h2 id="integrate-title">From source to first review state.</h2></div>
            <p>The alpha is installable directly from GitHub. Your app keeps custody and wallet logic; AccessSol owns the accessible presentation layer.</p>
          </div>
          <div className="developer-grid">
            <div className="code-workbench">
              <div className="code-tabs" role="tablist" aria-label="Integration code samples">
                {(['install', 'component', 'lifecycle'] as CodeSampleKey[]).map((key) => (
                  <button key={key} role="tab" aria-selected={codeSample === key} onClick={() => { setCodeSample(key); setCopied(false) }}>{key === 'install' ? '1. Install' : key === 'component' ? '2. Render' : '3. Connect'}</button>
                ))}
              </div>
              <div className="code-toolbar"><span><Terminal size={14} /> {codeSample === 'install' ? 'terminal' : 'App.tsx'}</span><button type="button" onClick={copyCode} aria-label={`Copy ${codeSample} code`}><Clipboard size={14} /> {copied ? 'Copied' : 'Copy'}</button></div>
              <pre tabIndex={0}><code>{codeSamples[codeSample]}</code></pre>
              <p className="code-caption">GitHub installation is available now. Registry packaging and Wallet Adapter reference integrations are grant milestones.</p>
            </div>
            <ol className="integration-contract">
              <li><span>01</span><div><strong>Describe the transaction</strong><p>Pass a typed model with origin, network, fee, effects, and risk warnings.</p></div></li>
              <li><span>02</span><div><strong>Keep wallet control</strong><p>Use your existing wallet adapter. AccessSol never touches keys or bypasses wallet prompts.</p></div></li>
              <li><span>03</span><div><strong>Report lifecycle state</strong><p>Update five deterministic states; the SDK handles live announcements and terminal focus.</p></div></li>
              <li><span>04</span><div><strong>Test the contract</strong><p>Run the exported component in CI and verify manual assistive-technology paths before release.</p></div></li>
            </ol>
          </div>
          <div className="resource-links">
            <a href={`${repositoryUrl}/blob/main/docs/INTEGRATION.md`} target="_blank" rel="noreferrer"><BookOpen size={18} /><span><strong>Integration guide</strong><small>Typed model and lifecycle contract</small></span><ExternalLink size={15} /></a>
            <a href={`${repositoryUrl}/tree/main/src/sdk`} target="_blank" rel="noreferrer"><Code2 size={18} /><span><strong>SDK source</strong><small>Review component, hook, and tests</small></span><ExternalLink size={15} /></a>
            <a href={`${repositoryUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer"><GitPullRequest size={18} /><span><strong>MIT licence</strong><small>Fork, audit, and contribute</small></span><ExternalLink size={15} /></a>
          </div>
        </section>

        <section id="evidence" className="evidence-section section-frame" aria-labelledby="evidence-title">
          <div className="section-heading">
            <div><p className="section-index">03 / EVIDENCE</p><h2 id="evidence-title">Evidence, with the boundary visible.</h2></div>
            <p>Automated results verify implementation mechanics. They do not constitute full WCAG conformance or replace testing with disabled users.</p>
          </div>
          <div className="evidence-grid">
            <div className="evidence-table-wrap">
              <table>
                <caption className="visually-hidden">Current accessibility implementation evidence</caption>
                <thead><tr><th>WCAG</th><th>Behaviour</th><th>Public proof</th><th>Status</th></tr></thead>
                <tbody>{evidence.map((item) => <tr key={item.criterion}><td>{item.criterion}</td><td>{item.behaviour}</td><td>{item.proof}</td><td><span className={item.state === 'Verified' ? 'status-verified' : 'status-implemented'}>{item.state}</span></td></tr>)}</tbody>
              </table>
            </div>
            <aside className="evidence-aside">
              <FileCheck2 size={25} />
              <p className="eyebrow">CURRENT CLAIM</p>
              <h3>Tested implementation, not a conformance badge.</h3>
              <p>CI currently checks semantic rendering, action names, keyboard tabs, warnings, focus movement, lifecycle announcements, and build output.</p>
              <a href={`${repositoryUrl}/blob/main/docs/CONFORMANCE.md`} target="_blank" rel="noreferrer">Read conformance notes <ArrowRight size={15} /></a>
            </aside>
          </div>
        </section>

        <section id="roadmap" className="roadmap-section section-frame" aria-labelledby="roadmap-title">
          <div className="section-heading">
            <div><p className="section-index">04 / DELIVERY</p><h2 id="roadmap-title">A bounded path from alpha to adoption.</h2></div>
            <p>The public roadmap ties every funded milestone to inspectable output, measurable validation, and release evidence.</p>
          </div>
          <div className="roadmap-track">
            <article className="roadmap-current"><p>NOW / PUBLIC ALPHA</p><h3>Reusable transaction review core</h3><ul><li>React component and typed model</li><li>Lifecycle announcement hook</li><li>Interactive failure and preference lab</li><li>CI, source, tests, and MIT licence</li></ul></article>
            <article><p>M1 / WEEK 4</p><h3>Wallet-ready alpha</h3><ul><li>Wallet Adapter reference app</li><li>Four transaction adapters</li><li>25 automated tests</li><li>WCAG 2.2 implementation map</li></ul></article>
            <article><p>M2 / WEEK 9</p><h3>Validated beta</h3><ul><li>Five compensated user sessions</li><li>Assistive-technology test matrix</li><li>Blocking findings resolved</li><li>Public beta release report</li></ul></article>
            <article><p>M3 / WEEK 14</p><h3>Adoption release</h3><ul><li>Two public integration pilots</li><li>Independent accessibility review</li><li>Public issue and resolution log</li><li>Tagged 1.0 release</li></ul></article>
          </div>
          <div className="roadmap-footer"><Users size={19} /><p><strong>Success is adoption, not output volume.</strong> The final milestone only counts integrations that are publicly verifiable or confirmed by maintainers.</p><a href={`${repositoryUrl}/blob/main/docs/GRANT_APPLICATION.md`} target="_blank" rel="noreferrer">Full delivery plan <ExternalLink size={14} /></a></div>
        </section>
      </main>

      <footer className="site-footer section-frame">
        <div><span className="brand-mark" aria-hidden="true"><Accessibility size={19} /></span><span><strong>AccessSol</strong><small>Accessible transaction infrastructure for Solana.</small></span></div>
        <p>React 18+ / MIT / Public alpha</p>
        <div><a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub</a><a href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">Issues</a><a href={`${repositoryUrl}/blob/main/docs/TEST_MATRIX.md`} target="_blank" rel="noreferrer">Test matrix</a></div>
      </footer>
    </div>
  )
}

function PreferenceRow({ icon, label, detail, checked, onChange }: { icon: React.ReactNode; label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="preference-row"><span className="preference-icon" aria-hidden="true">{icon}</span><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>
}

function CheckItem({ label }: { label: string }) {
  return <div><Check size={14} aria-hidden="true" /><span>{label}</span></div>
}
