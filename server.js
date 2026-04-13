const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Fetch JIRA story
app.post('/api/jira/story', async (req, res) => {
  const { jiraUrl, email, apiToken, issueKey } = req.body;
  if (!jiraUrl || !email || !apiToken || !issueKey) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const base64 = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const cleanUrl = jiraUrl.replace(/\/$/, '');
    const url = `${cleanUrl}/rest/api/3/issue/${issueKey}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${base64}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.errorMessages?.join(', ') || data.message || 'JIRA API error' });
    }

    // Extract relevant fields
    const story = {
      key: data.key,
      summary: data.fields.summary,
      description: extractDescription(data.fields.description),
      acceptanceCriteria: extractAcceptanceCriteria(data.fields),
      status: data.fields.status?.name,
      priority: data.fields.priority?.name,
      issueType: data.fields.issuetype?.name,
      assignee: data.fields.assignee?.displayName,
      labels: data.fields.labels || [],
      storyPoints: data.fields.story_points || data.fields.customfield_10016,
    };

    res.json({ story });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate test cases via Claude API
app.post('/api/ai/testcases', async (req, res) => {
  const { claudeApiKey, story } = req.body;
  if (!claudeApiKey || !story) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are a senior QA engineer. Based on the following JIRA user story, generate comprehensive test cases.

JIRA Story: ${story.key}
Summary: ${story.summary}
Description: ${story.description || 'No description provided'}
Acceptance Criteria: ${story.acceptanceCriteria || 'Not specified'}
Priority: ${story.priority || 'Not specified'}

Generate test cases in the following JSON format only (no markdown, just raw JSON):
{
  "testCases": [
    {
      "id": "TC001",
      "title": "Test case title",
      "type": "positive|negative|edge",
      "priority": "high|medium|low",
      "preconditions": "What needs to be set up before the test",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "expectedResult": "What should happen",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Generate at least 6-10 meaningful test cases covering positive, negative, and edge cases. Return ONLY valid JSON.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Claude API error' });
    }

    const text = data.content?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate Playwright scripts via Claude API
app.post('/api/ai/playwright', async (req, res) => {
  const { claudeApiKey, testCases, story } = req.body;
  if (!claudeApiKey || !testCases) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const testCasesText = testCases.map(tc =>
    `ID: ${tc.id}
Title: ${tc.title}
Type: ${tc.type}
Preconditions: ${tc.preconditions}
Steps: ${tc.steps.join(' → ')}
Expected: ${tc.expectedResult}`
  ).join('\n\n---\n\n');

  const prompt = `You are a senior automation engineer. Convert the following test cases for JIRA story "${story?.key}: ${story?.summary}" into Playwright Python test scripts.

TEST CASES:
${testCasesText}

Generate a complete, runnable Playwright Python test file using pytest-playwright. Follow these rules:
1. Use Python with proper imports (playwright.sync_api, pytest)
2. Use pytest fixtures for browser/page setup
3. Add meaningful comments
4. Use synchronous Playwright API (sync_playwright)
5. Include setup/teardown via pytest fixtures
6. Use descriptive test function names prefixed with test_
7. Add placeholder selectors like page.locator('[data-testid="element"]') - use realistic selectors based on context
8. Include assertions using pytest assert statements
9. Group related tests in a class prefixed with Test
10. Add a conftest.py section as a comment at the top

Return ONLY the Python code, no explanations or markdown. Start directly with the import statements.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 6000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Claude API error' });
    }

    const script = data.content?.[0]?.text || '';
    res.json({ script });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function extractDescription(desc) {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  // Atlassian Document Format
  const texts = [];
  function traverse(node) {
    if (!node) return;
    if (node.type === 'text') texts.push(node.text);
    if (node.content) node.content.forEach(traverse);
  }
  traverse(desc);
  return texts.join(' ');
}

function extractAcceptanceCriteria(fields) {
  // Try common custom field names
  const acField = fields.customfield_10014 || fields.customfield_10020 || fields.acceptance_criteria;
  if (acField) return typeof acField === 'string' ? acField : extractDescription(acField);
  // Try to find it in description
  return '';
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
