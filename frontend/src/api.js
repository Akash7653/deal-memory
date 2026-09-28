const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://dealmemory-api.onrender.com').replace(/\/+$/, '');

function getAuthHeaders() {
  const token = localStorage.getItem('dealmemory_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to reach backend health');
  return res.json();
}

// ----------------- Auth Endpoints -----------------

export async function registerUser({ full_name, email, password, confirm_password, company }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password, confirm_password, company }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to register account');
  }
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Invalid email or password');
  }
  return data;
}

export async function fetchMe() {
  const token = localStorage.getItem('dealmemory_token');
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    localStorage.removeItem('dealmemory_token');
    return null;
  }
  return res.json();
}

export async function updateUserProfile(profileData) {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to update profile');
  }
  return data;
}

export async function logoutUser() {
  const token = localStorage.getItem('dealmemory_token');
  if (token) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).catch(() => {});
  }
  localStorage.removeItem('dealmemory_token');
}

// ----------------- Deals Endpoints -----------------

export async function fetchDeals(includeDemo = true) {
  const res = await fetch(`${API_BASE}/deals?include_demo=${includeDemo}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch deals');
  }
  return res.json();
}

export async function createDeal(dealData) {
  const res = await fetch(`${API_BASE}/deals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dealData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create deal');
  }
  return res.json();
}

export async function deleteDeal(dealId) {
  const res = await fetch(`${API_BASE}/deals/${dealId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete deal');
  }
  return res.json();
}

// ----------------- History Endpoints -----------------

export async function fetchHistory(activityType = 'all', dealId = 'all', limit = 50) {
  let url = `${API_BASE}/history?limit=${limit}`;
  if (activityType && activityType !== 'all') url += `&activity_type=${activityType}`;
  if (dealId && dealId !== 'all') url += `&deal_id=${dealId}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('dealmemory_token');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch user history');
  }
  return res.json();
}

export async function deleteHistoryItem(activityId) {
  const res = await fetch(`${API_BASE}/history/${activityId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete activity item');
  }
  return res.json();
}

// ----------------- Hindsight Core Deal Intelligence -----------------

export async function fetchDealMemory(dealId = 'acme') {
  const res = await fetch(`${API_BASE}/deals/${dealId}/memory`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch deal memory');
  }
  return res.json();
}

export async function fetchMeetingPrep(dealId = 'acme') {
  const res = await fetch(`${API_BASE}/deals/${dealId}/prepare`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch meeting preparation');
  }
  return res.json();
}

export async function fetchLearnedInsights(dealId = 'acme') {
  const res = await fetch(`${API_BASE}/deals/${dealId}/learn`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to store interaction in Hindsight');
  }
  return res.json();
}

export const postInteraction = createInteraction;

export async function createOutcome(dealId = 'acme', data) {
  const res = await fetch(`${API_BASE}/deals/${dealId}/outcomes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to store outcome in Hindsight');
  }
  return res.json();
}
