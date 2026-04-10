import React, { useState, useCallback } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    jira: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.001-1.005zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0z"/>
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
      </svg>
    ),
    copy: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/>
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    chevron: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
      </svg>
    ),
    alert: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const Steps = ({ current }) => {
  const steps = [
    { id: 1, label: 'Configure', icon: 'jira' },
    { id: 2, label: 'Fetch Story', icon: 'jira' },
    { id: 3, label: 'Test Cases', icon: 'sparkles' },
    { id: 4, label: 'Playwright', icon: 'code' },
  ];
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className={`step ${current === s.id ? 'active' : ''} ${current > s.id ? 'done' : ''}`}>
            <div className="step-circle">
              {current > s.id ? <Icon name="check" /> : <span>{s.id}</span>}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${current > s.id + 1 || (current >= s.id + 1) ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Test Case Card ────────────────────────────────────────────────────────────
const TestCaseCard = ({ tc, index }) => {
  const [open, setOpen] = useState(false);
  const typeColor = { positive: '#22c55e', negative: '#ef4444', edge: '#f59e0b' };
  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };

  return (
    <div className={`tc-card ${open ? 'open' : ''}`}>
      <div className="tc-header" onClick={() => setOpen(!open)}>
        <div className="tc-meta">
          <span className="tc-id">{tc.id}</span>
          <span className="tc-type" style={{ '--clr': typeColor[tc.type] || '#6b7280' }}>{tc.type}</span>
          <span className="tc-priority" style={{ '--clr': priorityColor[tc.priority] || '#6b7280' }}>{tc.priority}</span>
        </div>
        <h4 className="tc-title">{tc.title}</h4>
        <div className={`tc-chevron ${open ? 'rotated' : ''}`}><Icon name="chevron" /></div>
      </div>
      {open && (
        <div className="tc-body">
          {tc.preconditions && (
            <div className="tc-section">
              <label>Preconditions</label>
              <p>{tc.preconditions}</p>
            </div>
          )}
          <div className="tc-section">
            <label>Steps</label>
            <ol className="tc-steps-list">
              {tc.steps?.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          <div className="tc-section">
            <label>Expected Result</label>
            <p className="expected">{tc.expectedResult}</p>
          </div>
          {tc.tags?.length > 0 && (
            <div className="tc-tags">
              {tc.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);

  // Config
  const [config, setConfig] = useState({
    jiraUrl: '',
    email: '',
    apiToken: '',
    claudeApiKey: '',
    issueKey: '',
  });

  // Data states
  const [story, setStory] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [playwrightScript, setPlaywrightScript] = useState('');

  // Loading states
  const [loading, setLoading] = useState({ story: false, testcases: false, playwright: false });
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const setErr = (key, msg) => setErrors(e => ({ ...e, [key]: msg }));
  const clearErr = (key) => setErrors(e => { const n = { ...e }; delete n[key]; return n; });

  const handleConfigChange = (k, v) => setConfig(c => ({ ...c, [k]: v }));

  // ── Step 1→2: Fetch JIRA Story ─────────────────────────────────────────────
  const fetchStory = useCallback(async () => {
    clearErr('story');
    setLoading(l => ({ ...l, story: true }));
    try {
      const res = await fetch(`${API_BASE}/api/jira/story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jiraUrl: config.jiraUrl,
          email: config.email,
          apiToken: config.apiToken,
          issueKey: config.issueKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch story');
      setStory(data.story);
      setStep(3);
      // Auto-generate test cases
      await generateTestCases(data.story);
    } catch (e) {
      setErr('story', e.message);
    } finally {
      setLoading(l => ({ ...l, story: false }));
    }
  }, [config]);

  // ── Step 2→3: Generate Test Cases ─────────────────────────────────────────
  const generateTestCases = useCallback(async (storyData) => {
    clearErr('testcases');
    setLoading(l => ({ ...l, testcases: true }));
    try {
      const res = await fetch(`${API_BASE}/api/ai/testcases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claudeApiKey: config.claudeApiKey, story: storyData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate test cases');
      setTestCases(data.testCases || []);
      setStep(3);
    } catch (e) {
      setErr('testcases', e.message);
    } finally {
      setLoading(l => ({ ...l, testcases: false }));
    }
  }, [config.claudeApiKey]);

  // ── Step 3→4: Generate Playwright Scripts ─────────────────────────────────
  const generatePlaywright = useCallback(async () => {
    clearErr('playwright');
    setLoading(l => ({ ...l, playwright: true }));
    try {
      const res = await fetch(`${API_BASE}/api/ai/playwright`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claudeApiKey: config.claudeApiKey, testCases, story }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate Playwright scripts');
      setPlaywrightScript(data.script || '');
      setStep(4);
    } catch (e) {
      setErr('playwright', e.message);
    } finally {
      setLoading(l => ({ ...l, playwright: false }));
    }
  }, [config.claudeApiKey, testCases, story]);

  const copyScript = () => {
    navigator.clipboard.writeText(playwrightScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const blob = new Blob([playwrightScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story?.key || 'test'}.spec.ts`;
    a.click();
  };

  const reset = () => {
    setStep(1); setStory(null); setTestCases([]); setPlaywrightScript(''); setErrors({});
  };

  return (
    <div className="app">
      <div className="bg-grid" />
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <Icon name="sparkles" />
            </div>
            <div>
              <h1>TestForge<span className="logo-ai">AI</span></h1>
              <p>JIRA → Test Cases → Playwright</p>
            </div>
          </div>
          {step > 1 && <button className="btn-ghost" onClick={reset}>← Start Over</button>}
        </div>
      </header>

      <main className="main">
        <Steps current={step} />

        {/* ── STEP 1: Configuration ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="card animate-in">
            <div className="card-header">
              <h2>Configure Connections</h2>
              <p>Enter your JIRA and Claude API credentials to get started</p>
            </div>

            <div className="form-grid">
              <div className="form-section">
                <div className="section-title"><Icon name="jira" /> JIRA Configuration</div>
                <div className="field">
                  <label>JIRA Base URL</label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.atlassian.net"
                    value={config.jiraUrl}
                    onChange={e => handleConfigChange('jiraUrl', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={config.email}
                    onChange={e => handleConfigChange('email', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>JIRA API Token</label>
                  <input
                    type="password"
                    placeholder="Your JIRA API token"
                    value={config.apiToken}
                    onChange={e => handleConfigChange('apiToken', e.target.value)}
                  />
                  <span className="field-hint">
                    Generate at: <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer">id.atlassian.com → API tokens</a>
                  </span>
                </div>
                <div className="field">
                  <label>Issue Key</label>
                  <input
                    type="text"
                    placeholder="PROJECT-123"
                    value={config.issueKey}
                    onChange={e => handleConfigChange('issueKey', e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="section-title"><Icon name="sparkles" /> AI Configuration</div>
                <div className="field">
                  <label>Claude API Key</label>
                  <input
                    type="password"
                    placeholder="sk-ant-..."
                    value={config.claudeApiKey}
                    onChange={e => handleConfigChange('claudeApiKey', e.target.value)}
                  />
                  <span className="field-hint">
                    Get free key at: <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>
                  </span>
                </div>
                <div className="ai-info">
                  <div className="ai-info-icon"><Icon name="sparkles" /></div>
                  <div>
                    <strong>Powered by Claude Sonnet 4</strong>
                    <p>AI generates comprehensive test cases from your story, then converts them to production-ready Playwright TypeScript scripts.</p>
                  </div>
                </div>
                <div className="pipeline-viz">
                  <div className="pipe-step"><Icon name="jira" /><span>JIRA Story</span></div>
                  <div className="pipe-arrow">→</div>
                  <div className="pipe-step"><Icon name="sparkles" /><span>Test Cases</span></div>
                  <div className="pipe-arrow">→</div>
                  <div className="pipe-step"><Icon name="code" /><span>Playwright</span></div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!config.jiraUrl || !config.email || !config.apiToken || !config.claudeApiKey || !config.issueKey}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Fetch Story ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="card animate-in">
            <div className="card-header">
              <h2>Fetch JIRA Story</h2>
              <p>Retrieve story <strong>{config.issueKey}</strong> and auto-generate test cases</p>
            </div>

            <div className="issue-preview">
              <div className="issue-key-badge"><Icon name="jira" /> {config.issueKey}</div>
              <div className="issue-endpoint">{config.jiraUrl}/browse/{config.issueKey}</div>
            </div>

            {errors.story && (
              <div className="error-box">
                <Icon name="alert" /> {errors.story}
              </div>
            )}

            <div className="card-footer">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn-primary"
                onClick={fetchStory}
                disabled={loading.story}
              >
                {loading.story ? <><span className="spinner" /> Fetching & Generating...</> : 'Fetch & Auto-Generate →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Story + Test Cases ────────────────────────────────── */}
        {step === 3 && story && (
          <div className="animate-in">
            {/* Story Panel */}
            <div className="card story-card">
              <div className="card-header">
                <div className="story-header-inner">
                  <span className="issue-badge"><Icon name="jira" /> {story.key}</span>
                  <span className={`status-badge status-${story.status?.toLowerCase().replace(/\s/g, '-')}`}>{story.status}</span>
                  {story.priority && <span className="priority-badge">{story.priority}</span>}
                </div>
                <h2>{story.summary}</h2>
              </div>
              {story.description && (
                <div className="story-description">
                  <label>Description</label>
                  <p>{story.description}</p>
                </div>
              )}
              {story.acceptanceCriteria && (
                <div className="story-description">
                  <label>Acceptance Criteria</label>
                  <p>{story.acceptanceCriteria}</p>
                </div>
              )}
            </div>

            {/* Test Cases */}
            <div className="card">
              <div className="card-header between">
                <div>
                  <h2><Icon name="sparkles" /> Generated Test Cases</h2>
                  <p>{testCases.length} test cases generated by AI</p>
                </div>
                {!loading.testcases && testCases.length > 0 && (
                  <button className="btn-primary" onClick={generatePlaywright} disabled={loading.playwright}>
                    {loading.playwright ? <><span className="spinner" /> Generating...</> : <><Icon name="code" /> Generate Playwright →</>}
                  </button>
                )}
              </div>

              {loading.testcases && (
                <div className="loading-state">
                  <div className="loading-orb" />
                  <p>AI is analyzing your story and generating test cases...</p>
                </div>
              )}

              {errors.testcases && (
                <div className="error-box"><Icon name="alert" /> {errors.testcases}</div>
              )}

              {!loading.testcases && testCases.length > 0 && (
                <div className="tc-grid">
                  {testCases.map((tc, i) => <TestCaseCard key={tc.id || i} tc={tc} index={i} />)}
                </div>
              )}

              {errors.playwright && (
                <div className="error-box mt"><Icon name="alert" /> {errors.playwright}</div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 4: Playwright Script ─────────────────────────────────── */}
        {step === 4 && playwrightScript && (
          <div className="animate-in">
            <div className="card story-card">
              <div className="card-header between">
                <div className="story-header-inner">
                  <span className="issue-badge"><Icon name="jira" /> {story?.key}</span>
                  <h2>{story?.summary}</h2>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header between">
                <div>
                  <h2><Icon name="code" /> Playwright Test Script</h2>
                  <p>{story?.key}.spec.ts — TypeScript • {testCases.length} test cases</p>
                </div>
                <div className="btn-group">
                  <button className="btn-ghost" onClick={() => setStep(3)}>
                    <Icon name="eye" /> View Test Cases
                  </button>
                  <button className="btn-ghost" onClick={copyScript}>
                    {copied ? <><Icon name="check" /> Copied!</> : <><Icon name="copy" /> Copy</>}
                  </button>
                  <button className="btn-primary" onClick={downloadScript}>
                    <Icon name="download" /> Download .ts
                  </button>
                </div>
              </div>

              <div className="code-wrapper">
                <div className="code-toolbar">
                  <span className="code-lang">TypeScript</span>
                  <span className="code-file">{story?.key}.spec.ts</span>
                </div>
                <pre className="code-block"><code>{playwrightScript}</code></pre>
              </div>
            </div>

            <div className="install-guide card">
              <h3>🚀 Quick Start</h3>
              <div className="code-snippet">
                <code>npm init playwright@latest</code>
              </div>
              <div className="code-snippet">
                <code>cp {story?.key}.spec.ts tests/</code>
              </div>
              <div className="code-snippet">
                <code>npx playwright test {story?.key}.spec.ts</code>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>TestForge AI · Built with Claude Sonnet 4 · JIRA REST API v3</p>
      </footer>
    </div>
  );
}
