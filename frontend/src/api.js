const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to reach backend health');
  return res.json();
}

export async function fetchDealMemory(dealId = 'acme') {
  const res = await fetch(`${API_BASE}/deals/${dealId}/memory`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch deal memory');
  }
  return res.json();
}

export async function fetchMeetingPrep(dealId = 'acme') {
  const res = await fetch(`${API_BASE}/deals/${dealId}/prepare`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch meeting preparation');
  }
  return res.json();
}

export async function fetchLearnedInsights(dealId = 'acme') {
  const res = await fetch(`${API_BASE}/deals/${dealId}/learn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to trigger learning reflection');
  }
  return res.json();
}

export async function askDealAgent(dealId = 'acme', question) {
  const res = await fetch(`${API_BASE}/deals/${dealId}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to get answer from DealMemory Agent');
  }
  return res.json();
}

export async function createInteraction(dealId = 'acme', data) {
  const res = await fetch(`${API_BASE}/deals/${dealId}/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to store interaction in Hindsight');
  }
  return res.json();
}

export async function createOutcome(dealId = 'acme', data) {
  const res = await fetch(`${API_BASE}/deals/${dealId}/outcomes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to store outcome in Hindsight');
  }
  return res.json();
}
